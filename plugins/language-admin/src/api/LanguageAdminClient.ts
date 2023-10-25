import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import {
  GetLanguageTemplateOptions,
  GetLanguageTemplateResult,
  LanguageAdminApi,
  ListLanguagesOptions,
  ListLanguagesResult,
} from './types';

export interface LanguageAdminClientOptions {
  discoveryApi: DiscoveryApi;
  fetchApi: FetchApi;
}

const templateEndpoint = 'template';
const listEndpoint = 'list';

export class LanguageAdminClient implements LanguageAdminApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: LanguageAdminClientOptions) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  private async fetchLanguageAdminApi<T>(
    endpoint: string,
    options: Record<string, any> = {},
  ): Promise<T> {
    const baseUrl = await this.discoveryApi.getBaseUrl('language-admin');
    const targetUrl = `${baseUrl}/${endpoint}${
      typeof options !== 'undefined'
        ? `?${new URLSearchParams(options).toString()}`
        : ''
    }`;
    const result = await this.fetchApi.fetch(targetUrl, options);
    const data = await result.json();
    if (!result.ok) {
      throw new Error(`${data.message}`);
    }
    return data;
  }

  async getLanguageTemplate(
    options: GetLanguageTemplateOptions,
  ): Promise<GetLanguageTemplateResult> {
    console.log('Options: ', options);
    return this.fetchLanguageAdminApi<GetLanguageTemplateResult>(
      templateEndpoint,
      options,
    );
  }

  async listLanguages(
    options: ListLanguagesOptions,
  ): Promise<ListLanguagesResult> {
    console.log('Options: ', options);
    return this.fetchLanguageAdminApi<ListLanguagesResult>(
      listEndpoint,
      options,
    );
  }
}
