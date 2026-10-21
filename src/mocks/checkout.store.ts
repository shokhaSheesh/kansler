import { makeAutoObservable } from 'mobx'
import type { CartLine } from './cart.store'

/**
 * Design-phase checkout. Live flow: "Перейти к оформлению" creates an order (KP pdf + /order/create) and opens
 * /checkout/:orderId. Addresses, recipients and cards come from the logged-in account
 * (/user/address/list, /user/receiver/list, /cards/list), so the design uses SAMPLE entries below.
 */
export interface Address {
  guid: string
  address: string
  comment?: string
}
export interface Receiver {
  guid: string
  fullname: string
  phone: string
}
export interface Card {
  guid: string
  /** Last 4 digits */
  last4: string
  type: 'UZCARD' | 'HUMO'
}

export type PaymentType = 'corporate' | 'transfer'

// SAMPLE data for design review only
const SAMPLE_ADDRESSES: Address[] = [
  { guid: 'a1', address: 'г. Ташкент, Мирабадский район, ул. Авлиё Ота, д. 7', comment: 'БЦ OASIS, 3 этаж' },
  { guid: 'a2', address: 'г. Ташкент, Юнусабадский район, ул. Амира Темура, 107Б' },
]
const SAMPLE_RECEIVERS: Receiver[] = [
  { guid: 'r1', fullname: 'Азиз Каримов', phone: '+998 90 123 45 67' },
  { guid: 'r2', fullname: 'Дилноза Рахимова', phone: '+998 93 765 43 21' },
]
const SAMPLE_CARDS: Card[] = [
  { guid: 'c1', last4: '4512', type: 'UZCARD' },
  { guid: 'c2', last4: '0731', type: 'HUMO' },
]
/** Sample promo codes: one valid (5%, from 100 000), one expired. Anything else is invalid. */
export const SAMPLE_PROMOS: Record<string, { percent?: number; minPrice?: number; expired?: boolean }> = {
  KANSLER5: { percent: 5, minPrice: 100_000 },
  OLD2025: { expired: true },
}

class MockCheckoutStore {
  orderId: string | null = null
  lines: CartLine[] = []
  addresses = SAMPLE_ADDRESSES
  receivers = SAMPLE_RECEIVERS
  cards = SAMPLE_CARDS
  addressId: string | null = null
  receiverId: string | null = null
  cardId: string | null = SAMPLE_CARDS[0].guid
  paymentType: PaymentType = 'corporate'
  promo: { code: string; percent: number } | null = null
  /** Phone the payment SMS goes to (logged-in user). */
  userPhone = '+998 90 123 45 67'

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
    const card: Card = { guid: `c${Date.now()}`, last4, type: last4.startsWith('9') ? 'HUMO' : 'UZCARD' }
    this.cards = [...this.cards, card]
    this.cardId = card.guid
  }
  setPromo(p: { code: string; percent: number } | null) {
    this.promo = p
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
