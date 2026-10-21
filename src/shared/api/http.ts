import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/shared/config/env'
import { authStore } from '@/stores/auth.store'
import type { AuthToken } from '@/entities/user/types'

/**
 * Port of the live kansler.uz client:
 *  - every endpoint is POST `{ data: payload }` to the u-code function gateway
 *  - responses are unwrapped to `response.data`
 *  - 401 -> one shared refresh-token request, queued retries, logout on failure
 *  - `Authorization: "free"` on a request skips the bearer token
 */
const baseConfig = {
  baseURL: env.apiUrl,
  timeout: 100_000,
  headers: {
    'Content-Type': 'application/json',
    'Environment-Id': env.environmentId,
  },
  params: { 'project-id': env.projectId },
}

export const http = axios.create(baseConfig)
const refreshClient = axios.create(baseConfig)

const REFRESH_URL = '/auth/user/refresh-token'

let isRefreshing = false
let queue: Array<{ resolve: (t: AuthToken) => void; reject: (e: unknown) => void }> = []

const flushQueue = (error: unknown, token: AuthToken | null) => {
  queue.forEach(({ resolve, reject }) => (error || !token ? reject(error) : resolve(token)))
  queue = []
}

let didForceLogout = false
const forceLogout = () => {
  if (didForceLogout) return
  didForceLogout = true
  const hadSession = authStore.isAuthorized || Boolean(authStore.token?.refresh_token)
  authStore.logout()
  if (hadSession && window.location.pathname !== '/home') window.location.replace('/home')
}

const refreshToken = async (): Promise<AuthToken> => {
  const refresh_token = authStore.token?.refresh_token
  if (!refresh_token) throw new Error('Missing refresh token')
  const res = await refreshClient.post(REFRESH_URL, { data: { refresh_token } })
  const token: AuthToken | undefined = res.data?.data?.token ?? res.data?.token
  if (!token?.access_token) throw new Error('Refresh token request failed')
  authStore.setToken(res.data)
  return token
}

http.interceptors.request.use((config) => {
  const access = authStore.token?.access_token
  const auth = config.headers.Authorization ?? config.headers.authorization
  if (access) {
    if (auth === 'free') {
      delete config.headers.Authorization
      delete config.headers.authorization
      return config
    }
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res?.data,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    if (error.response?.status !== 401 || !original) return Promise.reject(error)
    if (original.url?.includes(REFRESH_URL)) {
      forceLogout()
      return Promise.reject(error)
    }
    if (!authStore.token?.refresh_token) return Promise.reject(error)
    if (original._retry) {
      forceLogout()
      return Promise.reject(error)
    }
    original._retry = true

    if (isRefreshing) {
      return new Promise<AuthToken>((resolve, reject) => queue.push({ resolve, reject })).then(
        (token) => {
          original.headers.Authorization = `Bearer ${token.access_token}`
          return http(original)
        },
      )
    }

    isRefreshing = true
    try {
      const token = await refreshToken()
      flushQueue(null, token)
      original.headers.Authorization = `Bearer ${token.access_token}`
      return http(original)
    } catch (e) {
      flushQueue(e, null)
      forceLogout()
      return Promise.reject(e)
    } finally {
      isRefreshing = false
    }
  },
)

/** Every gateway function takes `{ data }`. Interceptor already unwraps axios' `res.data`. */
export const post = <TRes, TReq = unknown>(url: string, data?: TReq) =>
  http.post<TRes, TRes>(url, { data: data ?? {} })
