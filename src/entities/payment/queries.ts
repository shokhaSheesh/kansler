import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authStore } from '@/stores/auth.store'
import { cardApi, paymentApi } from './api'

const CARDS = ['CARD_LIST'] as const

export const useCards = () => useQuery({ queryKey: CARDS, queryFn: cardApi.list, enabled: authStore.isAuthorized })

export const useBindCard = () => useMutation({ mutationFn: cardApi.bindCreate })

export const useConfirmCard = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: cardApi.bindConfirm, onSuccess: () => qc.invalidateQueries({ queryKey: CARDS }) })
}

export const useUnbindCard = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: cardApi.unbind, onSuccess: () => qc.invalidateQueries({ queryKey: CARDS }) })
}

export const useCreatePayment = () => useMutation({ mutationFn: paymentApi.create })
export const usePreConfirmPayment = () => useMutation({ mutationFn: paymentApi.preConfirm })
export const useConfirmPayment = () => useMutation({ mutationFn: paymentApi.confirm })
