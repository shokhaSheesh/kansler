import { post } from '@/shared/api/http'
import { endpoints } from '@/shared/api/endpoints'
import type { ApiResponse, ListResponse, PaginationParams } from '@/shared/types/api'

export interface Notification {
  guid: string
  title_ru?: string
  title_uz?: string
  body_ru?: string
  body_uz?: string
  is_read: boolean
  created_at: string
}

const e = endpoints.notification

export const notificationApi = {
  list: (data: PaginationParams = {}) => post<ListResponse<Notification>>(e.list, data),
  count: () => post<ApiResponse<{ count: number }>>(e.count),
  markRead: (data: { notification_id: string }) => post<ApiResponse<unknown>>(e.markRead, data),
}
