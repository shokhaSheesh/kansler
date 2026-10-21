import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

/** The live filters: sidebar category, price range, colours (+ the "cheapest first" toggle, kept separately). */
export interface Filters {
  categoryId: string | null
  priceMin: number | null
  priceMax: number | null
  colors: string[]
}

export const EMPTY_FILTERS: Filters = { categoryId: null, priceMin: null, priceMax: null, colors: [] }

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])
const num = (v: string | null) => (v && /^\d+$/.test(v) ? Number(v) : null)

export const activeFilterCount = (f: Filters) =>
  (f.categoryId ? 1 : 0) + (f.priceMin != null || f.priceMax != null ? 1 : 0) + f.colors.length

/** Filters, the price toggle and the page live in the URL: shareable, bookmarkable, back-button friendly. */
export const useListParams = () => {
  const [sp, setSp] = useSearchParams()

  const filters: Filters = useMemo(
    () => ({ categoryId: sp.get('cat'), priceMin: num(sp.get('min')), priceMax: num(sp.get('max')), colors: list(sp.get('colors')) }),
    [sp],
  )
  const cheapFirst = sp.get('cheap') === '1'
  const page = Math.max(1, Number(sp.get('page')) || 1)

  const write = useCallback(
    (next: { filters?: Filters; cheapFirst?: boolean; page?: number }) => {
      const p = new URLSearchParams(sp)
      const set = (k: string, v: string | null) => (v ? p.set(k, v) : p.delete(k))
      if (next.filters) {
        const f = next.filters
        set('cat', f.categoryId)
        set('min', f.priceMin != null ? String(f.priceMin) : null)
        set('max', f.priceMax != null ? String(f.priceMax) : null)
        set('colors', f.colors.join(','))
      }
      if (next.cheapFirst !== undefined) set('cheap', next.cheapFirst ? '1' : null)
      set('page', next.page && next.page > 1 ? String(next.page) : null)
      setSp(p)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [sp, setSp],
  )

  return {
    filters,
    cheapFirst,
    page,
    setFilters: (f: Filters) => write({ filters: f }),
    setCheapFirst: (v: boolean) => write({ cheapFirst: v }),
    setPage: (n: number) => write({ page: n }),
  }
}
