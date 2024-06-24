import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import vi from './translations/vi/index.json'
import en from './translations/en/index.json'

const lang = localStorage.getItem('lang')

i18n
  .use(initReactI18next)
  .init({
    lng: lang ? lang : 'vi',
    resources: {
      vi: { lang: vi },
      en: { lang: en },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    },
  })
export default i18n
