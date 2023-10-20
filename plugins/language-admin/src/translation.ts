import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

export const languageAdminTranslationRef = createTranslationRef({
  id: 'language-admin',
  messages: {
    Code: 'Code',
    'Download a template': 'Download a template',
    'Golden Paths': 'Golden Paths',
    'Languages ({{count}})': 'Languages ({{count}})',
    Languages: 'Languages',
    Actions: 'Actions',
    Add: 'Add',
    Administration: 'Administration',
    Created: 'Created',
    Default: 'Default',
    Name: 'Name',
    Permissions: 'Permissions',
    Plugins: 'Plugins',
    Search: 'Search',
    Support: 'Support',
  },
});
