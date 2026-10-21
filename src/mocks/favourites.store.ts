import { makeAutoObservable, observable } from 'mobx'
import type { Product } from '@/entities/product/types'
import { products } from './index'

/**
 * Design-phase favourites, shared by every ♡ (cards, list rows, search) so the header counter
 * and the Favourites page stay in sync. Seeded with a few real products so the page isn't empty on first look.
 * Wiring: useFavourites / useFavouritesCount / useToggleFavourite (entities/product/queries).
 */
const hasDiscount = (p: Product) => p.variations.some((v) => (v.discount_percent ?? 0) > 0)
const seed = [...products.filter(hasDiscount).slice(2, 6), ...products.filter((p) => !hasDiscount(p)).slice(30, 38)]

class MockFavouritesStore {
  items = observable.map<string, Product>(seed.map((p) => [p.guid, p]))

  constructor() {
    makeAutoObservable(this)
  }

  has(id: string) {
    return this.items.has(id)
  }

  toggle(product: Product) {
    if (this.items.has(product.guid)) this.items.delete(product.guid)
    else this.items.set(product.guid, product)
  }

  get count() {
    return this.items.size
  }

  get list() {
    return [...this.items.values()]
  }
}

export const mockFavourites = new MockFavouritesStore()
