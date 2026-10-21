import { Box, Button, Flex, Heading, NativeSelect, Stack, Text } from '@chakra-ui/react'
import { SearchX, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { paths } from '@/app/router/paths'
import { usePopularSearches, useSearchResults } from '@/features/search/queries'
import type { SearchSort } from '@/mocks/search'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { Pagination } from '@/shared/ui/Pagination'
import { searchHistory } from '@/stores/search-history.store'
import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid/ProductGrid'

const SORTS: SearchSort[] = ['popular', 'price_asc', 'price_desc']

/** /search/:query — results with category chips (from the results), sort and pages, all kept in the URL. */
export default function SearchPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const navigate = useNavigate()
  const { query: raw = '' } = useParams()
  const query = decodeURIComponent(raw)
  const [params, setParams] = useSearchParams()
  const sort = (SORTS.includes(params.get('sort') as SearchSort) ? params.get('sort') : 'popular') as SearchSort
  const categoryId = params.get('cat')
  const page = Math.max(1, Number(params.get('page')) || 1)
  const popular = usePopularSearches()

  const { data, isPending, isPlaceholderData } = useSearchResults({ q: query, sort, categoryId, page })

  const update = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params)
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)))
    if (!('page' in next)) p.delete('page')
    setParams(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const chip = (active: boolean) => ({
    size: 'sm' as const,
    borderRadius: 'full',
    flexShrink: 0,
    variant: active ? ('solid' as const) : ('outline' as const),
    colorPalette: active ? 'brand' : undefined,
    bg: active ? undefined : 'bg.surface',
    borderColor: 'border.default',
    fontWeight: '500',
  })

  return (
    <Stack gap={{ base: 4, md: 6 }}>
      <Box>
        <Text fontSize="sm" color="fg.muted">
          {t('products.search_results')}
        </Text>
        <Flex align="baseline" gap="3" wrap="wrap">
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700" color="fg.default" wordBreak="break-word">
            «{query}»
          </Heading>
          {data && (
            <Text color="fg.muted" fontSize={{ base: 'sm', md: 'md' }}>
              {data.total} {t('favourites.products')}
            </Text>
          )}
        </Flex>
      </Box>

      {data && data.total > 0 && (
        <Flex gap="3" align="center" justify="space-between" direction={{ base: 'column-reverse', md: 'row' }} alignItems={{ base: 'stretch', md: 'center' }}>
          <Flex gap="2" overflowX="auto" minW="0" flex="1" mx={{ base: -4, md: 0 }} px={{ base: 4, md: 0 }} css={{ scrollbarWidth: 'none' }}>
            <Button {...chip(!categoryId)} onClick={() => update({ cat: null })}>
              {t('filter.categories.all')}
              <Text as="span" opacity="0.6">
                {data.total}
              </Text>
            </Button>
            {data.facets.map(({ category, count }) => (
              <Button key={category.guid} {...chip(categoryId === category.guid)} onClick={() => update({ cat: category.guid })}>
                {localized(category, 'name', lang)}
                <Text as="span" opacity="0.6">
                  {count}
                </Text>
              </Button>
            ))}
          </Flex>
          <NativeSelect.Root size="sm" w={{ base: 'full', md: '220px' }} flexShrink="0">
            <NativeSelect.Field
              aria-label={t('filter.sort.short')}
              value={sort}
              onChange={(e) => update({ sort: e.target.value === 'popular' ? null : e.target.value })}
              bg="bg.surface"
              borderRadius="primary"
            >
              <option value="popular">{t('filter.sort.popular')}</option>
              <option value="price_asc">{t('filter.sort.price_asc')}</option>
              <option value="price_desc">{t('filter.sort.price_desc')}</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Flex>
      )}

      {isPending ? (
        <ProductGridSkeleton />
      ) : data && data.count > 0 ? (
        <>
          <ProductGrid products={data.items} loading={isPlaceholderData} />
          <Pagination page={page} totalPages={data.totalPages} onChange={(p) => update({ page: p > 1 ? String(p) : null })} />
        </>
      ) : (
        <Flex direction="column" align="center" textAlign="center" gap="3" py={{ base: 10, md: 16 }} bg="bg.surface" borderRadius="card">
          <Flex boxSize="64px" align="center" justify="center" borderRadius="full" bg="bg.muted" color="fg.muted">
            <SearchX size={30} />
          </Flex>
          <Text fontWeight="700" fontSize="lg" color="fg.default">
            {t('products.not_found')}
          </Text>
          <Text color="fg.muted" fontSize="sm" mb="2">
            {t('nav.popular')}
          </Text>
          <Flex wrap="wrap" justify="center" gap="2" maxW="560px" px="4">
            {popular.map((p) => (
              <Button
                key={p.name_ru}
                size="sm"
                variant="outline"
                borderRadius="full"
                gap="1.5"
                fontWeight="500"
                onClick={() => {
                  searchHistory.add(p.name_ru)
                  navigate(paths.search(encodeURIComponent(p.name_ru.trim())))
                }}
              >
                <TrendingUp size={14} />
                {p.name_ru}
              </Button>
            ))}
          </Flex>
        </Flex>
      )}
    </Stack>
  )
}
