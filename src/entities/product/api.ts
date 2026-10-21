import { post } from '@/shared/api/http'
import { endpoints } from '@/shared/api/endpoints'
import type { ApiResponse, ListData, ListResponse } from '@/shared/types/api'
import type { CategoryPathItem, Color, PriceRange, Product, ProductListParams } from './types'

const e = endpoints.product

export type ProductListResponse = ApiResponse<ListData<Product> & { category_path?: CategoryPathItem[] }>

export const productApi = {
  list: (params: ProductListParams) => post<ProductListResponse>(e.list, params),
  single: (data: { guid: string }) => post<ApiResponse<Product>>(e.single, data),
  priceRange: (data: { category_id?: string } = {}) => post<ApiResponse<PriceRange>>(e.priceRange, data),
  discounted: (data: ProductListParams = {}) => post<ListResponse<Product>>(e.discounted, data),
  newCollection: (data: ProductListParams = {}) => post<ListResponse<Product>>(e.newCollection, data),
  recommendations: (data: ProductListParams = {}) => post<ListResponse<Product>>(e.recommendations, data),
  likeUnlike: (data: { product_id: string }) => post<ApiResponse<unknown>>(e.likeUnlike, data),
  favoritesCount: () => post<ApiResponse<{ count: number }>>(e.favoritesCount),
  colors: () => post<ListResponse<Color>>(e.colors),
}
