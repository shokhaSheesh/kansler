import { Badge, Box, Flex, IconButton, Image, Stack, Text } from '@chakra-ui/react'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { AddToCartControl } from '@/features/add-to-cart/AddToCartControl'
import type { Product } from '@/entities/product/types'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { Price } from '@/shared/ui/Price'

/** "Список" view: dense rows for buyers who scan names and prices (live: categories.view.list). */
export const ProductListItem = ({ product }: { product: Product }) => {
  const { t } = useTranslation()
  const lang = useLang()
  const v = product.variations[0]
  const [favourite, setFavourite] = useState(product.favorite)
  if (!v) return null
  const name = localized(v, 'name', lang) || localized(product, 'name', lang)
  const discount = v.discount_percent ?? 0
  const href = paths.product(product.guid)

  return (
    <Flex
      bg="bg.surface"
      borderRadius="card"
      borderWidth="1px"
      borderColor="border.subtle"
      p={{ base: 2, md: 3 }}
      gap={{ base: 3, md: 4 }}
      align="center"
      transition="box-shadow .2s"
      _hover={{ boxShadow: '0 6px 20px rgba(16, 24, 40, 0.06)' }}
    >
      <RouterLink to={href}>
        <Box pos="relative" boxSize={{ base: '88px', md: '112px' }} bg="kgray.50" borderRadius="control" overflow="hidden">
          <Image src={v.image[0]} alt={name} loading="lazy" w="full" h="full" fit="contain" p="2" mixBlendMode="multiply" />
          {discount > 0 && (
            <Badge pos="absolute" top="1.5" left="1.5" size="xs" bg="primary.main" color="white" borderRadius="full" fontWeight="700">
              −{discount}%
            </Badge>
          )}
        </Box>
      </RouterLink>

      <Stack flex="1" minW="0" gap="1.5">
        <RouterLink to={href}>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="fg.default" fontWeight="500" lineClamp="2" _hover={{ color: 'fg.link' }}>
            {name}
          </Text>
        </RouterLink>
        <Flex gap="3" align="center" wrap="wrap" color="fg.muted" fontSize="xs">
          {v.unit && <Text>1 {v.unit}</Text>}
          {v.color && <Text>{localized(v.color, 'name', lang)}</Text>}
          {product.variations.length > 1 && (
            <Text>
              {t('product_detail.variant')}: {product.variations.length}
            </Text>
          )}
        </Flex>
        <Price value={discount && v.discount_price ? v.discount_price : v.price} oldValue={discount ? v.price : null} size="sm" hideFrom="md" />
      </Stack>

      <Price
        value={discount && v.discount_price ? v.discount_price : v.price}
        oldValue={discount ? v.price : null}
        size="md"
        hideBelow="md"
        flexDirection="column"
        alignItems="flex-end"
        gap="0"
        minW="140px"
      />

      <Stack align="center" gap="2" flexShrink="0">
        {v.in_stock > 0 ? (
          <AddToCartControl variation={v} name={name} />
        ) : (
          <Text fontSize="xs" color="fg.subtle" maxW="80px" textAlign="center">
            {t('product_detail.out_of_stock')}
          </Text>
        )}
        <IconButton
          aria-label={t('favourites.title')}
          size="sm"
          variant="ghost"
          borderRadius="full"
          color={favourite ? 'primary.main' : 'fg.subtle'}
          onClick={() => setFavourite((f) => !f)}
          hideBelow="md"
        >
          <Heart size={16} fill={favourite ? 'currentColor' : 'none'} />
        </IconButton>
      </Stack>
    </Flex>
  )
}
