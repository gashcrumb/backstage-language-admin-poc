import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import {
  GetLanguageTemplateOptions,
  LanguageAdminApi,
  ListLanguagesOptions,
  ListLanguagesResult,
} from './types';

export interface LanguageAdminClientOptions {
  discoveryApi: DiscoveryApi;
  fetchApi: FetchApi;
}

const languageEndpoint = 'language';
const listEndpoint = 'list';

export class LanguageAdminClient implements LanguageAdminApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: LanguageAdminClientOptions) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getLanguageTemplate(
    options: GetLanguageTemplateOptions,
  ): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('language-admin');
    const targetUrl = `${baseUrl}/${languageEndpoint}${
      typeof options !== 'undefined'
        ? `?${new URLSearchParams(options).toString()}`
        : ''
    }`;
    this.fetchApi
      .fetch(targetUrl, {
        method: 'GET',
      })
      .then(res => res.blob())
      .then(res => {
        const aElement = document.createElement('a');
        aElement.setAttribute('download', `${options.code}.json`);
        const href = URL.createObjectURL(res);
        aElement.href = href;
        aElement.setAttribute('target', '_blank');
        aElement.click();
        URL.revokeObjectURL(href);
      });
  }

  async listLanguages(
    options: ListLanguagesOptions,
  ): Promise<ListLanguagesResult> {
    const baseUrl = await this.discoveryApi.getBaseUrl('language-admin');
    const { orderBy, filters } = options;
    console.log('OrderBy: ', orderBy, ' filters: ', filters);
    const targetUrl = `${baseUrl}/${listEndpoint}${
      typeof options !== 'undefined'
        ? `?${new URLSearchParams({
            ...(orderBy
              ? { orderBy: `${orderBy.field} ${orderBy.direction}` }
              : {}),
          }).toString()}`
        : ''
    }`;
    const result = await this.fetchApi.fetch(targetUrl);
    const data = await result.json();
    if (!result.ok) {
      throw new Error(`${data.message}`);
    }
    return data;
  }
}
