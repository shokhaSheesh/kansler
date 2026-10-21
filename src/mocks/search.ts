/**
 * Design-phase search over a snapshot of the real public catalog (572 products).
 * Mirrors the two live endpoints:
 *   mockSuggest  -> POST /content/search/asyoutype { search }  -> [{ name_ru, name_uz }]
 *   mockSearch   -> POST /content/product/list     { search, page, limit, ... } -> { data, count }
 * The catalog chunk is loaded lazily, only when someone starts searching.
 */
import type { Category } from '@/entities/category/types'
import type { Product } from '@/entities/product/types'
import type { Lang } from '@/shared/types/api'
import { categories } from './index'

let catalog: Promise<Product[]> | null = null
export const loadCatalog = () =>
  (catalog ??= import('./fixtures/catalog.json').then((m) => m.default as unknown as Product[]))

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[«»"“”'’`ʻʼ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
const tokenize = (q: string) => norm(q).split(' ').filter(Boolean)

/** All tokens must match. Prefix-of-word matches rank higher than mid-word matches. */
const score = (text: string, tokens: string[]) => {
  const t = norm(text)
  let s = 0
  for (const tok of tokens) {
    const i = t.indexOf(tok)
    if (i < 0) return -1
    s += i === 0 ? 30 : t[i - 1] === ' ' || t[i - 1] === '(' ? 12 : 3
  }
  return s - t.length / 40
}

const productNames = (p: Product) => [p.name_ru, p.name_uz, ...p.variations.flatMap((v) => [v.name_ru, v.name_uz])]
const productScore = (p: Product, tokens: string[]) => Math.max(...productNames(p).map((n) => score(n ?? '', tokens)))

// ---- categories --------------------------------------------------------------------------
export interface CategoryHit {
  category: Category
  path: Category[]
}
const flat: CategoryHit[] = []
const walk = (list: Category[], parents: Category[]) =>
  list.forEach((c) => {
    flat.push({ category: c, path: [...parents, c] })
    walk(c.categories_data, [...parents, c])
  })
walk(categories, [])
const byId = new Map(flat.map((h) => [h.category.guid, h]))
export const categoryPath = (id: string) => byId.get(id)?.path ?? []

export const matchCategories = (q: string, limit = 4): CategoryHit[] => {
  const tokens = tokenize(q)
  if (!tokens.length) return []
  return flat
    .map((h) => ({ h, s: Math.max(score(h.category.name_ru, tokens), score(h.category.name_uz, tokens)) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.h)
}

// ---- suggestions -------------------------------------------------------------------------
export const mockSuggest = async (q: string, lang: Lang, limit = 7): Promise<string[]> => {
  const tokens = tokenize(q)
  if (!tokens.length) return []
  const items = await loadCatalog()
  const seen = new Set<string>()
  return items
    .map((p) => {
      const name = (lang === 'uz' ? p.name_uz : p.name_ru) || p.name_ru
      return { name: name.trim(), s: score(name, tokens) }
    })
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s)
    .filter((x) => {
      const k = norm(x.name)
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    .slice(0, limit)
    .map((x) => x.name)
}

// ---- product search ----------------------------------------------------------------------
export type SearchSort = 'popular' | 'price_asc' | 'price_desc'

const finalPrice = (p: Product) => {
  const v = p.variations[0]
  return v.discount_percent && v.discount_price ? v.discount_price : v.price
}

export interface SearchResult {
  items: Product[]
  /** Matches after the category filter. */
  count: number
  /** Matches before the category filter (for the "Все" chip). */
  total: number
  totalPages: number
  /** Leaf categories present in the result set, for the filter chips. */
  facets: Array<{ category: Category; count: number }>
}

export const mockSearch = async ({
  q,
  sort = 'popular',
  categoryId,
  page = 1,
  limit = 20,
}: {
  q: string
  sort?: SearchSort
  categoryId?: string | null
  page?: number
  limit?: number
}): Promise<SearchResult> => {
  const tokens = tokenize(q)
  const items = await loadCatalog()
  let hits = items
    .map((p) => ({ p, s: productScore(p, tokens) }))
    .filter((x) => x.s >= 0)

  const counts = new Map<string, number>()
  hits.forEach(({ p }) => counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1))
  const facets = [...counts]
    .map(([id, count]) => ({ category: byId.get(id)?.category, count }))
    .filter((f): f is { category: Category; count: number } => Boolean(f.category))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const total = hits.length
  if (categoryId) hits = hits.filter(({ p }) => p.category_id === categoryId)
  if (sort === 'price_asc') hits.sort((a, b) => finalPrice(a.p) - finalPrice(b.p))
  else if (sort === 'price_desc') hits.sort((a, b) => finalPrice(b.p) - finalPrice(a.p))
  else hits.sort((a, b) => b.s - a.s || (b.p.sold_count ?? 0) - (a.p.sold_count ?? 0))

  const count = hits.length
  return {
    items: hits.slice((page - 1) * limit, page * limit).map((x) => x.p),
    count,
    total,
    totalPages: Math.max(1, Math.ceil(count / limit)),
    facets,
  }
}
