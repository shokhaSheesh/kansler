import { Box, Button, CloseButton, Dialog, Flex, Image, Portal, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { paths } from '@/app/router/paths'
import type { Product } from '@/entities/product/types'
import { mockCart } from '@/mocks/cart.store'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { Price } from '@/shared/ui/Price'
import { VariationCartControl } from './VariationCartControl'

interface VariantPickerDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * "Which variant?" for multi-variant products added from a card. Every variant with its photo, price and
 * its own quantity control, so a buyer can take several at once. Phone: bottom sheet. Desktop: centred.
 */
export const VariantPickerDialog = observer(({ product, open, onOpenChange }: VariantPickerDialogProps) => {
  const { t } = useTranslation()
  const lang = useLang()
  const navigate = useNavigate()
  const sheet = useBreakpointValue({ base: true, md: false })
  const productName = localized(product, 'name', lang)
  const inCart = product.variations.reduce((sum, v) => sum + mockCart.qty(v.guid), 0)

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      placement={sheet ? 'bottom' : 'center'}
      motionPreset={sheet ? 'slide-in-bottom' : 'scale'}
      size={sheet ? 'full' : 'md'}
      scrollBehavior="inside"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            borderRadius={sheet ? '20px 20px 0 0' : 'modal'}
            maxH={sheet ? '85dvh' : '80dvh'}
            h={sheet ? 'auto' : undefined}
            mt={sheet ? 'auto' : undefined}
            mb={sheet ? '0' : undefined}
          >
            <Dialog.Header borderBottomWidth="1px" borderColor="border.subtle" py="4" pe="12">
              <Stack gap="0.5">
                <Dialog.Title fontSize="md" fontWeight="700" lineClamp="2">
                  {productName}
                </Dialog.Title>
                <Text fontSize="sm" color="fg.muted">
                  {t('product_card.variants', { count: product.variations.length })}
                </Text>
              </Stack>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>

            <Dialog.Body px="4" py="2">
              <Stack gap="0">
                {product.variations.map((v, i) => {
                  const name = localized(v, 'name', lang) || productName
                  const discount = v.discount_percent ?? 0
                  return (
                    <Flex key={v.guid} align="center" gap="3" py="3" borderTopWidth={i ? '1px' : 0} borderColor="border.subtle" opacity={v.in_stock > 0 ? 1 : 0.5}>
                      <Box boxSize="64px" flexShrink="0" bg="kgray.50" borderRadius="primary" overflow="hidden">
                        <Image src={v.image[0]} alt="" w="full" h="full" fit="contain" p="1" mixBlendMode="multiply" />
                      </Box>
                      <Stack flex="1" minW="0" gap="1">
                        <Text fontSize="sm" fontWeight="600" color="fg.default">
                          {t('product_detail.variant')} {i + 1}
                          {v.color && (
                            <Text as="span" fontWeight="400" color="fg.muted">
                              {' · '}
                              {localized(v.color, 'name', lang)}
                            </Text>
                          )}
                        </Text>
                        {name !== productName && (
                          <Text fontSize="xs" color="fg.muted" lineClamp="1">
                            {name}
                          </Text>
                        )}
                        <Price value={discount && v.discount_price ? v.discount_price : v.price} oldValue={discount ? v.price : null} size="sm" />
                      </Stack>
                      <Box flexShrink="0">
                        {v.in_stock > 0 ? (
                          <VariationCartControl variation={v} name={name} silent />
                        ) : (
                          <Text fontSize="xs" color="fg.subtle">
                            {t('product_detail.out_of_stock')}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  )
                })}
              </Stack>
            </Dialog.Body>

            <Dialog.Footer borderTopWidth="1px" borderColor="border.subtle" py="3" pb={sheet ? 'calc(12px + env(safe-area-inset-bottom))' : '3'}>
              <Button
                w="full"
                h="48px"
                borderRadius="control"
                colorPalette="brand"
                disabled={inCart === 0}
                onClick={() => {
                  onOpenChange(false)
                  navigate(paths.cart)
                }}
              >
                {inCart > 0 ? `${t('cart.go_to_cart')} · ${inCart}` : t('cart.go_to_cart')}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
})
