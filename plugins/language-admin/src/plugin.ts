import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { languageStorageApiRef } from './api';
import { InMemoryLanguageStorage } from './api/InMemoryLanguageStorage';

export const languageAdminPlugin = createPlugin({
  id: 'language-admin',
  apis: [
    createApiFactory({
      api: languageStorageApiRef,
      deps: {},
      factory() {
        return new InMemoryLanguageStorage();
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const LanguageAdminPage = languageAdminPlugin.provide(
  createRoutableExtension({
    name: 'LanguageAdminPage',
    component: () =>
      import('./components/AdminPage').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
