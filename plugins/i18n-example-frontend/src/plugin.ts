import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const i18NExampleFrontendPlugin = createPlugin({
  id: 'i18n-example-frontend',
  routes: {
    root: rootRouteRef,
  },
});

export const I18NExampleFrontendPage = i18NExampleFrontendPlugin.provide(
  createRoutableExtension({
    name: 'I18NExampleFrontendPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
