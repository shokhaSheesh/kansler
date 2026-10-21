/**
 * Design-phase product list over the catalog snapshot, matching what the live site does:
 * category (incl. sub-categories), search text, price range, colours, and a "cheapest first" toggle.
 * Used by category pages, search results and favourites (the live site shows the same filters on all three).
 * Mirrors POST /content/product/list + /content/product/price-range + /content/colors/list.
 */
import type { Category } from '@/entities/category/types'
import type { Product } from '@/entities/product/types'
import { byId, loadCatalog, productScore, tokenize } from './catalog'
import { categories } from './index'

export interface ProductListParams {
  /** Page category (from the URL slug). */
  categoryId?: string | null
  /** Category picked in the sidebar "Категории" list. */
  filterCategoryId?: string | null
  /** Search results page. */
  q?: string
  /** Favourites page: the favourite products themselves. */
  source?: Product[]
  priceMin?: number | null
  priceMax?: number | null
  colors?: string[]
  /** Live "sort by price" toggle (cheapest first). */
  cheapFirst?: boolean
  page?: number
  limit?: number
}

export interface ProductListResult {
  items: Product[]
  count: number
  totalPages: number
  /** Price bounds for the slider (/content/product/price-range). */
  priceRange: { min: number; max: number }
  /** Colour names for the filter (/content/colors/list returns names only, no counts). */
  colors: string[]
}

const subtree = (id: string): Set<string> => {
  const out = new Set<string>()
  const walk = (c: Category) => {
    out.add(c.guid)
    c.categories_data.forEach(walk)
  }
  const root = byId.get(id)?.category
  if (root) walk(root)
  return out
}

export const finalPrice = (p: Product) => {
  const v = p.variations[0]
  return v.discount_percent && v.discount_price ? v.discount_price : v.price
}

let colorList: string[] | null = null
const allColors = (items: Product[]) => {
  if (colorList) return colorList
  const counts = new Map<string, number>()
  items.forEach((p) => p.variations.forEach((v) => v.color && counts.set(v.color.name_ru, (counts.get(v.color.name_ru) ?? 0) + 1)))
  colorList = [...counts].sort((a, b) => b[1] - a[1]).map(([name]) => name)
  return colorList
}

export const mockProductList = async ({
  categoryId,
  filterCategoryId,
  q,
  source,
  priceMin,
  priceMax,
  colors = [],
  cheapFirst = false,
  page = 1,
  limit = 24,
}: ProductListParams): Promise<ProductListResult> => {
  const catalog = await loadCatalog()
  let items = source ?? catalog

  if (categoryId) {
    const s = subtree(categoryId)
    items = items.filter((p) => s.has(p.category_id))
  }
  if (q?.trim()) {
    const tokens = tokenize(q)
    items = items
      .map((p) => ({ p, s: productScore(p, tokens) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.p)
  }
  if (filterCategoryId) {
    const s = subtree(filterCategoryId)
    items = items.filter((p) => s.has(p.category_id))
  }

  const prices = items.map(finalPrice)
  const priceRange = prices.length ? { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) } : { min: 0, max: 0 }

  if (priceMin != null) items = items.filter((p) => finalPrice(p) >= priceMin)
  if (priceMax != null) items = items.filter((p) => finalPrice(p) <= priceMax)
  if (colors.length) {
    const hit = (v: Product['variations'][number]) => Boolean(v.color && colors.includes(v.color.name_ru))
    // Show the variant that matched: cards render variations[0]. (Wiring: the API should do the same.)
    items = items
      .filter((p) => p.variations.some(hit))
      .map((p) => ({ ...p, variations: [...p.variations].sort((a, b) => Number(hit(b)) - Number(hit(a))) }))
  }
  if (cheapFirst) items = [...items].sort((a, b) => finalPrice(a) - finalPrice(b))

  const count = items.length
  return {
    items: items.slice((page - 1) * limit, page * limit),
    count,
    totalPages: Math.max(1, Math.ceil(count / limit)),
    priceRange,
    colors: allColors(catalog),
  }
}

export const topCategories = categories
