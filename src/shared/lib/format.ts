import type { Lang } from '@/shared/types/api'

/** 10670400 -> "10 670 400 сум" */
export const formatPrice = (value: number | null | undefined, lang: Lang = 'ru') => {
  if (value == null) return ''
  const n = new Intl.NumberFormat('ru-RU').format(Math.round(value)).replace(/ /g, ' ')
  return `${n} ${lang === 'uz' ? "so'm" : 'сум'}`
}

/** "998781484444" -> "+998 78 148 44 44" */
export const formatPhone = (raw: string | null | undefined) => {
  const d = (raw ?? '').replace(/\D/g, '')
  const m = d.match(/^(998)(\d{2})(\d{3})(\d{2})(\d{2})$/)
  return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]}` : (raw ?? '')
}

/** Picks `name_ru` / `name_uz` by current language with fallback to the other one. */
export const localized = <T extends object>(entity: T | null | undefined, key: string, lang: Lang) => {
  if (!entity) return ''
  const rec = entity as Record<string, unknown>
  const other: Lang = lang === 'ru' ? 'uz' : 'ru'
  return String(rec[`${key}_${lang}`] ?? rec[`${key}_${other}`] ?? '')
}
