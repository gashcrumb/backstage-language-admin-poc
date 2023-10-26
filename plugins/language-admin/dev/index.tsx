import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { languageAdminPlugin, LanguageAdminPage } from '../src/plugin';
import {
  GetLanguageTemplateOptions,
  ListLanguagesOptions,
  languageAdminApiRef,
} from '../src/api/types';
import { TestApiProvider } from '@backstage/test-utils';

export const listLanguagesResult = {
  items: [
    {
      name: 'English (US)',
      languageCode: 'en_US',
      createdAt: new Date('03/22/2022'),
      isDefault: true,
    },
    {
      name: 'German (DE)',
      languageCode: 'de_DE',
      createdAt: new Date('03/01/2022'),
      isDefault: false,
    },
    {
      name: 'Japanese (JA)',
      languageCode: 'ja_JP',
      createdAt: new Date(),
      isDefault: false,
    },
  ],
  totalCount: 3,
  offset: 0,
  limit: 0,
};

const mockedApi = {
  listLanguages: async (options: ListLanguagesOptions) => {
    console.log('listing languages with options: ', options);
    return listLanguagesResult;
  },
  getLanguageTemplate: async (options: GetLanguageTemplateOptions) => {
    console.log('getting language template with options: ', options);
  },
};

createDevApp()
  .registerPlugin(languageAdminPlugin)
  .addPage({
    element: (
      <TestApiProvider apis={[[languageAdminApiRef, mockedApi]]}>
        <LanguageAdminPage />
      </TestApiProvider>
    ),
    title: 'Root Page',
    path: '/language-admin',
  })
  .render();
