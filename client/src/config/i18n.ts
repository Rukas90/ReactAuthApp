import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from '../Locales/EN/translation.json';
import lt from '../Locales/LT/translation.json';

interface Language {
  code: string;
  name: string;
  translation: {
    [key: string]: string;
  };
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English (US)',
    translation: en
  },
  {
    code: 'lt',
    name: 'Lietuvių',
    translation: lt
  }
];

const resources = languages.reduce((acc, lang) => {
  acc[lang.code] = { translation: lang.translation };
  return acc;
}, {} as { [languageCode: string]: { translation: { [key: string]: string } } });


i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
});

export { i18n, languages };
