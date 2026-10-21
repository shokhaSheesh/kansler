import { post } from '@/shared/api/http'
import { endpoints } from '@/shared/api/endpoints'
import type { ApiResponse } from '@/shared/types/api'

export interface Suggestion {
  guid?: string
  name_ru?: string
  name_uz?: string
  type?: 'product' | 'category' | string
  [key: string]: unknown
}

export const searchApi = {
  asYouType: (data: { search: string }) => post<ApiResponse<Suggestion[]>>(endpoints.search.asYouType, data),
  popular: () => post<ApiResponse<Suggestion[]>>(endpoints.search.popular),
}
