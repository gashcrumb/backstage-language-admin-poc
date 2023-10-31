import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { addLanguageRouteRef, rootRouteRef } from './routes';
import { languageStorageApiRef } from './api';
import { LanguageAdminClient } from './api/LanguageAdminClient';

export const languageAdminPlugin = createPlugin({
  id: 'language-admin',
  apis: [
    createApiFactory({
      api: languageStorageApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory({ discoveryApi, fetchApi }) {
        return new LanguageAdminClient({ discoveryApi, fetchApi });
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
    addLanguage: addLanguageRouteRef,
  },
});

export const LanguageAdminPage = languageAdminPlugin.provide(
  createRoutableExtension({
    name: 'LanguageAdminPage',
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);
