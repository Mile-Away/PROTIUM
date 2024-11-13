import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enDashboardJson from './en-us/dashboard.json';
import enLoginJson from './en-us/login.json';

import zhDashboardJson from './zh-cn/dashboard.json';
import zhLoginJson from './zh-cn/login.json';

import zhUserPanelJson from './zh-cn/userPanel/userPanel.json';

const resources = {
  en: {
    translation: {
      ...enDashboardJson,
    },

    login: {
      ...enLoginJson,
    },
    about: {},
    manifesto: {},
    environment: {
      details: {
        hero: {
          readDoc: 'Read Docs',
          viewGithub: 'View Github',
        },
        navbar: {
          Overview: 'Overview',
          Materials: 'Materials',
          Discussion: 'Discussion',
          Releases: 'Releases',
          Insights: 'Insights',
          Benchmark: 'Benchmark',
          Setting: 'Setting',
        },
        overview: {
          release: 'Release',
          pinnedArticle: 'Pinned Articles',
        },
      },
    },
  },
  zh: {
    translation: {
      ...zhDashboardJson,
    },
    login: {
      ...zhLoginJson,
    },
    userPanel: {
      ...zhUserPanelJson,
    },
    about: {},
    manifesto: {},
    environment: {
      details: {
        hero: {
          readDoc: '阅读文档',
          viewGithub: '查看 Github',
        },
        navbar: {
          Overview: '概览',
          Materials: '物料',
          Discussion: '讨论',
          Releases: '发布',
          Insights: '数据',
          Benchmark: '基准测试',
          Setting: '设置',
        },
        overview: {
          release: '发布',
          pinnedArticle: '置顶文章',
        },
      },
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
