import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { languageAdminPlugin, LanguageAdminPage } from '../src/plugin';

createDevApp()
  .registerPlugin(languageAdminPlugin)
  .addPage({
    element: <LanguageAdminPage />,
    title: 'Root Page',
    path: '/language-admin'
  })
  .render();
