import { Badge, Box, Button, IconButton, Image, Stack, Text } from '@chakra-ui/react'
import { Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { Price } from '@/shared/ui/Price'
import { QuantityStepper } from '@/shared/ui/QuantityStepper'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  /** Design phase: cart / favourite are local state. Wiring swaps these for useAddToCart / useToggleFavourite. */
  onCartChange?: (variationId: string, quantity: number) => void
  onToggleFavourite?: (productId: string) => void
}

export const ProductCard = ({ product, onCartChange, onToggleFavourite }: ProductCardProps) => {
  const { t } = useTranslation()
  const lang = useLang()
  const variation = product.variations[0]
  const [qty, setQty] = useState(variation?.cart_quantity ?? 0)
  const [favourite, setFavourite] = useState(product.favorite)

  if (!variation) return null

  const inStock = variation.in_stock > 0
  const discount = variation.discount_percent ?? 0
  const finalPrice = discount > 0 && variation.discount_price ? variation.discount_price : variation.price
  const name = localized(variation, 'name', lang) || localized(product, 'name', lang)
  const href = paths.product(product.guid)

  const changeQty = (n: number) => {
    setQty(n)
    onCartChange?.(variation.guid, n)
  }

  return (
    <Box
      role="group"
      bg="bg.surface"
      borderRadius="card"
      borderWidth="1px"
      borderColor="border.subtle"
      p="2"
      h="full"
      display="flex"
      flexDirection="column"
      transition="box-shadow .2s, border-color .2s"
      _hover={{ boxShadow: '0 8px 24px rgba(16, 24, 40, 0.08)', borderColor: 'transparent' }}
    >
      <Box pos="relative" aspectRatio="1" bg="kgray.50" borderRadius="control" overflow="hidden">
        <RouterLink to={href} aria-label={name}>
          <Image
            src={variation.image[0]}
            alt={name}
            loading="lazy"
            w="full"
            h="full"
            fit="contain"
            p="3"
            mixBlendMode="multiply"
            opacity={inStock ? 1 : 0.5}
            transition="transform .3s"
            _groupHover={{ transform: 'scale(1.04)' }}
          />
        </RouterLink>

        {discount > 0 && (
          <Badge pos="absolute" top="2" left="2" bg="primary.main" color="white" borderRadius="full" px="2" fontWeight="700">
            −{discount}%
          </Badge>
        )}

        <IconButton
          aria-label={t('favourites.title')}
          pos="absolute"
          top="2"
          right="2"
          size="sm"
          borderRadius="full"
          bg="bg.surface"
          color={favourite ? 'primary.main' : 'fg.muted'}
          boxShadow="0 1px 3px rgba(16, 24, 40, 0.1)"
          _hover={{ bg: 'bg.surface', color: 'primary.main' }}
          onClick={() => {
            setFavourite((f) => !f)
            onToggleFavourite?.(product.guid)
          }}
        >
          <Heart size={16} fill={favourite ? 'currentColor' : 'none'} />
        </IconButton>
      </Box>

      <Stack gap="1.5" px="1.5" pt="3" pb="3" flex="1">
        <Price value={finalPrice} oldValue={discount > 0 ? variation.price : null} size="sm" />
        <RouterLink to={href}>
          <Text fontSize="sm" color="fg.body" lineClamp="2" lineHeight="1.4" minH="2.8em" _hover={{ color: 'fg.default' }}>
            {name}
          </Text>
        </RouterLink>
      </Stack>

      <Box px="0.5" pb="0.5">
        {!inStock ? (
          <Button w="full" h="36px" borderRadius="primary" disabled variant="subtle" fontSize="sm">
            {t('product_detail.out_of_stock')}
          </Button>
        ) : qty > 0 ? (
          <QuantityStepper value={qty} max={variation.in_stock} onChange={changeQty} size="sm" />
        ) : (
          <Button
            w="full"
            h="36px"
            px="2"
            gap="1.5"
            borderRadius="primary"
            colorPalette="brand"
            fontSize={{ base: 'xs', sm: 'sm' }}
            onClick={() => changeQty(1)}
          >
            <Box as="span" hideBelow="sm" display="inline-flex">
              <ShoppingCart size={15} />
            </Box>
            <Text truncate>{t('add_to_cart')}</Text>
          </Button>
        )}
      </Box>
    </Box>
  )
}
