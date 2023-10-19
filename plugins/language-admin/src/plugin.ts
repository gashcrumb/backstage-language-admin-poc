import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const languageAdminPlugin = createPlugin({
  id: 'language-admin',
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
