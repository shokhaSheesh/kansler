import { Navigate } from 'react-router'
import { paths } from '@/app/router/paths'

/**
 * Live phone-only page for typing a promo code during checkout. In the redesign the promo code is entered
 * right in the checkout summary, so this address returns to the cart.
 */
export default function PromocodePage() {
  return <Navigate to={paths.cart} replace />
}
