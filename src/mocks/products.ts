/**
 * Design-phase product list over the catalog snapshot. Mirrors POST /content/product/list
 * (category, type, price, colours, sort, page) plus the data the filters need
 * (price range = /content/product/price-range, colours = /content/colors/list).
 */
import type { Category } from '@/entities/category/types'
import type { Product } from '@/entities/product/types'
import { byId, loadCatalog } from './catalog'
import { categories } from './index'

export type ProductType = 'all' | 'super_discount' | 'best_selling' | 'hit_product'
export type ProductSort = 'popular' | 'price_asc' | 'price_desc'

export interface ProductListParams {
  categoryId?: string | null
  /** /products page: multi-select of top-level categories. */
  categoryIds?: string[]
  type?: ProductType
  priceMin?: number | null
  priceMax?: number | null
  colors?: string[]
  sort?: ProductSort
  page?: number
  limit?: number
}

export interface ProductListResult {
  items: Product[]
  count: number
  totalPages: number
  /** Price bounds of the current category (before price/colour filters). */
  priceRange: { min: number; max: number }
  colors: Array<{ name: string; count: number }>
  /** Counts per top-level category (for the /products category filter). */
  categoryCounts: Record<string, number>
}

/** Every category id inside `id` (itself included). */
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

const topLevelOf = (categoryId: string) => byId.get(categoryId)?.path[0]?.guid

export const finalPrice = (p: Product) => {
  const v = p.variations[0]
  return v.discount_percent && v.discount_price ? v.discount_price : v.price
}

/** The backend's sold_count is 0 for every product today, so the mock flags a stable pseudo-random subset. */
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
const matchesType = (p: Product, type: ProductType) => {
  if (type === 'super_discount') return p.variations.some((v) => (v.discount_percent ?? 0) > 0)
  if (type === 'best_selling') return hash(p.guid) % 5 === 0
  if (type === 'hit_product') return hash(p.guid) % 7 === 0
  return true
}

export const mockProductList = async ({
  categoryId,
  categoryIds = [],
  type = 'all',
  priceMin,
  priceMax,
  colors = [],
  sort = 'popular',
  page = 1,
  limit = 20,
}: ProductListParams): Promise<ProductListResult> => {
  let base = await loadCatalog()
  if (categoryId) {
    const ids = subtree(categoryId)
    base = base.filter((p) => ids.has(p.category_id))
  }

  const catIds = new Set(categoryIds.flatMap((id) => [...subtree(id)]))
  const colorHit = (v: Product['variations'][number]) => Boolean(v.color && colors.includes(v.color.name_ru))

  // Faceted filtering: each facet's counts apply every *other* active filter,
  // so options that would lead to zero results can be shown disabled up front.
  const tests = {
    cats: (p: Product) => !catIds.size || catIds.has(p.category_id),
    type: (p: Product) => matchesType(p, type),
    price: (p: Product) => (priceMin == null || finalPrice(p) >= priceMin) && (priceMax == null || finalPrice(p) <= priceMax),
    color: (p: Product) => !colors.length || p.variations.some(colorHit),
  }
  type Facet = keyof typeof tests
  const pass = (p: Product, except?: Facet) =>
    (Object.keys(tests) as Facet[]).every((k) => k === except || tests[k](p))

  const categoryCounts: Record<string, number> = {}
  base
    .filter((p) => pass(p, 'cats'))
    .forEach((p) => {
      const top = topLevelOf(p.category_id)
      if (top) categoryCounts[top] = (categoryCounts[top] ?? 0) + 1
    })

  // Colour list = every colour in the category (stable order), counts = with other filters applied
  const allColors = new Map<string, number>()
  base.forEach((p) =>
    new Set(p.variations.map((v) => v.color?.name_ru).filter(Boolean) as string[]).forEach((c) =>
      allColors.set(c, (allColors.get(c) ?? 0) + 1),
    ),
  )
  const colorCounts = new Map<string, number>([...allColors.keys()].map((c) => [c, 0]))
  base
    .filter((p) => pass(p, 'color'))
    .forEach((p) =>
      new Set(p.variations.map((v) => v.color?.name_ru).filter(Boolean) as string[]).forEach((c) =>
        colorCounts.set(c, (colorCounts.get(c) ?? 0) + 1),
      ),
    )

  const priced = base.filter((p) => pass(p, 'price')).map(finalPrice)
  const priceRange = priced.length ? { min: Math.min(...priced), max: Math.max(...priced) } : { min: 0, max: 0 }

  let items = base.filter((p) => pass(p))
  if (colors.length) {
    // Show the variant that matched: cards render variations[0]. (Wiring: the API should do the same.)
    items = items.map((p) => ({ ...p, variations: [...p.variations].sort((a, b) => Number(colorHit(b)) - Number(colorHit(a))) }))
  }

  items = [...items]
  if (sort === 'price_asc') items.sort((a, b) => finalPrice(a) - finalPrice(b))
  else if (sort === 'price_desc') items.sort((a, b) => finalPrice(b) - finalPrice(a))
  else items.sort((a, b) => b.created_at.localeCompare(a.created_at))

  const count = items.length
  return {
    items: items.slice((page - 1) * limit, page * limit),
    count,
    totalPages: Math.max(1, Math.ceil(count / limit)),
    priceRange,
    colors: [...colorCounts]
      .map(([name, c]) => ({ name, count: c }))
      .sort((a, b) => (allColors.get(b.name) ?? 0) - (allColors.get(a.name) ?? 0)),
    categoryCounts,
  }
}

export const topCategories = categories
