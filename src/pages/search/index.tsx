import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { paths } from '@/app/router/paths'
import { topCategories } from '@/mocks/products'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { ProductListView } from '@/widgets/product-list/ProductListView'

/** /search/:query — like live: title, count, the same filter sidebar (Категории · Цена · Цвет), price toggle, products. */
export default function SearchPage() {
  const { t } = useTranslation()
  const { query: raw = '' } = useParams()
  const query = decodeURIComponent(raw)

  return (
    <ProductListView
      key={query}
      base={{ q: query }}
      categories={{ kind: 'filter', options: topCategories }}
      header={(data) => (
        <Stack gap="2">
          <Breadcrumbs items={[{ label: t('favourites.breadcrumb.home'), to: paths.home }, { label: t('search.title') }]} />
          <Flex align="baseline" gap="3" wrap="wrap">
            <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700" color="fg.default" wordBreak="break-word">
              «{query}»
            </Heading>
            {data && (
              <Text color="fg.muted" fontSize={{ base: 'sm', md: 'md' }}>
                {data.count} {t('favourites.products')}
              </Text>
            )}
          </Flex>
        </Stack>
      )}
      empty={
        <Flex direction="column" align="center" textAlign="center" gap="3" py="16" bg="bg.surface" borderRadius="card">
          <Box boxSize="64px" display="flex" alignItems="center" justifyContent="center" borderRadius="full" bg="bg.muted" color="fg.muted">
            <SearchX size={30} />
          </Box>
          <Text fontWeight="700" fontSize="lg" color="fg.default">
            {t('products.not_found')}
          </Text>
        </Flex>
      }
    />
  )
}
