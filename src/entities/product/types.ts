import type { Localized } from '@/shared/types/api'

/** A sellable SKU. Prices are in UZS (so'm), integers. */
export interface Variation extends Localized<'name'> {
  guid: string
  product_group_id: string
  price: number
  discount_price: number | null
  discount_percent: number | null
  in_stock: number
  cart_quantity: number
  image: string[]
  /** Free-text colour name from /content/colors/list ("Синий", "Ассорти", "5 цветов"…), no hex. */
  color: Localized<'name'> | null
  sku_code: string | null
  unit: string // "шт.", "пачка" ...
  is_active: boolean
}

/** Product group: the card in listings. Holds 1..n variations. */
export interface Product extends Localized<'name'> {
  guid: string
  category_id: string
  favorite: boolean
  is_active: boolean
  sold_count: number | null
  total_cart_quantity: number
  vip_category: boolean
  variations: Variation[]
  created_at: string
  updated_at: string
  description_ru?: string
  description_uz?: string
}

export interface CategoryPathItem extends Localized<'name'> {
  guid: string
}

export interface ProductListParams {
  page?: number
  limit?: number
  category_id?: string
  search?: string
  min_price?: number
  max_price?: number
  color_ids?: string[]
  sort?: string
  is_favorite?: boolean
}

export interface PriceRange {
  min_price: number
  max_price: number
}

export interface Color extends Localized<'name'> {
  guid: string
  hex?: string
}
