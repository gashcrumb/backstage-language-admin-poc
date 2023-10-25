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
  offset?: number;
  limit?: number;
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

export type GetLanguageTemplateOptions = {
  code: string;
};

export type GetLanguageTemplateResult = {
  data: any;
};

export interface LanguageAdminApi {
  getLanguageTemplate(
    options: GetLanguageTemplateOptions,
  ): Promise<GetLanguageTemplateResult>;

  listLanguages(options: ListLanguagesOptions): Promise<ListLanguagesResult>;
}

export const languageAdminApiRef = createApiRef<LanguageAdminApi>({
  id: 'language-admin',
});
