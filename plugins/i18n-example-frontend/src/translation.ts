import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

export const i18nExampleFrontendTranslationRef = createTranslationRef({
  id: 'i18n-example-frontend',
  messages: {
    'A description of your plugin goes here.':
      'A description of your plugin goes here.',
    'All content should be wrapped in a card like this.':
      'All content should be wrapped in a card like this.',

    'Example User List': 'Example User List',
    Avatar: 'Avatar',
    'Information card': 'Information card',
    Lifecycle: 'Lifecycle',
    Name: 'Name',
    Email: 'Email',
    Nationality: 'Nationality',
    'Optional subtitle': 'Optional subtitle',
    Owner: 'Owner',
    'Plugin title': 'Plugin title',
    'Welcome to {{appName}}': 'Welcome to {{appName}}',
  },
});
