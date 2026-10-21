import { Box, Button, Flex, Grid, Heading, IconButton, NativeSelect, Stack, Text } from '@chakra-ui/react'
import { LayoutGrid, List, SearchX } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useParams } from 'react-router'
import { paths } from '@/app/router/paths'
import { ActiveFilters } from '@/features/product-filters/ActiveFilters'
import { FilterPanel } from '@/features/product-filters/FilterPanel'
import { MobileFilters } from '@/features/product-filters/MobileFilters'
import { activeFilterCount, useListParams } from '@/features/product-filters/params'
import { useProductList } from '@/features/product-filters/queries'
import { byId } from '@/mocks/catalog'
import { topCategories, type ProductSort } from '@/mocks/products'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { Pagination } from '@/shared/ui/Pagination'
import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid/ProductGrid'
import { ProductListItem } from '@/widgets/product-grid/ProductListItem'

type View = 'grid' | 'list'
const VIEW_KEY = 'plp_view'
const readView = (): View => {
  try {
    return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid'
  } catch {
    return 'grid'
  }
}

/**
 * /categories/:id and /products — the product list.
 * Ref: Klarna (sidebar + chips), Faire (B2B grid), adidas (mobile filter sheet).
 */
export default function ProductsPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const { id } = useParams()
  const hit = id ? byId.get(id) : undefined
  const category = hit?.category
  const path = hit?.path ?? []
  const isAll = !id

  const { filters, sort, page, setFilters, setSort, setPage, reset } = useListParams()
  const [view, setViewState] = useState<View>(readView)
  const setView = (v: View) => {
    setViewState(v)
    try {
      localStorage.setItem(VIEW_KEY, v)
    } catch {
      /* per-device preference only */
    }
  }

  const { data, isPending, isPlaceholderData } = useProductList({
    categoryId: id ?? null,
    ...filters,
    categoryIds: isAll ? filters.categoryIds : [],
    sort,
    page,
    limit: 24,
  })

  // Sub-category navigation: children, or siblings when we're at the deepest level
  const parent = path.length > 1 ? path[path.length - 2] : null
  const navChips = isAll
    ? []
    : category && category.categories_data.length
      ? category.categories_data
      : (parent?.categories_data ?? [])
  const navSorted = [...navChips].sort((a, b) => a.display_order - b.display_order)

  const title = category ? localized(category, 'name', lang) : t('products.title')
  const crumbs = [
    { label: t('favourites.breadcrumb.home'), to: paths.home },
    ...(isAll ? [] : path.slice(0, -1).map((c) => ({ label: localized(c, 'name', lang), to: paths.category(c.guid) }))),
    { label: title },
  ]

  if (id && !category) {
    return (
      <Stack align="center" py="16" gap="3">
        <SearchX size={32} />
        <Text fontWeight="600">{t('products.not_found')}</Text>
        <Button asChild variant="outline" borderRadius="primary">
          <RouterLink to={paths.catalog}>{t('categories.title')}</RouterLink>
        </Button>
      </Stack>
    )
  }

  const filterProps = { value: filters, data, categories: isAll ? topCategories : undefined }
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
    <Stack gap={{ base: 4, md: 5 }}>
      <Stack gap="2">
        <Breadcrumbs items={crumbs} />
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

      {navSorted.length > 0 && (
        <Flex gap="2" overflowX="auto" mx={{ base: -4, md: 0 }} px={{ base: 4, md: 0 }} wrap={{ base: 'nowrap', md: 'wrap' }} css={{ scrollbarWidth: 'none' }}>
          {navSorted.map((c) => (
            <Button key={c.guid} asChild {...chip(c.guid === id)}>
              <RouterLink to={paths.category(c.guid)}>{localized(c, 'name', lang)}</RouterLink>
            </Button>
          ))}
        </Flex>
      )}

      <Grid templateColumns={{ base: 'minmax(0, 1fr)', lg: '264px minmax(0, 1fr)' }} gap="6" alignItems="start">
        <Box
          as="aside"
          hideBelow="lg"
          pos="sticky"
          top="128px"
          maxH="calc(100dvh - 144px)"
          overflowY="auto"
          bg="bg.surface"
          borderRadius="card"
          borderWidth="1px"
          borderColor="border.subtle"
          px="4"
          css={{ scrollbarWidth: 'thin' }}
        >
          <FilterPanel {...filterProps} onChange={setFilters} />
        </Box>

        <Stack gap="4" minW="0">
          <Flex
            gap="2"
            align="center"
            pos={{ base: 'sticky', lg: 'static' }}
            top="60px"
            zIndex="docked"
            bg="bg.app"
            py={{ base: 2, lg: 0 }}
            mx={{ base: -4, lg: 0 }}
            px={{ base: 4, lg: 0 }}
          >
            <Box hideFrom="lg">
              <MobileFilters value={filters} onApply={setFilters} data={data} categories={filterProps.categories} />
            </Box>
            <Box flex="1" />
            <NativeSelect.Root size="sm" w={{ base: '170px', md: '210px' }}>
              <NativeSelect.Field
                aria-label={t('filter.sort.short')}
                value={sort}
                onChange={(e) => setSort(e.target.value as ProductSort)}
                bg="bg.surface"
                borderRadius="primary"
                h="40px"
              >
                <option value="popular">{t('filter.sort.popular')}</option>
                <option value="price_asc">{t('filter.sort.price_asc')}</option>
                <option value="price_desc">{t('filter.sort.price_desc')}</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Flex bg="bg.surface" borderRadius="primary" borderWidth="1px" borderColor="border.default" p="0.5" flexShrink="0">
              {(['grid', 'list'] as const).map((v) => (
                <IconButton
                  key={v}
                  aria-label={t(`categories.view.${v}`)}
                  title={t(`categories.view.${v}`)}
                  size="sm"
                  h="34px"
                  borderRadius="8px"
                  variant={view === v ? 'solid' : 'ghost'}
                  colorPalette={view === v ? 'brand' : undefined}
                  onClick={() => setView(v)}
                >
                  {v === 'grid' ? <LayoutGrid size={16} /> : <List size={16} />}
                </IconButton>
              ))}
            </Flex>
          </Flex>

          <ActiveFilters value={filters} onChange={setFilters} />

          {isPending ? (
            <ProductGridSkeleton density="narrow" count={12} />
          ) : data && data.count > 0 ? (
            <>
              {view === 'grid' ? (
                <ProductGrid products={data.items} loading={isPlaceholderData} density="narrow" />
              ) : (
                <Stack gap="2" opacity={isPlaceholderData ? 0.6 : 1}>
                  {data.items.map((p) => (
                    <ProductListItem key={p.guid} product={p} />
                  ))}
                </Stack>
              )}
              <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
            </>
          ) : (
            <Flex direction="column" align="center" textAlign="center" gap="3" py="16" bg="bg.surface" borderRadius="card">
              <Flex boxSize="64px" align="center" justify="center" borderRadius="full" bg="bg.muted" color="fg.muted">
                <SearchX size={30} />
              </Flex>
              <Text fontWeight="700" fontSize="lg" color="fg.default">
                {t('products.not_found')}
              </Text>
              {activeFilterCount(filters) > 0 && (
                <Button colorPalette="brand" borderRadius="primary" onClick={reset}>
                  {t('filter.clear_all')}
                </Button>
              )}
            </Flex>
          )}
        </Stack>
      </Grid>
    </Stack>
  )
}
