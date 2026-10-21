export interface AuthToken {
  access_token: string
  refresh_token: string
  expires_at?: string
}

export interface User {
  guid: string
  fullname?: string
  phone?: string
  email?: string
  company_name?: string
  tin?: string
  [key: string]: unknown
}

export interface Address {
  guid: string
  name?: string
  address?: string
  lat?: number
  long?: number
  is_main?: boolean
  [key: string]: unknown
}

/** "Получатель": the person who receives the order on the company side. */
export interface Receiver {
  guid: string
  fullname: string
  phone: string
  [key: string]: unknown
}

export interface BankAccount {
  guid: string
  bank_name?: string
  account_number?: string
  mfo?: string
  [key: string]: unknown
}

export interface CountSummary {
  cart_count?: number
  favorites_count?: number
  orders_count?: number
  notifications_count?: number
  [key: string]: unknown
}

/** `manage` endpoints use a single function for create / update / delete. */
export type ManageAction = 'create' | 'update' | 'delete'
