import type { OrderStatus } from '@/mocks/orders.store'

/** Live step per status: assembling/paid/waiting → 0, shipping → 1, delivered → 2. Others show no progress. */
export const STEP: Partial<Record<OrderStatus, number>> = { waiting: 0, assembling: 0, paid: 0, shipping: 1, delivered: 2 }

export const hasProgress = (status: OrderStatus) => STEP[status] !== undefined
