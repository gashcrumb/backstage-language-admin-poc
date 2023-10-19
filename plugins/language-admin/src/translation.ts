import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

export const languageAdminTranslationRef = createTranslationRef({
  id: 'language-admin',
  messages: {
    'Download a template': 'Download a template',
    'Golden Paths': 'Golden Paths',
    'Languages ({{count}})': 'Languages ({{count}})',
    Languages: 'Languages',
    'Metadata value': 'Metadata value',
    Actions: 'Actions',
    Add: 'Add',
    Administration: 'Administration',
    Created: 'Created',
    Default: 'Default',
    Name: 'Name',
    Permissions: 'Permissions',
    Plugins: 'Plugins',
    Search: 'Search',
  },
});
