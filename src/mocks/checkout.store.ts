import { makeAutoObservable } from 'mobx'
import type { CartLine } from './cart.store'
import { mockProfile } from './profile.store'

/**
 * Design-phase checkout. Live flow: "Перейти к оформлению" creates an order (KP pdf + /order/create) and opens
 * /checkout/:orderId. Addresses, recipients and cards come from the logged-in account
 * (/user/address/list, /user/receiver/list, /cards/list), so the design uses the SAMPLE lists in profile.store.
 */
export type { Address, Card, Receiver } from './profile.store'

export type PaymentType = 'corporate' | 'transfer'

/** Sample promo codes: one valid (5%, from 100 000), one expired. Anything else is invalid. */
export const SAMPLE_PROMOS: Record<string, { percent?: number; minPrice?: number; expired?: boolean }> = {
  KANSLER5: { percent: 5, minPrice: 100_000 },
  OLD2025: { expired: true },
}

class MockCheckoutStore {
  orderId: string | null = null
  lines: CartLine[] = []
  addressId: string | null = null
  receiverId: string | null = null
  cardId: string | null = mockProfile.cards[0]?.guid ?? null
  paymentType: PaymentType = 'corporate'
  promo: { code: string; percent: number } | null = null

  constructor() {
    makeAutoObservable(this)
  }

  /** Cart "Перейти к оформлению": snapshot the selected lines into a new order. */
  start(lines: CartLine[]) {
    this.lines = lines.map((l) => ({ ...l }))
    this.orderId = String(100_000 + Math.floor(Math.random() * 900_000))
    this.promo = null
    return this.orderId
  }

  /** Orders list "Продолжать": reopen checkout for an order that was not finished. */
  resume(orderId: string, lines: CartLine[]) {
    this.lines = lines
    this.orderId = orderId
    this.promo = null
  }

  setAddress(id: string) {
    this.addressId = id
  }
  setReceiver(id: string) {
    this.receiverId = id
  }
  setCard(id: string) {
    this.cardId = id
  }
  setPaymentType(t: PaymentType) {
    this.paymentType = t
  }
  addCard(last4: string) {
    this.cardId = mockProfile.addCard(last4)
  }
  setPromo(p: { code: string; percent: number } | null) {
    this.promo = p
  }

  // Same lists as the profile pages (/user/address/list, /user/receiver/list, /cards/list)
  get addresses() {
    return mockProfile.addresses
  }
  get receivers() {
    return mockProfile.receivers
  }
  get cards() {
    return mockProfile.cards
  }
  get userPhone() {
    return mockProfile.user.phone
  }

  get address() {
    return this.addresses.find((a) => a.guid === this.addressId) ?? null
  }
  get receiver() {
    return this.receivers.find((r) => r.guid === this.receiverId) ?? null
  }
  get card() {
    return this.cards.find((c) => c.guid === this.cardId) ?? null
  }

  /** Same fields as the live order: totalPrice, total_discount, promocodeDiscount, delivery_cost, final_price. */
  get prices() {
    const totalPrice = this.lines.reduce((s, l) => s + l.variation.price * l.qty, 0)
    const afterDiscount = this.lines.reduce((s, l) => s + l.price * l.qty, 0)
    const total_discount = totalPrice - afterDiscount
    const promocodeDiscount = this.promo ? Math.round((afterDiscount * this.promo.percent) / 100) : 0
    const delivery_cost = afterDiscount >= 500_000 ? 0 : 25_000
    const final_price = afterDiscount - promocodeDiscount + delivery_cost
    return { totalPrice, total_discount, promocodeDiscount, delivery_cost, final_price, items: this.lines.length }
  }
}

export const mockCheckout = new MockCheckoutStore()
