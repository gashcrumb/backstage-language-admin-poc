import { createApiRef } from '@backstage/core-plugin-api';

export type Language = {
  name: string;
  languageCode: string;
  createdAt: Date;
  isDefault?: boolean;
};

export type LanguageFields =
  | 'name'
  | 'languageCode'
  | 'createdAt'
  | 'isDefault';

export type ListLanguagesOptions = {
  orderBy?: {
    field: LanguageFields;
    direction: 'asc' | 'desc';
  };
  filters?: {
    field: LanguageFields;
    /** Value to filter by, with '*' used as wildcard */
    value: string;
  };
};

export type ListLanguagesResult = {
  items: Language[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type GetLanguageOptions = {
  code: string;
};

export type AddLanguageOptions = {};

export interface LanguageAdminApi {
  addLanguage(options: AddLanguageOptions): Promise<void>;
  deleteLanguage(options: GetLanguageOptions): Promise<void>;
  downloadLanguage(options: GetLanguageOptions): Promise<void>;
  listLanguages(options: ListLanguagesOptions): Promise<ListLanguagesResult>;
}

export const languageAdminApiRef = createApiRef<LanguageAdminApi>({
  id: 'language-admin',
});
