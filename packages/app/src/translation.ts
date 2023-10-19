import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

import messages from './locales/app/en.json';

export const appTranslationRef = createTranslationRef({
  id: 'app-translations',
  messages,
});
