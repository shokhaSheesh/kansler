import { makeAutoObservable, observable } from 'mobx'
import type { Variation } from '@/entities/product/types'

export interface CartLine {
  variation: Variation
  /** Display name (variation name, or the product name). */
  name: string
  qty: number
  /** Unit price at the time of adding (final price after discount). */
  price: number
  addedAt: number
}

/**
 * Design-phase cart, shared by cards, the variant picker, search, the product page, the cart page and the
 * header preview. Mirrors POST /content/cart/items/list, which returns lines plus
 * `delivery: { free_from, delivery_price }`.
 * Wiring: useCart / useCartCount / useAddToCart / useRemoveFromCart (entities/cart/queries).
 */
class MockCartStore {
  items = observable.map<string, CartLine>()
  /** Live cart response: delivery.free_from / delivery.delivery_price */
  delivery = { free_from: 500_000, delivery_price: 25_000 }

  constructor() {
    makeAutoObservable(this)
  }

  qty(variationId: string) {
    return this.items.get(variationId)?.qty ?? 0
  }

  set(variation: Variation, quantity: number, price: number, name: string) {
    if (quantity <= 0) this.items.delete(variation.guid)
    else {
      const prev = this.items.get(variation.guid)
      this.items.set(variation.guid, { variation, name, qty: quantity, price, addedAt: prev?.addedAt ?? Date.now() })
    }
  }

  remove(variationIds: string[]) {
    variationIds.forEach((id) => this.items.delete(id))
  }

  /** Newest first */
  get lines() {
    return [...this.items.values()].sort((a, b) => b.addedAt - a.addedAt)
  }

  /** Header badge: number of lines, like the live /content/cart/count. */
  get count() {
    return this.items.size
  }

  get total() {
    let sum = 0
    this.items.forEach((l) => (sum += l.qty * l.price))
    return sum
  }
}

export const mockCart = new MockCartStore()
