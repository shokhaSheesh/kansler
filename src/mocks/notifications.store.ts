import { makeAutoObservable } from 'mobx'
import { mockOrders, type OrderStatus } from './orders.store'

/**
 * Design-phase notifications (live: /notifications/list, /notifications/count, /notifications/mark-read).
 * Live messages come from the backend as text (body_ru / body_uz); the samples use the site's own
 * order-status texts (profile.notifications_page.items.*), one per status change of the sample orders.
 */
export interface Notification {
  guid: string
  orders_id: string
  status: OrderStatus
  /** Key in profile.notifications_page.items */
  body: 'confirmed' | 'handed_to_courier' | 'delivered' | 'cancelled'
  created_time: string
  is_read_by_me: boolean
}

// Which status changes send a notification, oldest first
const STEPS: Partial<Record<OrderStatus, Array<[OrderStatus, Notification['body']]>>> = {
  paid: [['assembling', 'confirmed']],
  assembling: [['assembling', 'confirmed']],
  shipping: [
    ['assembling', 'confirmed'],
    ['shipping', 'handed_to_courier'],
  ],
  delivered: [
    ['assembling', 'confirmed'],
    ['shipping', 'handed_to_courier'],
    ['delivered', 'delivered'],
  ],
  cancelled: [['cancelled', 'cancelled']],
}

class MockNotificationsStore {
  /** guids marked read in this session */
  read = new Set<string>()

  constructor() {
    makeAutoObservable(this)
  }

  /** Newest first */
  get list(): Notification[] {
    const out: Notification[] = []
    mockOrders.orders.forEach((o) => {
      const placed = new Date(o.created_at).getTime()
      ;(STEPS[o.status] ?? []).forEach(([status, body], i) => {
        const guid = `${o.order_id}-${i}`
        const created = new Date(placed + (i + 1) * 5 * 3_600_000)
        // Sample: anything from the last 3 days is unread
        const fresh = Date.now() - created.getTime() < 3 * 86_400_000
        out.push({ guid, orders_id: o.order_id, status, body, created_time: created.toISOString(), is_read_by_me: !fresh || this.read.has(guid) })
      })
    })
    return out.sort((a, b) => b.created_time.localeCompare(a.created_time))
  }

  get unread() {
    return this.list.filter((n) => !n.is_read_by_me).length
  }

  markRead(guid: string) {
    this.read.add(guid)
  }
}

export const mockNotifications = new MockNotificationsStore()
