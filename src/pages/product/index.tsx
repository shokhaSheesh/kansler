import { Badge, Box, Button, Flex, Grid, Skeleton, Stack } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useParams, useSearchParams } from 'react-router'
import { paths } from '@/app/router/paths'
import { unitPrice } from '@/features/add-to-cart/useCartLine'
import { categoryPath } from '@/mocks/catalog'
import { shelves } from '@/mocks'
import { mockProductDetails } from '@/mocks/product-details'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Price } from '@/shared/ui/Price'
import { ProductShelf } from '@/widgets/home/ProductShelf'
import { BuyBox, CartActions } from '@/widgets/product-detail/BuyBox'
import { ProductInfo } from '@/widgets/product-detail/ProductInfo'
import { ProductPhotos } from '@/widgets/product-detail/ProductPhotos'

/**
 * /products/:id — same content as the live product page, re-laid out: photos left, sticky buy box right,
 * details below, "Рекомендуем".
 * Phone: photos → buy box → details, plus a sticky price + "add" bar above the tab bar.
 * Selected variant is kept in ?v= so a link opens the exact variant.
 * Ref: Faire / Instacart product pages.
 */
const ProductPage = observer(() => {
  const { t } = useTranslation()
  const lang = useLang()
  const { id = '' } = useParams()
  const [sp, setSp] = useSearchParams()

  // Design phase: mock. Wiring: useProduct(id) -> productApi.single({ id })
  const { data: product, isPending } = useQuery({ queryKey: ['PRODUCT_DETAILS', id], queryFn: () => mockProductDetails(id) })

  if (isPending) {
    return (
      <Grid templateColumns={{ base: '1fr', md: 'minmax(0, 1fr) 400px' }} gap="8">
        <Skeleton aspectRatio="1" borderRadius="modal" />
        <Stack gap="4">
          <Skeleton h="28px" w="80%" />
          <Skeleton h="20px" w="40%" />
          <Skeleton h="40px" w="50%" />
          <Skeleton h="52px" />
          <Skeleton h="200px" borderRadius="card" />
        </Stack>
      </Grid>
    )
  }

  if (!product) {
    return (
      <EmptyState
        title={t('products.not_found')}
        action={
          <Button asChild variant="outline" borderRadius="primary">
            <RouterLink to={paths.catalog}>{t('categories.title')}</RouterLink>
          </Button>
        }
      />
    )
  }

  const variation = product.variations.find((v) => v.guid === sp.get('v')) ?? product.variations[0]
  const name = localized(variation, 'name', lang) || localized(product, 'name', lang)
  const discount = variation.discount_percent ?? 0
  const crumbs: Array<{ label: string; to?: string }> = [
    { label: t('favourites.breadcrumb.home'), to: paths.home },
    ...categoryPath(product.categories_id).map((c) => ({ label: localized(c, 'name', lang), to: paths.category(c.slug) })),
    { label: localized(product, 'name', lang) },
  ]

  const selectVariation = (guid: string) => {
    const p = new URLSearchParams(sp)
    if (guid === product.variations[0].guid) p.delete('v')
    else p.set('v', guid)
    setSp(p, { replace: true })
  }

  return (
    <Stack gap={{ base: 6, md: 10 }} pb={{ base: '76px', md: 0 }}>
      <Grid
        templateColumns={{ base: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) 380px', xl: 'minmax(0, 1fr) 420px' }}
        templateAreas={{ base: `"crumbs" "photos" "buy" "info"`, md: `"crumbs crumbs" "photos buy" "info buy"` }}
        columnGap={{ md: 8, xl: 12 }}
        rowGap={{ base: 5, md: 6 }}
        alignItems="start"
      >
        <Box gridArea="crumbs">
          <Breadcrumbs items={crumbs} back={crumbs.at(-2)?.to ?? paths.home} />
        </Box>

        <Box gridArea="photos" minW="0">
          <ProductPhotos
            key={variation.guid}
            images={variation.image}
            alt={name}
            overlay={
              discount > 0 && (
                <Badge pos="absolute" top="4" left="4" bg="primary.main" color="white" borderRadius="full" px="2.5" py="1" fontSize="sm" fontWeight="700">
                  −{discount}%
                </Badge>
              )
            }
          />
        </Box>

        <Box gridArea="buy" pos={{ md: 'sticky' }} top={{ md: '128px' }}>
          <BuyBox product={product} variation={variation} onVariation={selectVariation} />
        </Box>

        <Box gridArea="info" minW="0">
          <ProductInfo product={product} variation={variation} />
        </Box>
      </Grid>

      {/* Live: "Рекомендуем" (10 products) under the product. Wiring: useRecommendations */}
      <ProductShelf title={t('recommended_products')} to={paths.search('recommended')} products={shelves.recommended.filter((p) => p.guid !== product.guid).slice(0, 10)} />

      {/* Phone: price + add, always in reach (sits above the tab bar) */}
      <Flex
        hideFrom="md"
        pos="fixed"
        left="0"
        right="0"
        bottom="64px"
        zIndex="sticky"
        bg="bg.surface"
        borderTopWidth="1px"
        borderColor="border.subtle"
        px="4"
        py="2.5"
        gap="3"
        align="center"
        boxShadow="0 -4px 16px rgba(16, 24, 40, 0.06)"
      >
        <Box flexShrink="0">
          <Price value={unitPrice(variation)} oldValue={discount ? variation.price : null} size="sm" flexDirection="column" alignItems="flex-start" gap="0" />
        </Box>
        <Box flex="1" minW="0">
          <CartActions variation={variation} name={name} compact />
        </Box>
      </Flex>
    </Stack>
  )
})

export default ProductPage
