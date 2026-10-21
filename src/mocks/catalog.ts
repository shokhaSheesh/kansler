/** Shared helpers over the lazy-loaded catalog snapshot (search + product list). */
import type { Category } from '@/entities/category/types'
import type { Product } from '@/entities/product/types'
import { categories } from './index'

let catalog: Promise<Product[]> | null = null
export const loadCatalog = () =>
  (catalog ??= import('./fixtures/catalog.json').then((m) => m.default as unknown as Product[]))

export const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[«»"“”'’`ʻʼ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
export const tokenize = (q: string) => norm(q).split(' ').filter(Boolean)

/** All tokens must match. Prefix-of-word matches rank higher than mid-word matches. */
export const score = (text: string, tokens: string[]) => {
  const t = norm(text)
  let s = 0
  for (const tok of tokens) {
    const i = t.indexOf(tok)
    if (i < 0) return -1
    s += i === 0 ? 30 : t[i - 1] === ' ' || t[i - 1] === '(' ? 12 : 3
  }
  return s - t.length / 40
}

export const productNames = (p: Product) => [p.name_ru, p.name_uz, ...p.variations.flatMap((v) => [v.name_ru, v.name_uz])]
export const productScore = (p: Product, tokens: string[]) => Math.max(...productNames(p).map((n) => score(n ?? '', tokens)))

// ---- categories --------------------------------------------------------------------------
export interface CategoryHit {
  category: Category
  path: Category[]
}
export const flat: CategoryHit[] = []
const walk = (list: Category[], parents: Category[]) =>
  list.forEach((c) => {
    flat.push({ category: c, path: [...parents, c] })
    walk(c.categories_data, [...parents, c])
  })
walk(categories, [])
export const byId = new Map(flat.map((h) => [h.category.guid, h]))
export const categoryPath = (id: string) => byId.get(id)?.path ?? []

