import { useMemo, type RefObject } from 'react'
import { useNavigate } from 'react-router'
import { paths } from '@/app/router/paths'
import { searchHistory } from '@/stores/search-history.store'
import type { SearchActions } from './model'

export const useSearchActions = (
  setQuery: (q: string) => void,
  close: () => void,
  inputRef: RefObject<HTMLInputElement | null>,
): SearchActions => {
  const navigate = useNavigate()
  return useMemo(
    () => ({
      search: (q: string) => {
        const query = q.trim()
        if (!query) return
        searchHistory.add(query)
        setQuery(query)
        close()
        inputRef.current?.blur()
        navigate(paths.search(encodeURIComponent(query)))
      },
      open: (path: string) => {
        close()
        inputRef.current?.blur()
        navigate(path)
      },
      fill: (q: string) => {
        setQuery(q + ' ')
        inputRef.current?.focus()
      },
    }),
    [navigate, setQuery, close, inputRef],
  )
}
