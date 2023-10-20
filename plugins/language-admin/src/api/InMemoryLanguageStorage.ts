import {
  GetLanguageTemplateOptions,
  LanguageStorageApi,
  ListLanguagesOptions,
  ListLanguagesResult,
} from './types';

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

export class InMemoryLanguageStorage implements LanguageStorageApi {
  constructor() {}

  async getLanguageTemplate(
    options: GetLanguageTemplateOptions,
  ): Promise<GetLanguageTemplateResult> {
    console.log('Options: ', options);
    return Promise.resolve({ data: {} });
  }

  async listLanguages(
    options: ListLanguagesOptions,
  ): Promise<ListLanguagesResult> {
    console.log('Options: ', options);
    return { items: languages, totalCount: 3, offset: 0, limit: 0 };
  }
}
