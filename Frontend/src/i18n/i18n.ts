import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enAboutJson from './en-us/about.json';
import enHomepageJson from './en-us/homepage.json';
import enManifestoJson from './en-us/manifesto.json';
import enDashboardJson from './en-us/dashboard.json';
import enLoginJson from './en-us/login.json';

import zhAboutJson from './zh-cn/about.json';
import zhHomepageJson from './zh-cn/homepage.json';
import zhManifestoJson from './zh-cn/manifesto.json';
import zhDashboardJson from './zh-cn/dashboard.json';
import zhLoginJson from './zh-cn/login.json';

import zhUserPanelJson from './zh-cn/userPanel/userPanel.json';

const resources = {
  en: {
    translation: {
      ...enHomepageJson,
      ...enDashboardJson,
    },

    about: {
      ...enAboutJson,
    },
    login: {
      ...enLoginJson,
    },
    manifesto: {
      ...enManifestoJson,
    },
  },
  zh: {
    translation: {
      ...zhHomepageJson,
      ...zhDashboardJson,
    },
    login: {
      ...zhLoginJson,
    },
    userPanel: {
      ...zhUserPanelJson,
    },
    about: {
      ...zhAboutJson,
    },
    manifesto: {
      ...zhManifestoJson,
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    debug: process.env.NODE_ENV === 'development',
    defaultNS: 'translation',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
