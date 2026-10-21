import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authStore } from '@/stores/auth.store'
import { productKeys } from '@/entities/product/queries'
import { cartApi } from './api'

export const cartKeys = {
  items: ['CART_ITEMS'] as const,
  count: ['CART_COUNT'] as const,
}

export const useCart = () =>
  useQuery({ queryKey: cartKeys.items, queryFn: cartApi.items, enabled: authStore.isAuthorized })

export const useCartCount = () =>
  useQuery({ queryKey: cartKeys.count, queryFn: cartApi.count, enabled: authStore.isAuthorized })

const useInvalidateCart = () => {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: cartKeys.items })
    qc.invalidateQueries({ queryKey: cartKeys.count })
    qc.invalidateQueries({ queryKey: productKeys.all }) // cart_quantity lives on product cards
  }
}

export const useAddToCart = () => useMutation({ mutationFn: cartApi.add, onSuccess: useInvalidateCart() })
export const useRemoveFromCart = () => useMutation({ mutationFn: cartApi.remove, onSuccess: useInvalidateCart() })
export const useReorder = () => useMutation({ mutationFn: cartApi.reorder, onSuccess: useInvalidateCart() })
