import { post } from '@/shared/api/http'
import { endpoints } from '@/shared/api/endpoints'
import type { ApiResponse, ListResponse } from '@/shared/types/api'
import type { Address, BankAccount, CountSummary, Receiver, User } from './types'

const e = endpoints.user
type Payload = Record<string, unknown>

export const userApi = {
  get: (data: Payload = {}) => post<ApiResponse<User>>(e.get, data),
  update: (data: Partial<User>) => post<ApiResponse<User>>(e.update, data),
  countSummary: () => post<ApiResponse<CountSummary>>(e.countSummary),
  companyInfo: (data: Payload = {}) => post<ApiResponse<Payload>>(e.companyInfo, data),

  addressList: (data: Payload = {}) => post<ListResponse<Address>>(e.addressList, data),
  addressManage: (data: Payload) => post<ApiResponse<Address>>(e.addressManage, data),

  receiverList: (data: Payload = {}) => post<ListResponse<Receiver>>(e.receiverList, data),
  receiverManage: (data: Payload) => post<ApiResponse<Receiver>>(e.receiverManage, data),

  bankAccountList: (data: Payload = {}) => post<ListResponse<BankAccount>>(e.bankAccountList, data),
  bankAccountManage: (data: Payload) => post<ApiResponse<BankAccount>>(e.bankAccountManage, data),
}
