import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'
import type { Order, PromoCode } from '@/entities/order/types'

/** Same persisted shape as the live `order_store`, so checkout survives reloads / payment redirects. */
class OrderStore {
  orders: Order[] = []
  pdfurl: string | null = null
  order_data: Record<string, unknown> | null = null
  contract: Record<string, unknown> | null = null
  contractUrl: string | null = null
  document_name: string | null = null
  document_no: string | null = null
  transaction_id: string | null = null
  promocode_data: PromoCode | null = null
  transaction_data: Record<string, unknown> | null = null

  constructor() {
    makeAutoObservable(this)
    if (typeof window !== 'undefined') {
      makePersistable(this, {
        name: 'order_store',
        storage: window.localStorage,
        properties: ['orders', 'pdfurl', 'contract', 'transaction_id', 'promocode_data', 'order_data', 'transaction_data'],
      })
    }
  }

  setOrderData(data: Record<string, unknown> | null) {
    this.order_data = data
  }
  setPromoCode(data: PromoCode | null) {
    this.promocode_data = data
  }
  setTransaction(id: string | null, data: Record<string, unknown> | null = null) {
    this.transaction_id = id
    this.transaction_data = data
  }
  setContract(contract: Record<string, unknown> | null, url: string | null = null) {
    this.contract = contract
    this.contractUrl = url
  }
  reset() {
    this.order_data = null
    this.promocode_data = null
    this.transaction_id = null
    this.transaction_data = null
    this.contract = null
    this.contractUrl = null
    this.pdfurl = null
  }
}

export const orderStore = new OrderStore()
