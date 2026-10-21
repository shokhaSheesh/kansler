import { Box, IconButton } from '@chakra-ui/react'
import { Plus } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { paths } from '@/app/router/paths'
import type { Variation } from '@/entities/product/types'
import { mockCart } from '@/mocks/cart.store'
import { QuantityStepper } from '@/shared/ui/QuantityStepper'
import { toaster } from '@/shared/ui/toaster'

const CART_TOAST = 'cart-added'

interface AddToCartControlProps {
  variation: Variation
  name: string
  size?: 'sm' | 'md'
}

/**
 * Compact cart control: "+" circle -> "− n +" pill (trash at 1).
 * Design phase: shared mock cart. Wiring: useAddToCart / useRemoveFromCart (entities/cart/queries).
 */
export const AddToCartControl = observer(({ variation, name, size = 'md' }: AddToCartControlProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const qty = mockCart.qty(variation.guid)

  const change = (n: number) => {
    if (qty === 0 && n > 0) {
      // One cart toast at a time: rapid adds replace it instead of stacking over the products
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
    mockCart.set(variation.guid, n)
  }

  if (qty === 0) {
    return (
      <IconButton
        aria-label={t('add_to_cart')}
        title={t('add_to_cart')}
        size={size === 'sm' ? 'sm' : 'md'}
        borderRadius="full"
        colorPalette="brand"
        boxShadow="0 4px 12px rgba(16, 24, 40, 0.24)"
        transition="transform .15s"
        _hover={{ transform: 'scale(1.06)' }}
        _active={{ transform: 'scale(0.96)' }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          change(1)
        }}
      >
        <Plus size={size === 'sm' ? 18 : 20} strokeWidth={2.5} />
      </IconButton>
    )
  }

  return (
    <Box css={{ animation: 'pill-in .16s ease-out', transformOrigin: 'right center' }} onClick={(e) => e.stopPropagation()}>
      <QuantityStepper variant="solid" value={qty} max={variation.in_stock} onChange={change} />
    </Box>
  )
})
