import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import {
  i18NExampleFrontendPlugin,
  I18NExampleFrontendPage,
} from '../src/plugin';

createDevApp()
  .registerPlugin({
    ...i18NExampleFrontendPlugin,
  })
  .addPage({
    element: <I18NExampleFrontendPage />,
    title: 'Root Page',
    path: '/i18n-example-frontend',
  })
  .render();
