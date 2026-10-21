import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { matchCategories, mockSearch, mockSuggest, type SearchSort } from '@/mocks/search'
import { popularSearches } from '@/mocks'
import { useLang } from '@/shared/hooks/useLang'

/** Design phase: query functions hit the mock catalog. Wiring: swap for searchApi.asYouType / productApi.list. */

export const useDebouncedValue = <T,>(value: T, ms = 150) => {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setV(value), ms)
    return () => window.clearTimeout(id)
  }, [value, ms])
  return v
}

export const MIN_QUERY = 2

const key = (s: string | null | undefined) => (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim()

/** Everything the dropdown shows for a typed query. */
export const useSearchPreview = (query: string) => {
  const lang = useLang()
  const q = query.trim()
  return useQuery({
    queryKey: ['SEARCH_PREVIEW', q, lang],
    queryFn: async () => {
      const [names, result] = await Promise.all([mockSuggest(q, lang, 14), mockSearch({ q, limit: 5 })])
      // Don't repeat products already previewed on the right: suggestions should lead somewhere new
      const shown = new Set(
        result.items.flatMap((p) => [p.name_ru, p.name_uz, ...p.variations.flatMap((v) => [v.name_ru, v.name_uz])].map(key)),
      )
      const suggestions = names.filter((n) => !shown.has(key(n))).slice(0, 7)
      return { suggestions, products: result.items, count: result.count, categories: matchCategories(q) }
    },
    enabled: q.length >= MIN_QUERY,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })
}

export const useSearchResults = (params: { q: string; sort: SearchSort; categoryId: string | null; page: number }) =>
  useQuery({
    queryKey: ['SEARCH_RESULTS', params],
    queryFn: () => mockSearch({ ...params, limit: 20 }),
    placeholderData: keepPreviousData,
  })

export const usePopularSearches = () => popularSearches
