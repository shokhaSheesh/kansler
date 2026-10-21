import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { paths } from '@/app/router/paths'
import type { Variation } from '@/entities/product/types'
import { mockCart } from '@/mocks/cart.store'
import { toaster } from '@/shared/ui/toaster'

const CART_TOAST = 'cart-added'

export const unitPrice = (v: Variation) => (v.discount_percent && v.discount_price ? v.discount_price : v.price)

/**
 * One cart line: quantity + change(), with the "added" toast on the first add.
 * Used by the card "+" control and the product-page buy box so they behave identically.
 * `silent`: no toast (the variant picker shows the cart state itself).
 * Call inside an observer component. Wiring: useAddToCart / useRemoveFromCart.
 */
export const useCartLine = (variation: Variation, name: string, opts: { silent?: boolean } = {}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const qty = mockCart.qty(variation.guid)

  const change = (n: number) => {
    if (qty === 0 && n > 0 && !opts.silent) {
      // One cart toast at a time: rapid adds replace it instead of stacking
      const toast = {
        type: 'success' as const,
        title: t('cart.added'),
        description: name,
        duration: 3500,
        meta: { image: variation.image[0] },
        action: { label: t('cart.go_to_cart'), onClick: () => navigate(paths.cart) },
      }
      if (toaster.isVisible(CART_TOAST)) toaster.update(CART_TOAST, toast)
      else toaster.create({ id: CART_TOAST, ...toast })
    }
    mockCart.set(variation.guid, n, unitPrice(variation))
  }

  return { qty, change }
}
