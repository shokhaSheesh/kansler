import { Badge, Box, Stack, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { Price } from '@/shared/ui/Price'
import type { Product, Variation } from '../types'
import { FavouriteButton } from './FavouriteButton'
import { ProductGallery } from './ProductGallery'

interface ProductCardProps {
  product: Product
  /** Slot for the cart control (features/add-to-cart), rendered on the photo's bottom-right corner. */
  action?: (variation: Variation, name: string) => ReactNode
}

export const ProductCard = ({ product, action }: ProductCardProps) => {
  const { t } = useTranslation()
  const lang = useLang()
  const variation = product.variations[0]

  if (!variation) return null

  const inStock = variation.in_stock > 0
  const discount = variation.discount_percent ?? 0
  const finalPrice = discount > 0 && variation.discount_price ? variation.discount_price : variation.price
  const name = localized(variation, 'name', lang) || localized(product, 'name', lang)
  const href = paths.product(product.guid)

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
        <ProductGallery images={variation.image} alt={name} href={href} dimmed={!inStock} />

        {discount > 0 && (
          <Badge pos="absolute" top="2" left="2" bg="primary.main" color="white" borderRadius="full" px="2" fontWeight="700">
            −{discount}%
          </Badge>
        )}

        <FavouriteButton product={product} pos="absolute" top="2" right="2" />

        <Box pos="absolute" right="2" bottom="2">
          {inStock ? (
            action?.(variation, name)
          ) : (
            <Badge bg="bg.surface" color="fg.muted" borderRadius="full" px="2.5" py="1" fontWeight="600">
              {t('product_detail.out_of_stock')}
            </Badge>
          )}
        </Box>
      </Box>

      <Stack gap="1" px="1.5" pt="2.5" pb="1.5" flex="1">
        <Price value={finalPrice} oldValue={discount > 0 ? variation.price : null} size="sm" />
        <RouterLink to={href}>
          <Text fontSize="sm" color="fg.body" lineClamp="2" lineHeight="1.4" minH="2.8em" _hover={{ color: 'fg.default' }}>
            {name}
          </Text>
        </RouterLink>
      </Stack>
    </Box>
  )
}
