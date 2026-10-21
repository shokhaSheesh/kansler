import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'
import type { AuthToken, User } from '@/entities/user/types'

class AuthStore {
  token: AuthToken | null = null
  user: User | null = null
  isAuthorized = false

  constructor() {
    makeAutoObservable(this)
    if (typeof window !== 'undefined') {
      makePersistable(this, {
        name: 'auth_store',
        storage: window.localStorage,
        properties: ['token', 'user', 'isAuthorized'],
      })
    }
  }

  /** Accepts both `{ token }` and `{ data: { token } }` shapes, as the backend returns either. */
  setToken(payload: { token?: AuthToken; data?: { token?: AuthToken } } | AuthToken) {
    const token =
      'access_token' in payload
        ? payload
        : (payload.data?.token ?? payload.token ?? null)
    this.token = token
    this.isAuthorized = Boolean(token?.access_token)
  }

  setUser(user: User | null) {
    this.user = user
  }

  logout() {
    this.token = null
    this.user = null
    this.isAuthorized = false
  }
}

export const authStore = new AuthStore()
