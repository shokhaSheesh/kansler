import { http, post } from '@/shared/api/http'
import { endpoints } from '@/shared/api/endpoints'
import type { ApiResponse, ListResponse, PaginationParams } from '@/shared/types/api'
import type { CreateOrderPayload, Order, PromoCode, Review } from './types'

const e = endpoints.order

export const orderApi = {
  create: (data: CreateOrderPayload) => post<ApiResponse<Order>>(e.create, data),
  list: (data: PaginationParams & { status?: string } = {}) => post<ListResponse<Order>>(e.list, data),
  details: (data: { guid: string }) => post<ApiResponse<Order>>(e.details, data),
  reviewCreate: (data: { order_id: string; rating: number; comment?: string }) =>
    post<ApiResponse<Review>>(e.reviewCreate, data),
  reviewList: (data: PaginationParams = {}) => post<ListResponse<Review>>(e.reviewList, data),
  downloadPdf: (orderId: string) => http.post<Blob, Blob>(e.downloadPdf(orderId), {}, { responseType: 'blob' }),
  downloadContract: (data: Record<string, unknown>) =>
    http.post<Blob, Blob>(e.downloadContract, { data }, { responseType: 'blob' }),
  /** B2B: send contract / invoice to Didox (Uzbek e-document flow). */
  sendToDidox: (data: Record<string, unknown>) => post<ApiResponse<unknown>>(e.sendToDidox, data),

  promoCodes: () => post<ListResponse<PromoCode>>(endpoints.promoCode.list),
  applyPromoCode: (data: { code: string; action?: 'apply' | 'remove' }) =>
    post<ApiResponse<PromoCode>>(endpoints.promoCode.manage, data),
}
