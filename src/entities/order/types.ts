import type { Product } from '@/entities/product/types'

/** Status labels are resolved through i18n: `order.status.<status>` */
export type OrderStatus = 'new' | 'confirmed' | 'in_progress' | 'delivering' | 'delivered' | 'cancelled' | string

export type PaymentType = 'card' | 'bank_transfer' | 'cash' | string

export interface Order {
  guid: string
  order_number?: string
  status: OrderStatus
  total_price: number
  discount_price?: number
  created_at: string
  payment_type?: PaymentType
  address?: string
  receiver?: { fullname: string; phone: string }
  items?: Product[]
  contract_url?: string
  [key: string]: unknown
}

export interface CreateOrderPayload {
  address_id: string
  receiver_id: string
  payment_type: PaymentType
  bank_account_id?: string
  card_id?: string
  promo_code?: string
  comment?: string
  delivery_date?: string
}

export interface Review {
  guid: string
  rating: number
  comment?: string
  created_at: string
}

export interface PromoCode {
  guid: string
  code: string
  discount_percent?: number
  discount_amount?: number
  expires_at?: string
}

export interface Card {
  guid: string
  pan: string // masked
  expire: string
  bank?: string
}
