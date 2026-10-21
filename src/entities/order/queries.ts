import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authStore } from '@/stores/auth.store'
import { cartKeys } from '@/entities/cart/queries'
import { orderApi } from './api'

export const orderKeys = {
  list: (status?: string) => ['ORDER_LIST', status] as const,
  details: (guid: string) => ['ORDER_DETAILS', guid] as const,
  reviews: ['ORDER_REVIEWS'] as const,
  promoCodes: ['PROMO_CODES'] as const,
}

export const useOrders = (status?: string) =>
  useQuery({
    queryKey: orderKeys.list(status),
    queryFn: () => orderApi.list({ status }),
    enabled: authStore.isAuthorized,
  })

export const useOrder = (guid: string) =>
  useQuery({ queryKey: orderKeys.details(guid), queryFn: () => orderApi.details({ guid }), enabled: !!guid })

export const useReviews = () =>
  useQuery({ queryKey: orderKeys.reviews, queryFn: () => orderApi.reviewList(), enabled: authStore.isAuthorized })

export const usePromoCodes = () =>
  useQuery({ queryKey: orderKeys.promoCodes, queryFn: orderApi.promoCodes, enabled: authStore.isAuthorized })

export const useCreateOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ORDER_LIST'] })
      qc.invalidateQueries({ queryKey: cartKeys.items })
      qc.invalidateQueries({ queryKey: cartKeys.count })
    },
  })
}

export const useCreateReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: orderApi.reviewCreate,
    onSuccess: () => qc.invalidateQueries({ queryKey: orderKeys.reviews }),
  })
}

export const useApplyPromoCode = () => useMutation({ mutationFn: orderApi.applyPromoCode })
