import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'language-admin:index-page',
});

export const addLanguageRouteRef = createSubRouteRef({
  parent: rootRouteRef,
  path: '/add',
  id: 'language-admin:add-language-page',
});
