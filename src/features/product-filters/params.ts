import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { ProductSort, ProductType } from '@/mocks/products'

export interface Filters {
  categoryIds: string[]
  type: ProductType
  priceMin: number | null
  priceMax: number | null
  colors: string[]
}

export const EMPTY_FILTERS: Filters = { categoryIds: [], type: 'all', priceMin: null, priceMax: null, colors: [] }

const TYPES: ProductType[] = ['all', 'super_discount', 'best_selling', 'hit_product']
const SORTS: ProductSort[] = ['popular', 'price_asc', 'price_desc']
const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])
const num = (v: string | null) => (v && /^\d+$/.test(v) ? Number(v) : null)

export const activeFilterCount = (f: Filters) =>
  f.categoryIds.length + (f.type !== 'all' ? 1 : 0) + (f.priceMin != null || f.priceMax != null ? 1 : 0) + f.colors.length

/** Filters, sort and page live in the URL: shareable, bookmarkable, back-button friendly. */
export const useListParams = () => {
  const [sp, setSp] = useSearchParams()

  const filters: Filters = useMemo(
    () => ({
      categoryIds: list(sp.get('cats')),
      type: (TYPES.includes(sp.get('type') as ProductType) ? sp.get('type') : 'all') as ProductType,
      priceMin: num(sp.get('min')),
      priceMax: num(sp.get('max')),
      colors: list(sp.get('colors')),
    }),
    [sp],
  )
  const sort = (SORTS.includes(sp.get('sort') as ProductSort) ? sp.get('sort') : 'popular') as ProductSort
  const page = Math.max(1, Number(sp.get('page')) || 1)

  const write = useCallback(
    (next: { filters?: Filters; sort?: ProductSort; page?: number }) => {
      const p = new URLSearchParams(sp)
      const set = (k: string, v: string | null) => (v ? p.set(k, v) : p.delete(k))
      if (next.filters) {
        const f = next.filters
        set('cats', f.categoryIds.join(','))
        set('type', f.type === 'all' ? null : f.type)
        set('min', f.priceMin != null ? String(f.priceMin) : null)
        set('max', f.priceMax != null ? String(f.priceMax) : null)
        set('colors', f.colors.join(','))
      }
      if (next.sort) set('sort', next.sort === 'popular' ? null : next.sort)
      set('page', next.page && next.page > 1 ? String(next.page) : null)
      setSp(p)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [sp, setSp],
  )

  return {
    filters,
    sort,
    page,
    setFilters: (f: Filters) => write({ filters: f }),
    setSort: (s: ProductSort) => write({ sort: s }),
    setPage: (n: number) => write({ page: n }),
    reset: () => write({ filters: EMPTY_FILTERS }),
  }
}
