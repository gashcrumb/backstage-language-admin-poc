import { createRouter } from '@internal/plugin-language-admin-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const { config, logger } = env;
  return await createRouter({
    config,
    logger,
  });
}
