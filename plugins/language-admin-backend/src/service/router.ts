import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import { Config } from '@backstage/config';
import Router from 'express-promise-router';
import { assertError } from '@backstage/errors';
import { Logger } from 'winston';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import * as tags from 'language-tags';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export type LanguageMetadata = {
  availableLanguages: string[];
  languages: Record<string, string>;
};

async function getWorkingDirectory(
  config: Config,
  logger: Logger,
): Promise<string> {
  if (!config.has('backend.workingDirectory')) {
    return os.tmpdir();
  }
  const workingDirectory = config.getString('backend.workingDirectory');
  try {
    // Check if working directory exists and is writable
    await fs.access(workingDirectory, fs.constants.F_OK | fs.constants.W_OK);
    logger.info(`using working directory: ${workingDirectory}`);
  } catch (err) {
    assertError(err);
    logger.error(
      `working directory ${workingDirectory} ${
        err.code === 'ENOENT' ? 'does not exist' : 'is not writable'
      }`,
    );
    throw err;
  }
  return workingDirectory;
}

function* discoverLangFiles(
  directory: string,
  code: string,
): Generator<string> {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* discoverLangFiles(path.join(directory, file.name), code);
    } else {
      if (file.name.endsWith(`${code}.json`)) {
        yield path.join(directory, file.name);
      }
    }
  }
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { config, logger } = options;

  const workingDirectory = path.join(
    await getWorkingDirectory(config, logger),
    'languages',
  );

  const router = Router();
  router.use(express.json({ limit: '10MB' }));

  router.get('/health', (_, response) => {
    response.json({ status: 'ok' });
  });

  router
    /**
     * List the available languages
     */
    .get('/list', async (request, response) => {
      logger.info(`list, query: ${JSON.stringify(request.query)}`);
      const metadata = fs.readJsonSync(
        path.join(workingDirectory, 'metadata.json'),
      ) as LanguageMetadata;
      const items = metadata.availableLanguages.map((lang: string) => {
        return {
          name: tags.language(lang)?.descriptions()[0] || lang,
          languageCode: lang,
          createdAt: new Date(),
          isDefault: lang === 'en',
        };
      });
      response.json({ items, totalCount: items.length, offset: 0, limit: 0 });
    })
    /**
     * Download a language file to use as a template
     */
    .get('/language', (request, response) => {
      logger.info(`get language, query: ${JSON.stringify(request.query)}`);
      const { code } = request.query;
      const codeAsString = `${code || 'en'}`;
      const document = {
        languageCode: code,
        translation: {} as Record<string, any>,
      };
      for (const file of discoverLangFiles(workingDirectory, codeAsString)) {
        const translation = fs.readJsonSync(file);
        const bits = file.split(path.sep);
        const namespace = bits[bits.length - 2];
        document.translation[namespace] = translation;
      }
      response.setHeader('Content-Type', 'application/json');
      response.setHeader(
        'Content-disposition',
        `attachment; filename=${code}.json`,
      );
      response.send(JSON.stringify(document, undefined, 2));
    })
    /**
     * Delete a language file
     */
    .delete('/language', async (request, response) => {
      logger.info(`delete language, query: ${JSON.stringify(request.query)}`);
      const { code } = request.query;
      if (!code) {
        response.status(400).send({
          message: `delete failed, no language code sent`,
        });
        return;
      }
      const codeAsString = `${code}`;
      if (!tags.check(codeAsString)) {
        response.status(400).send({
          message: `delete failed, unknown language code "${code}"`,
        });
        return;
      }
      const metadata = fs.readJsonSync(
        path.join(workingDirectory, 'metadata.json'),
      ) as LanguageMetadata;
      const availableLanguages = metadata.availableLanguages.filter(
        lang => lang !== code,
      );
      fs.outputJsonSync(path.join(workingDirectory, 'metadata.json'), {
        ...metadata,
        availableLanguages,
      });
      for (const file of discoverLangFiles(workingDirectory, codeAsString)) {
        try {
          await fs.remove(file);
        } catch (err) {
          logger.info(`Caught "${err}" while deleting file "${file}"`);
        }
      }
      response.sendStatus(200);
    })
    /**
     * Upload or replace a language file
     */
    .post('/language', async (request, response) => {
      logger.info(`upload language, query: ${JSON.stringify(request.query)}`);
      const { languageCode, translation } = request.body;
      if (!languageCode || !translation) {
        response.status(400).send({
          message:
            'Invalid translation document uploaded, missing languageCode attribute',
        });
        return;
      }
      if (!translation) {
        response.status(400).send({
          message:
            'Invalid translation document uploaded, missing translation attribute',
        });
        return;
      }
      if (!tags.check(languageCode)) {
        response.status(400).send({
          message: `Invalid translation document uploaded, unknown language code "${languageCode}"`,
        });
        return;
      }
      const metadata = fs.readJsonSync(
        path.join(workingDirectory, 'metadata.json'),
      ) as LanguageMetadata;
      const availableLanguages = Array.from(
        new Set([...metadata.availableLanguages, languageCode]),
      );
      fs.outputJsonSync(path.join(workingDirectory, 'metadata.json'), {
        ...metadata,
        availableLanguages,
      });
      Object.keys(translation).forEach(namespace => {
        const filePath = path.join(
          workingDirectory,
          namespace,
          `${languageCode}.json`,
        );
        fs.outputJsonSync(filePath, translation[namespace]);
      });
      response.sendStatus(200);
    });

  router.use(errorHandler());
  return router;
}
