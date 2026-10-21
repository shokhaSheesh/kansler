import { post } from '@/shared/api/http'
import { endpoints } from '@/shared/api/endpoints'
import type { ApiResponse, ListResponse } from '@/shared/types/api'
import type { Product } from '@/entities/product/types'

const e = endpoints.cart

export interface CartChange {
  variation_id: string
  quantity: number
}

export const cartApi = {
  add: (data: CartChange) => post<ApiResponse<unknown>>(e.add, data),
  remove: (data: { variation_ids: string[] }) => post<ApiResponse<unknown>>(e.remove, data),
  items: () => post<ListResponse<Product>>(e.items),
  count: () => post<ApiResponse<{ count: number }>>(e.count),
  /** "Повторить заказ": puts every line of a past order back into the cart. */
  reorder: (data: { order_id: string }) => post<ApiResponse<unknown>>(e.reorder, data),
}
