import { Button, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useParams } from 'react-router'
import { paths } from '@/app/router/paths'
import { byId, bySlug } from '@/mocks/catalog'
import { topCategories } from '@/mocks/products'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ProductListView } from '@/widgets/product-list/ProductListView'

/**
 * /categories/:slug and /products — same content as live: breadcrumbs, title + count, sub-category chips,
 * sidebar (Категории · Фильтры: Цена, Цвет), price toggle, products, pages.
 */
export default function ProductsPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const { id } = useParams()
  // Live URLs use the slug; accept a guid too
  const hit = id ? (bySlug.get(id) ?? byId.get(id)) : undefined
  const category = hit?.category
  const path = hit?.path ?? []

  if (id && !category) {
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

  const parent = path.length > 1 ? path[path.length - 2] : null
  // Live shows the sub-categories as chips under the title; at the deepest level we show the siblings
  const navChips = category ? (category.categories_data.length ? category.categories_data : (parent?.categories_data ?? [])) : []
  const title = category ? localized(category, 'name', lang) : t('categories.all')

  return (
    <ProductListView
      key={category?.guid ?? 'all'}
      base={{ categoryId: category?.guid ?? null }}
      categories={category ? { kind: 'navigate', current: category, parent } : { kind: 'filter', options: topCategories }}
      header={(data) => (
        <Stack gap="2">
          <Breadcrumbs
            items={[
              { label: t('favourites.breadcrumb.home'), to: paths.home },
              ...path.slice(0, -1).map((c) => ({ label: localized(c, 'name', lang), to: paths.category(c.slug) })),
              { label: title },
            ]}
            back={path.length > 1 ? paths.category(path[path.length - 2].slug) : paths.catalog}
          />
          <Flex align="baseline" gap="3" wrap="wrap">
            <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700" color="fg.default">
              {title}
            </Heading>
            {data && (
              <Text color="fg.muted" fontSize={{ base: 'sm', md: 'md' }}>
                {data.count} {t('favourites.products')}
              </Text>
            )}
          </Flex>
        </Stack>
      )}
      subheader={
        navChips.length > 0 && (
          <Flex gap="2" overflowX="auto" mx={{ base: -4, md: 0 }} px={{ base: 4, md: 0 }} wrap={{ base: 'nowrap', md: 'wrap' }} css={{ scrollbarWidth: 'none' }}>
            {[...navChips]
              .sort((a, b) => a.display_order - b.display_order)
              .map((c) => {
                const on = c.guid === category?.guid
                return (
                  <Button
                    key={c.guid}
                    asChild
                    size="sm"
                    borderRadius="full"
                    flexShrink="0"
                    variant={on ? 'solid' : 'outline'}
                    colorPalette={on ? 'brand' : undefined}
                    bg={on ? undefined : 'bg.surface'}
                    borderColor="border.default"
                    fontWeight="500"
                  >
                    <RouterLink to={paths.category(c.slug)}>{localized(c, 'name', lang)}</RouterLink>
                  </Button>
                )
              })}
          </Flex>
        )
      }
      empty={<EmptyState title={t('products.not_found')} />}
    />
  )
}
