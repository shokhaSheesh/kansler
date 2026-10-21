import { Badge, Box, Button, Flex, Grid, HStack, IconButton, Image, Link, Stack, Text } from '@chakra-ui/react'
import { Check, ChevronRight, MessageCircle, Package, Share2, ShoppingCart, Tag, Truck } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { unitPrice, useCartLine } from '@/features/add-to-cart/useCartLine'
import type { ProductDetails, VariationDetails } from '@/entities/product/types'
import { FavouriteButton } from '@/entities/product/ui/FavouriteButton'
import { useLang } from '@/shared/hooks/useLang'
import { formatPrice, localized } from '@/shared/lib/format'
import { InfoRow } from '@/shared/ui/InfoRow'
import { Price } from '@/shared/ui/Price'
import { QuantityStepper } from '@/shared/ui/QuantityStepper'
import { toaster } from '@/shared/ui/toaster'
import { panel } from '@/shared/ui/surface'

const ASK_URL = 'https://t.me/Kansler_CustomerCare_bot'

const card = { ...panel, p: '4' } as const

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
      <Button h={h} w="full" disabled variant="subtle" borderRadius="control">
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
  const brand = product.brand ? localized(product.brand, 'value', lang) : ''

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
        {(product.sold_count ?? 0) > 0 && (
          <Text color="fg.muted" fontSize="sm">
            {product.sold_count} {t('product_detail.bought_count')}
          </Text>
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
                  <Box h="60px" bg="bg.tile" borderRadius="8px" overflow="hidden">
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

      {/* Live: links to Telegram support bot */}
      <Link href={ASK_URL} target="_blank" rel="noreferrer" fontSize="sm" color="fg.link" gap="2" w="fit-content">
        <MessageCircle size={16} />
        {t('product_detail.ask_question')}
      </Link>

      {/* Live: "Часто задаваемые вопросы" with two links to the help centre; both open "Условия доставки, оплаты и возврата" */}
      <Stack {...card} gap="1">
        <Text fontWeight="600" fontSize="sm" mb="1">
          {t('product_detail.faq_title')}
        </Text>
        {(['delivery_terms', 'payment_terms'] as const).map((k) => (
          <Link key={k} asChild fontSize="sm" color="fg.body" justifyContent="space-between" py="1.5" _hover={{ color: 'fg.default' }}>
            <RouterLink to={`${paths.profile.info}?infoIndex=3`} target="_blank">
              {t(`product_detail.${k}`)}
              <ChevronRight size={16} />
            </RouterLink>
          </Link>
        ))}
      </Stack>

      {/* Live "Доставка" card: courier, free. (The live page also shows the buyer's selected address when logged in.) */}
      <Stack {...card} gap="3">
        <Text fontWeight="600" fontSize="sm">
          {t('product_detail.delivery')}
        </Text>
        <InfoRow
          icon={<Truck size={18} />}
          title={
            <Flex justify="space-between" gap="2">
              <span>{t('product_detail.courier')}</span>
              <span>{t('product_detail.free')}</span>
            </Flex>
          }
        />
      </Stack>

      {brand && (
        <Stack {...card} gap="3">
          <Text fontWeight="600" fontSize="sm">
            {t('product_detail.brand')}
          </Text>
          <InfoRow icon={<Tag size={18} />} title={brand} />
        </Stack>
      )}
    </Stack>
  )
})
