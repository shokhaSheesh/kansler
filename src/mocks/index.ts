/**
 * Design-phase data. A one-time snapshot of the public kansler.uz endpoints (no auth),
 * typed with the real entity types. When we wire the API, each export maps 1:1 to a query hook:
 *   banners -> useBanners, categories -> useCategories, partners -> usePartners,
 *   shelves -> useNewCollection / useRecommendations / useDiscountedProducts.
 */
import type { Banner, Partner } from '@/entities/main-page/types'
import type { Category } from '@/entities/category/types'
import type { Product } from '@/entities/product/types'
import bannersJson from './fixtures/banners.json'
import categoriesJson from './fixtures/categories.json'
import partnersJson from './fixtures/partners.json'
import productsJson from './fixtures/products.json'
import popularJson from './fixtures/popular-searches.json'
import contactsJson from './fixtures/contacts.json'

export const banners = (bannersJson as Banner[])
  .filter((b) => b.is_active)
  .sort((a, b) => a.display_order - b.display_order)

export const categories = (categoriesJson as unknown as Category[]).sort(
  (a, b) => a.display_order - b.display_order,
)

export const partners = (partnersJson as unknown as Array<Partner & { image: string; display_order: number }>).sort(
  (a, b) => a.display_order - b.display_order,
)

export const products = productsJson as unknown as Product[]

export const popularSearches = popularJson as Array<{ name_ru: string; name_uz: string; search_count: number }>

export const contacts = contactsJson as Record<string, string>

const hasDiscount = (p: Product) => p.variations.some((v) => (v.discount_percent ?? 0) > 0)

/** The three home shelves. The live endpoints need auth, so we fill them from real products. */
export const shelves = {
  newCollection: [...products].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 12),
  recommended: products.filter((p) => !hasDiscount(p)).slice(12, 24),
  discounted: products.filter(hasDiscount).slice(0, 12),
}
