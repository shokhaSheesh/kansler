import { useMemo } from 'react'
import { paths } from '@/app/router/paths'
import type { Category } from '@/entities/category/types'
import type { Product } from '@/entities/product/types'
import { categories } from '@/mocks'
import type { CategoryHit } from '@/mocks/search'
import { searchHistory } from '@/stores/search-history.store'
import { MIN_QUERY, useDebouncedValue, usePopularSearches, useSearchPreview } from './queries'

export interface SearchActions {
  /** Run a search: save to history + open the results page. */
  search: (query: string) => void
  /** Navigate somewhere (product, category). */
  open: (path: string) => void
  /** Put text into the input without searching (refine a suggestion). */
  fill: (query: string) => void
}

/** Every keyboard-navigable row in the panel, in visual order. */
export interface NavItem {
  key: string
  run: () => void
}

export type PanelState =
  | { kind: 'empty'; history: string[]; popular: string[]; categories: Category[] }
  | { kind: 'loading' }
  | {
      kind: 'results'
      query: string
      suggestions: string[]
      categories: CategoryHit[]
      products: Product[]
      count: number
    }
  | { kind: 'none'; query: string; popular: string[] }

/** All-caps popular queries ("УТЕНОК") read as shouting in a list; show them sentence-case. */
const tidy = (s: string) => {
  const t = s.trim()
  return t === t.toUpperCase() ? t.charAt(0) + t.slice(1).toLowerCase() : t
}

export const useSearchPanel = (query: string, actions: SearchActions) => {
  const debounced = useDebouncedValue(query.trim(), 150)
  const typed = debounced.length >= MIN_QUERY
  const preview = useSearchPreview(debounced)
  const popularRaw = usePopularSearches()
  const popular = useMemo(() => popularRaw.map((p) => tidy(p.name_ru)), [popularRaw])
  const history = searchHistory.items

  return useMemo(() => {
    let state: PanelState
    const items: NavItem[] = []

    if (!typed) {
      state = { kind: 'empty', history, popular, categories }
      history.forEach((h) => items.push({ key: `h:${h}`, run: () => actions.search(h) }))
      popular.forEach((p) => items.push({ key: `p:${p}`, run: () => actions.search(p) }))
      categories.forEach((c) => items.push({ key: `c:${c.guid}`, run: () => actions.open(paths.category(c.slug)) }))
    } else if (!preview.data) {
      state = { kind: 'loading' }
    } else if (preview.data.count === 0 && preview.data.categories.length === 0) {
      state = { kind: 'none', query: debounced, popular }
      popular.forEach((p) => items.push({ key: `p:${p}`, run: () => actions.search(p) }))
    } else {
      const d = preview.data
      state = { kind: 'results', query: debounced, ...d }
      d.suggestions.forEach((s) => items.push({ key: `s:${s}`, run: () => actions.search(s) }))
      d.categories.forEach((h) =>
        items.push({ key: `c:${h.category.guid}`, run: () => actions.open(paths.category(h.category.slug)) }),
      )
      d.products.forEach((p) => items.push({ key: `pr:${p.guid}`, run: () => actions.open(paths.product(p.guid)) }))
      items.push({ key: 'all', run: () => actions.search(debounced) })
    }

    return { state, items, isFetching: preview.isFetching }
  }, [typed, preview.data, preview.isFetching, debounced, history, popular, actions])
}
