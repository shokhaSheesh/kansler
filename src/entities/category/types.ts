import type { Localized } from '@/shared/types/api'

/** Categories are a recursive tree (up to 4 levels on the live data). */
export interface Category extends Localized<'name'> {
  guid: string
  categories_id: string | null // parent
  categories_data: Category[]
  slug: string
  image: string | null
  discount_percent: number | null
  display_order: number
}
