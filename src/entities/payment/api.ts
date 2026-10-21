import { post } from '@/shared/api/http'
import { endpoints } from '@/shared/api/endpoints'
import type { ApiResponse, ListResponse } from '@/shared/types/api'
import type { Card } from '@/entities/order/types'

type Payload = Record<string, unknown>

/** Card payment: create -> pre-confirm (sends SMS) -> confirm (OTP). */
export const paymentApi = {
  create: (data: Payload) => post<ApiResponse<{ transaction_id: string }>>(endpoints.payment.create, data),
  preConfirm: (data: { transaction_id: string }) => post<ApiResponse<unknown>>(endpoints.payment.preConfirm, data),
  confirm: (data: { transaction_id: string; code: string }) => post<ApiResponse<unknown>>(endpoints.payment.confirm, data),
}

/** Card binding: bind/create (sends SMS) -> bind/confirm (OTP). */
export const cardApi = {
  list: () => post<ListResponse<Card>>(endpoints.card.list),
  bindCreate: (data: { pan: string; expire: string }) => post<ApiResponse<{ card_id: string }>>(endpoints.card.bindCreate, data),
  bindConfirm: (data: { card_id: string; code: string }) => post<ApiResponse<Card>>(endpoints.card.bindConfirm, data),
  unbind: (data: { card_id: string }) => post<ApiResponse<unknown>>(endpoints.card.unbind, data),
}
