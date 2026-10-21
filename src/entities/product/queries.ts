import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authStore } from '@/stores/auth.store'
import { productApi } from './api'
import type { ProductListParams } from './types'

export const productKeys = {
  all: ['PRODUCTS'] as const,
  list: (p: ProductListParams) => ['PRODUCTS', 'list', p] as const,
  single: (guid: string) => ['PRODUCTS', 'single', guid] as const,
  priceRange: (categoryId?: string) => ['PRODUCTS', 'price-range', categoryId] as const,
  discounted: ['PRODUCTS', 'discounted'] as const,
  newCollection: ['PRODUCTS', 'new'] as const,
  recommendations: ['PRODUCTS', 'recommendations'] as const,
  favorites: ['PRODUCTS', 'favorites'] as const,
  favoritesCount: ['FAVOURITES_COUNT'] as const,
  colors: ['COLORS'] as const,
}

export const useProducts = (params: ProductListParams) =>
  useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.list(params),
    placeholderData: keepPreviousData,
  })

/** Infinite scroll variant for catalog / search pages. */
export const useInfiniteProducts = (params: Omit<ProductListParams, 'page'>) =>
  useInfiniteQuery({
    queryKey: [...productKeys.list(params), 'infinite'],
    queryFn: ({ pageParam }) => productApi.list({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.data.has_more ? (last.data.page ?? 1) + 1 : undefined),
  })

export const useProduct = (guid: string) =>
  useQuery({ queryKey: productKeys.single(guid), queryFn: () => productApi.single({ guid }), enabled: !!guid })

export const usePriceRange = (categoryId?: string) =>
  useQuery({ queryKey: productKeys.priceRange(categoryId), queryFn: () => productApi.priceRange({ category_id: categoryId }) })

export const useDiscountedProducts = () =>
  useQuery({ queryKey: productKeys.discounted, queryFn: () => productApi.discounted({ limit: 12 }) })

export const useNewCollection = () =>
  useQuery({ queryKey: productKeys.newCollection, queryFn: () => productApi.newCollection({ limit: 12 }) })

export const useRecommendations = () =>
  useQuery({ queryKey: productKeys.recommendations, queryFn: () => productApi.recommendations({ limit: 12 }) })

export const useFavourites = (params: ProductListParams = {}) =>
  useQuery({
    queryKey: [...productKeys.favorites, params],
    queryFn: () => productApi.list({ ...params, is_favorite: true }),
    enabled: authStore.isAuthorized,
  })

export const useFavouritesCount = () =>
  useQuery({ queryKey: productKeys.favoritesCount, queryFn: productApi.favoritesCount, enabled: authStore.isAuthorized })

export const useColors = () => useQuery({ queryKey: productKeys.colors, queryFn: productApi.colors, staleTime: Infinity })

export const useToggleFavourite = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => productApi.likeUnlike({ product_id: productId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all })
      qc.invalidateQueries({ queryKey: productKeys.favoritesCount })
    },
  })
}
