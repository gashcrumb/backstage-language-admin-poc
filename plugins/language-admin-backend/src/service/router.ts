import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import { Config } from '@backstage/config';
import Router from 'express-promise-router';
import { assertError } from '@backstage/errors';
import { Logger } from 'winston';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

//const DEFAULT_LANGUAGE = 'en';

//const availableLanguages = ['en', 'de', 'ja'];

const languages = [
  {
    name: 'English (US)',
    languageCode: 'en',
    createdAt: new Date('03/22/2022'),
    isDefault: true,
  },
  {
    name: 'German (DE)',
    languageCode: 'de',
    createdAt: new Date('03/01/2022'),
    isDefault: false,
  },
  {
    name: 'Japanese (JA)',
    languageCode: 'ja',
    createdAt: new Date(),
    isDefault: false,
  },
];

export type LanguageMetadata = {
  availableLanguages: string[];
  languages: Record<string, string>;
};

export async function getWorkingDirectory(
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
    const languages = metadata.availableLanguages.map((lang: string) => {
      return {
        name: metadata.languages[lang],
        languageCode: lang,
        createdAt: new Date(),
        isDefault: lang === 'en',
      };
    });
    response.json({ items: languages, totalCount: 3, offset: 0, limit: 0 });
  });

  router.get('/template', (request, response) => {
    logger.info(`template, query: ${JSON.stringify(request.query)}`);
    response.json({ status: 'ok' });
  });

  router.use(errorHandler());
  return router;
}
