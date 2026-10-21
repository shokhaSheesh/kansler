/** Envelope returned by every gateway function. */
export interface ApiResponse<T> {
  data: T
  error: string
  status: string
}

export interface ListData<T> {
  count: number
  data: T[]
  has_more?: boolean
  limit?: number
  page?: number
  total_pages?: number
}

export type ListResponse<T> = ApiResponse<ListData<T>>

export interface PaginationParams {
  page?: number
  limit?: number
}

/** Most content is stored with `_ru` / `_uz` suffixes. */
export type Localized<K extends string> = { [P in `${K}_ru` | `${K}_uz`]: string }

export type Lang = 'ru' | 'uz'
