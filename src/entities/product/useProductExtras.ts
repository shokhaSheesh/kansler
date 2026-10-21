import { useQuery } from '@tanstack/react-query'
import { loadDetails } from '@/mocks/product-details'
import { htmlToText } from '@/shared/lib/sanitize'
import type { Lang } from '@/shared/types/api'

/**
 * Brand + short description for product cards.
 * The live list endpoint (/content/product/list) does NOT return these; they only come from
 * /content/product/single. Wiring needs the backend to add `brand` and a short description to the list
 * response (one request per card would be too slow). Design phase: read from the detail snapshot.
 */
export const useProductExtras = (guid: string, lang: Lang) => {
  const { data } = useQuery({ queryKey: ['PRODUCT_DETAILS_MAP'], queryFn: loadDetails, staleTime: Infinity })
  const d = data?.[guid]
  if (!d) return { brand: '', description: '' }
  const brand = (lang === 'uz' ? d.brand?.value_uz : d.brand?.value_ru) || d.brand?.value_ru || ''
  const v = d.variations[0]
  const description = (lang === 'uz' && htmlToText(v?.description_uz)) || htmlToText(v?.description_ru)
  return { brand, description }
}
