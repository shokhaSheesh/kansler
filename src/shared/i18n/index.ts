import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import ru from './locales/ru.json'
import uz from './locales/uz.json'

// Same setup as the live site: uz + ru, fallback ru, persisted in localStorage.
// Locale files are extracted verbatim from production. Add new keys, don't rename old ones.
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { uz: { translation: uz }, ru: { translation: ru } },
    fallbackLng: 'ru',
    supportedLngs: ['uz', 'ru'],
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  })

i18n.on('languageChanged', (lng) => document.documentElement.setAttribute('lang', lng))

export default i18n
