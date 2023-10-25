import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';

import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';

import { UnifiedThemeProvider } from '@backstage/theme';
import LightIcon from '@mui/icons-material/WbSunny';
import DarkIcon from '@mui/icons-material/Brightness2';
import { lightTheme, darkTheme } from 'patternfly-backstage-theme';

import { I18NExampleFrontendPage } from '@internal/plugin-i18n-example-frontend';
import {
  TranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';
import { LanguageAdminPage } from '@internal/plugin-language-admin';

const app = createApp({
  __experimentalTranslations: {
    availableLanguages: ['en', 'de', 'ja'],
    resources: [
      createTranslationResource({
        translations: {
          en: async () => await import('./locales/app-translations/en.json'),
          de: async () => await import('./locales/app-translations/de.json'),
          ja: async () => await import('./locales/app-translations/ja.json'),
        },
        ref: { id: 'app-translations' } as TranslationRef,
      }),
      createTranslationResource({
        translations: {
          en: async () =>
            await import('./locales/i18n-example-frontend/en.json'),
          de: async () =>
            await import('./locales/i18n-example-frontend/de.json'),
          ja: async () =>
            await import('./locales/i18n-example-frontend/ja.json'),
        },
        ref: { id: 'i18n-example-frontend' } as TranslationRef,
      }),
      createTranslationResource({
        translations: {
          en: async () => await import('./locales/language-admin/en.json'),
          de: async () => await import('./locales/language-admin/de.json'),
          ja: async () => await import('./locales/language-admin/ja.json'),
        },
        ref: { id: 'language-admin' } as TranslationRef,
      }),
      createTranslationResource({
        translations: {
          en: async () => await import('./locales/user-settings/en.json'),
          de: async () => await import('./locales/user-settings/de.json'),
          ja: async () => await import('./locales/user-settings/ja.json'),
        },
        ref: { id: 'user-settings' } as TranslationRef,
      }),
    ],
  },
  apis,
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
  themes: [
    {
      id: 'light-theme',
      title: 'Light Theme',
      variant: 'light',
      icon: <LightIcon />,
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={lightTheme} children={children} />
      ),
    },
    {
      id: 'dark-theme',
      title: 'Dark Theme',
      variant: 'dark',
      icon: <DarkIcon />,
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={darkTheme} children={children} />
      ),
    },
  ],
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<Navigate to="catalog" />} />
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
    <Route
      path="/catalog-import"
      element={
        <RequirePermission permission={catalogEntityCreatePermission}>
          <CatalogImportPage />
        </RequirePermission>
      }
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route
      path="/i18n-example-frontend"
      element={<I18NExampleFrontendPage />}
    />
    <Route path="/language-admin" element={<LanguageAdminPage />} />
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
