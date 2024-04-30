import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import enDashboardJson from './en-us/dashboard.json'
import enHomepageJson from './en-us/homepage.json'
import zhDashboardJson from './zh-cn/dashboard.json'
import zhHomepageJson from './zh-cn/homepage.json'
import zhUserPanelJson from './zh-cn/userPanel/userPanel.json'

const resources = {
  en: {
    translation: {
      ...enHomepageJson,
      ...enDashboardJson,
    },
  },
  zh: {
    translation: {
      ...zhHomepageJson,
      ...zhDashboardJson,
    },
    userPanel: {
      ...zhUserPanelJson,
    },
  },
}

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
  })

export default i18n
