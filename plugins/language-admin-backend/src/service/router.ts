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
  router.use(express.json());

  router.get('/health', (_, response) => {
    response.json({ status: 'ok' });
  });

  router.get('/list', async (request, response) => {
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
  });

  router.get('/template', (request, response) => {
    logger.info(`template, query: ${JSON.stringify(request.query)}`);
    const { code } = request.query;
    const codeAsString = `${code || 'en'}`;
    const document = {
      languageCode: code,
      translation: {} as Record<string, any>,
    };
    for (const file of discoverLangFiles(workingDirectory, codeAsString)) {
      console.log('File: ', file);
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
  });

  router.use(errorHandler());
  return router;
}
