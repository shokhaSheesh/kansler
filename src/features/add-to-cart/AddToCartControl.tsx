import { Box, IconButton } from '@chakra-ui/react'
import { Plus } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import type { Variation } from '@/entities/product/types'
import { QuantityStepper } from '@/shared/ui/QuantityStepper'
import { useCartLine } from './useCartLine'

interface AddToCartControlProps {
  variation: Variation
  name: string
  size?: 'sm' | 'md'
}

/** Compact cart control for cards: "+" circle -> "− n +" pill (trash at 1). */
export const AddToCartControl = observer(({ variation, name, size = 'md' }: AddToCartControlProps) => {
  const { t } = useTranslation()
  const { qty, change } = useCartLine(variation, name)

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
