import { post } from '@/shared/api/http'
import { endpoints } from '@/shared/api/endpoints'
import type { ApiResponse, ListResponse } from '@/shared/types/api'
import type { Banner, Contacts, Faq, Partner } from './types'

const e = endpoints.mainPage

export const mainPageApi = {
  banners: () => post<ListResponse<Banner>>(e.banners),
  partners: () => post<ListResponse<Partner>>(e.partners),
  contacts: () => post<ApiResponse<Contacts>>(e.contacts),
  faqs: () => post<ListResponse<Faq>>(e.faqs),
  helpCenter: () => post<ListResponse<Faq>>(e.helpCenter),
}
