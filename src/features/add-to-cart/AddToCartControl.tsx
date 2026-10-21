import { Button, IconButton } from '@chakra-ui/react'
import { Check, Plus } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Product } from '@/entities/product/types'
import { mockCart } from '@/mocks/cart.store'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { VariantPickerDialog } from './VariantPickerDialog'
import { VariationCartControl } from './VariationCartControl'

/**
 * Card cart control.
 * One variant: "+" → "− n +" right on the card.
 * Several variants: "+" opens the variant picker; once something is in the cart the button shows ✓ and the total.
 */
export const AddToCartControl = observer(({ product, size = 'md' }: { product: Product; size?: 'sm' | 'md' }) => {
  const { t } = useTranslation()
  const lang = useLang()
  const [open, setOpen] = useState(false)
  const variants = product.variations

  if (variants.length <= 1) {
    const v = variants[0]
    if (!v) return null
    return <VariationCartControl variation={v} name={localized(v, 'name', lang) || localized(product, 'name', lang)} size={size} />
  }

  const inCart = variants.reduce((sum, v) => sum + mockCart.qty(v.guid), 0)
  const openPicker = (e: { preventDefault: () => void; stopPropagation: () => void }) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(true)
  }

  return (
    <>
      {inCart > 0 ? (
        <Button
          size={size === 'sm' ? 'sm' : 'md'}
          borderRadius="full"
          colorPalette="brand"
          gap="1.5"
          px="3.5"
          boxShadow="0 4px 12px rgba(16, 24, 40, 0.24)"
          aria-label={t('product_detail.add_cart_mobile')}
          title={t('product_detail.add_cart_mobile')}
          onClick={openPicker}
        >
          <Check size={16} strokeWidth={2.5} />
          {inCart}
        </Button>
      ) : (
        <IconButton
          aria-label={t('add_to_cart')}
          title={t('add_to_cart')}
          size={size === 'sm' ? 'sm' : 'md'}
          borderRadius="full"
          colorPalette="brand"
          boxShadow="0 4px 12px rgba(16, 24, 40, 0.24)"
          onClick={openPicker}
        >
          <Plus size={size === 'sm' ? 18 : 20} strokeWidth={2.5} />
        </IconButton>
      )}
      <VariantPickerDialog product={product} open={open} onOpenChange={setOpen} />
    </>
  )
})
