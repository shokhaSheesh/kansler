import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'

const MAX = 8

/** "История поиска": kept on the device, like the live site (no backend endpoint for it). */
class SearchHistoryStore {
  items: string[] = []

  constructor() {
    makeAutoObservable(this)
    if (typeof window !== 'undefined') {
      makePersistable(this, { name: 'search_history', storage: window.localStorage, properties: ['items'] })
    }
  }

  add(query: string) {
    const q = query.trim().replace(/\s+/g, ' ')
    if (q.length < 2) return
    this.items = [q, ...this.items.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, MAX)
  }

  remove(query: string) {
    this.items = this.items.filter((x) => x !== query)
  }

  clear() {
    this.items = []
  }
}

export const searchHistory = new SearchHistoryStore()
