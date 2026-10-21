import { post } from '@/shared/api/http'
import { endpoints } from '@/shared/api/endpoints'
import type { ListResponse } from '@/shared/types/api'
import type { Category } from './types'

export const categoryApi = {
  list: (data: Record<string, unknown> = {}) => post<ListResponse<Category>>(endpoints.category.list, data),
}
