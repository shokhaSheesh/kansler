import { Badge, Box, Button, Flex, Grid, HStack, IconButton, Image, Link, Stack, Text } from '@chakra-ui/react'
import { Check, MessageCircle, Package, Share2, ShoppingCart } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { unitPrice, useCartLine } from '@/features/add-to-cart/useCartLine'
import type { ProductDetails, VariationDetails } from '@/entities/product/types'
import { FavouriteButton } from '@/entities/product/ui/FavouriteButton'
import { contacts } from '@/mocks'
import { useLang } from '@/shared/hooks/useLang'
import { formatPrice, localized } from '@/shared/lib/format'
import { Price } from '@/shared/ui/Price'
import { DeliveryPayment } from './DeliveryPayment'
import { QuantityStepper } from '@/shared/ui/QuantityStepper'
import { toaster } from '@/shared/ui/toaster'

interface BuyBoxProps {
  product: ProductDetails
  variation: VariationDetails
  onVariation: (guid: string) => void
}

/** Quantity + "add" for the selected variation. Before adding, buyers can set the amount first (B2B). */
export const CartActions = observer(({ variation, name, compact }: { variation: VariationDetails; name: string; compact?: boolean }) => {
  const { t } = useTranslation()
  const { qty, change } = useCartLine(variation, name)
  const [pending, setPending] = useState(1)
  const h = compact ? '44px' : '52px'

  if (variation.in_stock <= 0) {
    return (
      <Button h={h} w="full" disabled variant="subtle" borderRadius="control" title={t('product_detail.out_of_stock_tooltip')}>
        {t('product_detail.out_of_stock')}
      </Button>
    )
  }

  if (qty > 0) {
    return (
      <Grid templateColumns={compact ? '1fr 1fr' : '160px 1fr'} gap="2" w="full">
        <QuantityStepper value={qty} max={variation.in_stock} onChange={change} />
        <Button asChild h={h} variant="outline" borderRadius="control" borderColor="navy.900" color="navy.900" gap="2">
          <RouterLink to={paths.cart}>
            <Check size={18} />
            {t('product_detail.add_cart_mobile')}
          </RouterLink>
        </Button>
      </Grid>
    )
  }

  return (
    <Grid templateColumns={compact ? '1fr' : '160px 1fr'} gap="2" w="full">
      {!compact && <QuantityStepper value={pending} max={variation.in_stock} onChange={(n) => setPending(Math.max(1, n))} />}
      <Button h={h} colorPalette="brand" borderRadius="control" gap="2" fontSize="md" onClick={() => change(compact ? 1 : pending)}>
        <ShoppingCart size={18} />
        {t('product_detail.add_to_cart')}
      </Button>
    </Grid>
  )
})

export const BuyBox = observer(({ product, variation, onVariation }: BuyBoxProps) => {
  const { t } = useTranslation()
  const lang = useLang()
  const name = localized(variation, 'name', lang) || localized(product, 'name', lang)
  const discount = variation.discount_percent ?? 0
  const brand = product.attributes.find((a) => /бренд|brand/i.test(a.name_ru))

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: name, url })
      else {
        await navigator.clipboard.writeText(url)
        toaster.create({ type: 'success', title: t('url_copied'), duration: 2500 })
      }
    } catch {
      /* user cancelled the share sheet */
    }
  }

  return (
    <Stack gap="5">
      <Stack gap="2">
        {brand && (
          <Text fontSize="sm" color="fg.muted">
            {t('product_detail.brand')}: {localized(brand, 'value', lang)}
          </Text>
        )}
        <Flex gap="2" align="flex-start">
          <Text as="h1" flex="1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="700" color="fg.default" lineHeight="1.25">
            {name}
          </Text>
          <HStack gap="0" flexShrink="0" mt="-1">
            <IconButton aria-label={t('product_detail.share')} title={t('product_detail.share')} size="sm" variant="ghost" borderRadius="full" onClick={share}>
              <Share2 size={18} />
            </IconButton>
            <FavouriteButton product={product} variant="plain" />
          </HStack>
        </Flex>
        {(variation.sku_code || (product.sold_count ?? 0) > 0) && (
          <HStack gap="3" color="fg.muted" fontSize="sm" wrap="wrap">
            {variation.sku_code && <Text>SKU {variation.sku_code}</Text>}
            {(product.sold_count ?? 0) > 0 && (
              <Text>
                {product.sold_count} {t('product_detail.bought_count')}
              </Text>
            )}
          </HStack>
        )}
      </Stack>

      <Stack gap="1">
        <HStack gap="3" align="center">
          <Price value={unitPrice(variation)} oldValue={discount ? variation.price : null} size="lg" />
          {discount > 0 && (
            <Badge bg="primary.main" color="white" borderRadius="full" px="2" fontWeight="700">
              −{discount}%
            </Badge>
          )}
        </HStack>
        <HStack gap="3" fontSize="sm" color="fg.muted">
          {variation.unit && <Text>/ {variation.unit}</Text>}
          {variation.packaging?.quantity ? (
            <HStack gap="1">
              <Package size={14} />
              <Text>{t('products.count_products', { count: variation.packaging.quantity })}</Text>
            </HStack>
          ) : null}
        </HStack>
      </Stack>

      {product.variations.length > 1 && (
        <Stack gap="2">
          <Text fontSize="sm" fontWeight="600">
            {t('product_detail.variant')}: {product.variations.findIndex((v) => v.guid === variation.guid) + 1} / {product.variations.length}
          </Text>
          {/* Variants share one name and no per-variant attributes, so photo + price is what tells them apart */}
          <Flex gap="2" wrap="wrap">
            {product.variations.map((v, i) => {
              const on = v.guid === variation.guid
              return (
                <Stack
                  key={v.guid}
                  as="button"
                  aria-label={`${t('product_detail.variant')} ${i + 1}`}
                  aria-pressed={on}
                  gap="1"
                  w="76px"
                  p="1"
                  borderRadius="control"
                  borderWidth="2px"
                  borderColor={on ? 'navy.900' : 'border.subtle'}
                  bg="bg.surface"
                  opacity={v.in_stock > 0 ? 1 : 0.45}
                  _hover={{ borderColor: on ? 'navy.900' : 'kgray.300' }}
                  onClick={() => onVariation(v.guid)}
                >
                  <Box h="60px" bg="kgray.50" borderRadius="8px" overflow="hidden">
                    <Image src={v.image[0]} alt="" w="full" h="full" fit="contain" p="1" mixBlendMode="multiply" />
                  </Box>
                  <Text fontSize="2xs" fontWeight="600" color={v.discount_percent ? 'fg.discount' : 'fg.default'} truncate>
                    {formatPrice(unitPrice(v), lang)}
                  </Text>
                </Stack>
              )
            })}
          </Flex>
        </Stack>
      )}

      <Box hideBelow="md">
        <CartActions variation={variation} name={name} />
      </Box>

      {contacts.telegram && (
        <Link href={contacts.telegram} target="_blank" rel="noreferrer" fontSize="sm" color="fg.link" gap="2" w="fit-content">
          <MessageCircle size={16} />
          {t('product_detail.ask_question')}
        </Link>
      )}

      <DeliveryPayment product={product} />
    </Stack>
  )
})
