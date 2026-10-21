import { makeAutoObservable, observable } from 'mobx'

/**
 * Design-phase cart: shared across every card / search result so quantities and the header badge stay in sync.
 * Wiring: replace with useCart / useCartCount / useAddToCart (entities/cart/queries).
 */
class MockCartStore {
  items = observable.map<string, number>()

  constructor() {
    makeAutoObservable(this)
  }

  qty(variationId: string) {
    return this.items.get(variationId) ?? 0
  }

  set(variationId: string, quantity: number) {
    if (quantity <= 0) this.items.delete(variationId)
    else this.items.set(variationId, quantity)
  }

  /** Header badge shows the number of lines, like the live /content/cart/count. */
  get count() {
    return this.items.size
  }
}

export const mockCart = new MockCartStore()
