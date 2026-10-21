import { post } from '@/shared/api/http'
import { endpoints } from '@/shared/api/endpoints'
import type { ApiResponse } from '@/shared/types/api'
import type { AuthToken, User } from '@/entities/user/types'

const e = endpoints.auth

export interface LoginPayload {
  phone: string
  password: string
}

export interface AuthResult {
  token: AuthToken
  user?: User
}

/**
 * Auth flow on the live site:
 *  register: check (phone / TIN) -> send-otp -> confirm-otp -> company-form (TIN lookup) -> password
 *  reset:    send-otp -> confirm-otp -> reset-password
 */
export const authApi = {
  check: (data: { phone?: string; tin?: string }) => post<ApiResponse<Record<string, unknown>>>(e.check, data),
  login: (data: LoginPayload) => post<ApiResponse<AuthResult>>(e.login, data),
  register: (data: Record<string, unknown>) => post<ApiResponse<AuthResult>>(e.register, data),
  sendOtp: (data: { phone: string }) => post<ApiResponse<Record<string, unknown>>>(e.sendOtp, data),
  confirmOtp: (data: { phone: string; code: string }) =>
    post<ApiResponse<Record<string, unknown>>>(e.confirmOtp, data),
  resetPassword: (data: Record<string, unknown>) => post<ApiResponse<AuthResult>>(e.resetPassword, data),
  companyInfoByTin: (tin: string) => post<ApiResponse<Record<string, unknown>>>(e.companyInfoByTin(tin)),
}
