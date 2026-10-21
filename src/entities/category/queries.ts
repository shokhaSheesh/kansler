import { useQuery } from '@tanstack/react-query'
import { categoryApi } from './api'
import type { Category } from './types'

export const useCategories = () =>
  useQuery({
    queryKey: ['CATEGORY_LIST'],
    queryFn: () => categoryApi.list(),
    select: (res) => res.data.data,
    staleTime: 10 * 60_000,
  })

/** Depth-first lookup used by breadcrumbs and the mega-menu. */
export const findCategory = (tree: Category[] | undefined, guid: string): Category | undefined => {
  for (const c of tree ?? []) {
    if (c.guid === guid) return c
    const hit = findCategory(c.categories_data, guid)
    if (hit) return hit
  }
}
