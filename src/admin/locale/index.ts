import { Locale, locales as AdminJSLocales } from 'adminjs';

import en from './en/index.js';
import nb from './nb/index.js';

const localeKey = process.env.LOCALE || 'en';
const customLanguage = 'nb';

export const locale: Locale = {
  language: localeKey,
  //availableLanguages: [...Object.keys(AdminJSLocales), customLanguage].sort(),
  availableLanguages : ['en',customLanguage].sort(),
  localeDetection: true,
  withBackend: true,
  translations: {
    en,
    [customLanguage] : nb ,
    /* [customLanguage]: {
      components: {
        LanguageSelector: {
          availableLanguages: {
            de: 'Немски',
            en: 'Английски',
            es: 'Испански',
            it: 'Италиански',
            pl: 'Полски',
            no: 'Норвежки',
            mk: 'Македонски',
            'pt-BR': 'португалски (Бразилия)',
            ua: 'Украински',
            'zh-CN': 'Китайски',
          },
        },
      },
    }, */
  },
};
