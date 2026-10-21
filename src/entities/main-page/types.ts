export interface Banner {
  guid: string
  display_order: number
  is_active: boolean
  categories_id: string | null
  product_groups_id: string | null
  web_ru: string
  web_uz: string
  tablet_ru: string
  tablet_uz: string
  mobile_ru: string
  mobile_uz: string
}

export interface Partner {
  guid: string
  name?: string
  logo?: string
  [key: string]: unknown
}

export interface Faq {
  guid: string
  question_ru?: string
  question_uz?: string
  answer_ru?: string
  answer_uz?: string
}

export type Contacts = Record<string, unknown>
