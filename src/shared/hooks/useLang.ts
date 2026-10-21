import { useTranslation } from 'react-i18next'
import type { Lang } from '@/shared/types/api'

export const useLang = (): Lang => {
  const { i18n } = useTranslation()
  return i18n.resolvedLanguage === 'uz' ? 'uz' : 'ru'
}
