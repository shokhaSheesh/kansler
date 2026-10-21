import { Box, IconButton } from '@chakra-ui/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { paths } from '@/app/router/paths'
import type { Variation } from '@/entities/product/types'
import { QuantityStepper } from '@/shared/ui/QuantityStepper'
import { toaster } from '@/shared/ui/toaster'

interface AddToCartControlProps {
  variation: Variation
  name: string
}

/**
 * Compact cart control for product cards: "+" circle -> "− n +" pill (trash at 1).
 * Design phase: local state. Wiring: useAddToCart / useRemoveFromCart (entities/cart/queries).
 */
export const AddToCartControl = ({ variation, name }: AddToCartControlProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [qty, setQty] = useState(variation.cart_quantity ?? 0)

  const change = (n: number) => {
    if (qty === 0 && n > 0) {
      toaster.create({
        type: 'success',
        title: t('cart.added'),
        description: name,
        duration: 3500,
        action: { label: t('cart.go_to_cart'), onClick: () => navigate(paths.cart) },
      })
    }
    setQty(n)
  }

  if (qty === 0) {
    return (
      <IconButton
        aria-label={t('add_to_cart')}
        title={t('add_to_cart')}
        size="md"
        borderRadius="full"
        colorPalette="brand"
        boxShadow="0 4px 12px rgba(16, 24, 40, 0.24)"
        transition="transform .15s"
        _hover={{ transform: 'scale(1.06)' }}
        _active={{ transform: 'scale(0.96)' }}
        onClick={(e) => {
          e.preventDefault()
          change(1)
        }}
      >
        <Plus size={20} strokeWidth={2.5} />
      </IconButton>
    )
  }

  return (
    <Box css={{ animation: 'pill-in .16s ease-out', transformOrigin: 'right center' }}>
      <QuantityStepper variant="solid" value={qty} max={variation.in_stock} onChange={change} />
    </Box>
  )
}
