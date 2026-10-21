import { Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { paths } from '@/app/router/paths'
import { FILTER_TYPES, topCategories, type FilterType } from '@/mocks/products'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ProductListView } from '@/widgets/product-list/ProductListView'

/** /search/:query — like live: title, count, the same filter sidebar (Категории · Цена · Цвет), price toggle, products. */
export default function SearchPage() {
  const { t } = useTranslation()
  const { query: raw = '' } = useParams()
  const query = decodeURIComponent(raw)
  // Live: /search/discounted, /new, /recommended, /all are product lists (Акции, "Все" on the home shelves)
  const type = FILTER_TYPES.includes(query as FilterType) ? (query as FilterType) : null
  const all = query === 'all'
  const title = type ? t(`favourites.${type}`) : all ? t('favourites.all') : `«${query}»`

  return (
    <ProductListView
      key={query}
      base={type || all ? { filterType: type } : { q: query }}
      categories={{ kind: 'filter', options: topCategories }}
      header={(data) => (
        <Stack gap="2">
          <Breadcrumbs items={[{ label: t('favourites.breadcrumb.home'), to: paths.home }, { label: t('search.title') }]} back={paths.home} />
          <Flex align="baseline" gap="3" wrap="wrap">
            <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700" color="fg.default" wordBreak="break-word">
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
      empty={<EmptyState title={t('products.not_found')} />}
    />
  )
}
