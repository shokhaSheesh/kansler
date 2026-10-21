import { Box, Flex, Grid, Stack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { ActiveFilters } from '@/features/product-filters/ActiveFilters'
import { CheapFirstToggle } from '@/features/product-filters/CheapFirstToggle'
import { FilterPanel, type CategoryMode } from '@/features/product-filters/FilterPanel'
import { MobileFilters } from '@/features/product-filters/MobileFilters'
import { useListParams } from '@/features/product-filters/params'
import { useProductList } from '@/features/product-filters/queries'
import type { ProductListParams, ProductListResult } from '@/mocks/products'
import { Pagination } from '@/shared/ui/Pagination'
import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid/ProductGrid'
import { tintedPanel } from '@/shared/ui/surface'

interface ProductListViewProps {
  /** Title block (breadcrumbs, heading, count). Receives the result for the count. */
  header: (data: ProductListResult | undefined) => ReactNode
  /** Optional row under the title (category page: sub-category chips). */
  subheader?: ReactNode
  categories: CategoryMode
  /** What to list: a category, a search text, or given products (favourites). */
  base: Pick<ProductListParams, 'categoryId' | 'q' | 'source'>
  empty: ReactNode
  /** Wrap each card (favourites: fade removed items). */
  renderItem?: (card: ReactNode, productId: string) => ReactNode
}

/**
 * Shared list layout for category pages, search results and favourites, the same three places the
 * live site shows the filter sidebar. Desktop: sticky sidebar. Phone: sticky "Фильтры" + price toggle bar.
 */
export const ProductListView = ({ header, subheader, categories, base, empty, renderItem }: ProductListViewProps) => {
  const { filters, cheapFirst, page, setFilters, setCheapFirst, setPage } = useListParams()
  const { data, isPending, isPlaceholderData } = useProductList({
    ...base,
    filterCategoryId: categories.kind === 'filter' ? filters.categoryId : null,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    colors: filters.colors,
    cheapFirst,
    page,
  })
  const panel = { value: filters, onChange: setFilters, data, categories }

  return (
    <Stack gap={{ base: 4, md: 5 }}>
      {header(data)}
      {subheader}

      <Grid templateColumns={{ base: 'minmax(0, 1fr)', lg: '264px minmax(0, 1fr)' }} gap="6" alignItems="start">
        <Box
          as="aside"
          hideBelow="lg"
          pos="sticky"
          top="128px"
          maxH="calc(100dvh - 144px)"
          overflowY="auto"
          {...tintedPanel}
          px="4"
          css={{ scrollbarWidth: 'thin' }}
        >
          <FilterPanel {...panel} />
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
              <MobileFilters {...panel} />
            </Box>
            <Box flex="1">
              <ActiveFilters value={filters} onChange={setFilters} />
            </Box>
            <CheapFirstToggle value={cheapFirst} onChange={setCheapFirst} />
          </Flex>

          {isPending ? (
            <ProductGridSkeleton density="narrow" count={12} />
          ) : data && data.count > 0 ? (
            <>
              <ProductGrid products={data.items} loading={isPlaceholderData} density="narrow" renderItem={renderItem} />
              <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
            </>
          ) : (
            empty
          )}
        </Stack>
      </Grid>
    </Stack>
  )
}
