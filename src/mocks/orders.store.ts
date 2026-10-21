import { makeAutoObservable, runInAction } from 'mobx'
import type { Product, Variation } from '@/entities/product/types'
import type { Localized } from '@/shared/types/api'
import type { CartLine } from './cart.store'
import { loadCatalog } from './catalog'
import { finalPrice } from './products'

/**
 * Design-phase orders. Same fields as the live POST /order/list item (order_id, status, created_at, final_price,
 * payment_info, agreement, items_count, address, product_images) plus the lines /order/details returns.
 * The SAMPLE orders below are built from real catalog products; orders placed in checkout are added on top.
 */
export type OrderStatus = 'waiting' | 'assembling' | 'paid' | 'shipping' | 'in-progress' | 'delivered' | 'cancelled'

export interface OrderItem extends Localized<'name'> {
  productId: string
  variation: Variation
  quantity: number
  price: number
  /** Price before discount, when there was one. */
  oldPrice: number
}

export interface Order {
  order_id: string
  status: OrderStatus
  created_at: string
  final_price: number
  /** Card payments; empty strings for bank transfer. */
  payment_info: { card_type: string; card_number: string }
  /** Bank transfer (Didox) contract; null for card payments. */
  agreement: { contract_number: string; is_sent: boolean } | null
  items_count: number
  address: string
  product_images: string[]
  items: OrderItem[]
  /** /order/details: sum before discounts, delivery, discount. */
  total_price: number
  delivery_cost: number
  total_discount: number
  /** Fiscal receipt ("Скачать чек"), present once paid by card. */
  ofd_url?: string
  /** The buyer already left a review: "Спасибо за ваш отзыв" banner. */
  has_review?: boolean
}

/** Live list page size (/order/list limit: 5). */
export const ORDERS_PAGE_SIZE = 5

/** Live tab "В процессе": every not-yet-finished status. */
export const IN_PROGRESS = new Set<OrderStatus>(['waiting', 'assembling', 'paid', 'shipping', 'in-progress'])

/**
 * Live rule for where an order opens: card-paid orders and sent transfer contracts open the order details;
 * a transfer whose contract was not sent yet goes back to checkout ("Продолжать").
 */
export const isPlaced = (o: Order) =>
  Boolean((o.agreement?.is_sent && o.payment_info.card_number === '') || (o.payment_info.card_number !== '' && o.agreement === null))

const ADDRESSES = ['г. Ташкент, Мирабадский район, ул. Авлиё Ота, д. 7', 'г. Ташкент, Юнусабадский район, ул. Амира Темура, 107Б']

// SAMPLE orders: status, days ago, payment, how many products, starting index into the catalog
const SAMPLE: Array<{ status: OrderStatus; daysAgo: number; card?: [string, string]; contract?: boolean; sent?: boolean; n: number; from: number }> = [
  { status: 'waiting', daysAgo: 0, contract: true, sent: false, n: 3, from: 11 },
  { status: 'assembling', daysAgo: 1, card: ['UZCARD', '4512'], n: 5, from: 40 },
  { status: 'shipping', daysAgo: 2, contract: true, sent: true, n: 2, from: 73 },
  { status: 'paid', daysAgo: 3, card: ['HUMO', '0731'], n: 1, from: 95 },
  { status: 'delivered', daysAgo: 9, card: ['UZCARD', '4512'], n: 7, from: 120 },
  { status: 'delivered', daysAgo: 16, contract: true, sent: true, n: 4, from: 160 },
  { status: 'cancelled', daysAgo: 21, card: ['UZCARD', '4512'], n: 2, from: 210 },
  { status: 'delivered', daysAgo: 34, card: ['HUMO', '0731'], n: 3, from: 250 },
  { status: 'delivered', daysAgo: 48, contract: true, sent: true, n: 6, from: 300 },
]

const itemFrom = (p: Product, quantity: number): OrderItem => {
  const v = p.variations[0]
  const price = finalPrice(p)
  return { productId: p.guid, variation: v, name_ru: v.name_ru || p.name_ru, name_uz: v.name_uz || p.name_uz, quantity, price, oldPrice: price < v.price ? v.price : 0 }
}

type Computed = 'final_price' | 'items_count' | 'product_images' | 'items' | 'total_price' | 'delivery_cost' | 'total_discount'

// Same rule as checkout: delivery 25 000 сум, free from 500 000 сум
const build = (items: OrderItem[], rest: Omit<Order, Computed>): Order => {
  const total_price = items.reduce((s, i) => s + (i.oldPrice || i.price) * i.quantity, 0)
  const afterDiscount = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const delivery_cost = afterDiscount >= 500_000 ? 0 : 25_000
  return {
    ...rest,
    items,
    items_count: items.length,
    product_images: items.map((i) => i.variation.image[0]).filter(Boolean),
    total_price,
    total_discount: total_price - afterDiscount,
    delivery_cost,
    final_price: afterDiscount + delivery_cost,
  }
}

class MockOrdersStore {
  orders: Order[] = []
  ready = false

  constructor() {
    makeAutoObservable(this)
  }

  async load() {
    if (this.ready) return
    const catalog = (await loadCatalog()).filter((p) => p.variations[0]?.image?.length)
    const sample = SAMPLE.map((s, k) => {
      const items = Array.from({ length: s.n }, (_, i) => itemFrom(catalog[(s.from + i * 7) % catalog.length], 1 + ((k + i) % 4) * 2))
      const date = new Date(Date.now() - s.daysAgo * 86_400_000)
      date.setHours(10 + k, 15 * (k % 4))
      return build(items, {
        order_id: String(686_120 - k * 37),
        status: s.status,
        created_at: date.toISOString(),
        payment_info: s.card ? { card_type: s.card[0], card_number: `**** ${s.card[1]}` } : { card_type: '', card_number: '' },
        agreement: s.contract ? { contract_number: `KS-${2026_0400 - k * 13}`, is_sent: Boolean(s.sent) } : null,
        address: ADDRESSES[k % 2],
        ofd_url: s.card && s.status !== 'cancelled' ? '#receipt' : undefined,
        has_review: k === 7,
      })
    })
    runInAction(() => {
      // Orders placed during this session stay on top
      this.orders = [...this.orders, ...sample]
      this.ready = true
    })
  }

  /** Checkout success: card payments are paid; transfers wait for payment under a sent contract. */
  place(orderId: string, lines: CartLine[], o: { card?: { type: string; last4: string }; address: string; prices: { totalPrice: number; total_discount: number; delivery_cost: number; final_price: number } }) {
    const items = lines.map((l) => ({ productId: l.variation.product_group_id, variation: l.variation, name_ru: l.name, name_uz: l.variation.name_uz || l.name, quantity: l.qty, price: l.price, oldPrice: l.price < l.variation.price ? l.variation.price : 0 }))
    const order = build(items, {
      order_id: orderId,
      status: o.card ? 'paid' : 'waiting',
      created_at: new Date().toISOString(),
      payment_info: o.card ? { card_type: o.card.type, card_number: `**** ${o.card.last4}` } : { card_type: '', card_number: '' },
      agreement: o.card ? null : { contract_number: `KS-${orderId}`, is_sent: true },
      address: o.address,
      ofd_url: o.card ? '#receipt' : undefined,
    })
    const p = o.prices
    const placed = { ...order, total_price: p.totalPrice, total_discount: p.total_discount, delivery_cost: p.delivery_cost, final_price: p.final_price }
    this.orders = [placed, ...this.orders.filter((x) => x.order_id !== orderId)]
  }

  byId(id: string) {
    return this.orders.find((o) => o.order_id === id) ?? null
  }
}

export const mockOrders = new MockOrdersStore()
