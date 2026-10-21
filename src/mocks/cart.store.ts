import { makeAutoObservable, observable } from 'mobx'

interface Line {
  qty: number
  /** Unit price at the time of adding (final price after discount). */
  price: number
}

/**
 * Design-phase cart: shared across every card / search result / product page so quantities,
 * the header badge and the free-delivery progress stay in sync.
 * Wiring: replace with useCart / useCartCount / useAddToCart (entities/cart/queries).
 */
class MockCartStore {
  items = observable.map<string, Line>()

  constructor() {
    makeAutoObservable(this)
  }

  qty(variationId: string) {
    return this.items.get(variationId)?.qty ?? 0
  }

  set(variationId: string, quantity: number, price?: number) {
    if (quantity <= 0) this.items.delete(variationId)
    else this.items.set(variationId, { qty: quantity, price: price ?? this.items.get(variationId)?.price ?? 0 })
  }

  /** Header badge shows the number of lines, like the live /content/cart/count. */
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
