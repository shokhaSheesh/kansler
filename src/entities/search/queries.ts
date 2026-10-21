import { useQuery } from '@tanstack/react-query'
import { searchApi } from './api'

export const useSearchSuggestions = (search: string) =>
  useQuery({
    queryKey: ['SEARCH_AS_YOU_TYPE', search],
    queryFn: () => searchApi.asYouType({ search }),
    enabled: search.trim().length >= 2,
    staleTime: 60_000,
  })

export const usePopularSearches = () =>
  useQuery({ queryKey: ['SEARCH_POPULAR'], queryFn: searchApi.popular, staleTime: 10 * 60_000 })
