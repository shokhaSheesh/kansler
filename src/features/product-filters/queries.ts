import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { mockProductList, type ProductListParams } from '@/mocks/products'

/** Design phase: mock. Wiring: productApi.list + productApi.priceRange + productApi.colors. */
export const useProductList = (params: ProductListParams) =>
  useQuery({
    queryKey: ['PRODUCT_LIST', { ...params, source: params.source?.map((p) => p.guid) }],
    queryFn: () => mockProductList(params),
    placeholderData: keepPreviousData,
  })
