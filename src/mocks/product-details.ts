/**
 * Design-phase product page data: a snapshot of POST /content/product/single for 168 real products,
 * falling back to list data (no attributes / description) for the rest of the catalog.
 */
import type { Product, ProductDetails } from '@/entities/product/types'
import { loadCatalog } from './catalog'
import faqsJson from './fixtures/faqs.json'
import { products } from './index'

let details: Promise<Record<string, ProductDetails>> | null = null
const loadDetails = () =>
  (details ??= import('./fixtures/product-details.json').then((m) => m.default as unknown as Record<string, ProductDetails>))

/** Live values from /content/product/single */
const DELIVERY_COST = 25_000
const FREE_DELIVERY_MIN = 500_000

const fromListItem = (p: Product): ProductDetails => ({
  ...p,
  categories_id: p.category_id,
  category: { guid: p.category_id, name_ru: '', name_uz: '' },
  attributes: [],
  delivery_cost: DELIVERY_COST,
  free_delivery_min_sum: FREE_DELIVERY_MIN,
})

export const mockProductDetails = async (id: string): Promise<ProductDetails | null> => {
  const [d, catalog] = await Promise.all([loadDetails(), loadCatalog()])
  if (d[id]) return d[id]
  const p = catalog.find((x) => x.guid === id) ?? products.find((x) => x.guid === id)
  return p ? fromListItem(p) : null
}

export interface Faq {
  guid: string
  question_ru: string
  question_uz: string
  answer_ru: string
  answer_uz: string
  display_order: number
}
export const faqs = (faqsJson as Faq[]).sort((a, b) => a.display_order - b.display_order)
