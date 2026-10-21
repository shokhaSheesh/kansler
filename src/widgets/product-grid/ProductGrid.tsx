import { Box, Grid, Skeleton, Stack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { AddToCartControl } from '@/features/add-to-cart/AddToCartControl'
import { ProductCard } from '@/entities/product/ui/ProductCard'
import type { Product } from '@/entities/product/types'

const COLS = {
  wide: { base: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))', xl: 'repeat(5, minmax(0, 1fr))' },
  /** Next to a filter sidebar */
  narrow: { base: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' },
}
type Density = keyof typeof COLS

/** Product grid used by search results, product list and favourites. */
export const ProductGrid = ({
  products,
  loading,
  density = 'wide',
  renderItem,
}: {
  products: Product[]
  loading?: boolean
  density?: Density
  renderItem?: (card: ReactNode, productId: string) => ReactNode
}) => (
  <Grid templateColumns={COLS[density]} columnGap={{ base: 3, md: 5 }} rowGap={{ base: 6, md: 8 }} opacity={loading ? 0.6 : 1} transition="opacity .15s">
    {products.map((p) => {
      const card = <ProductCard product={p} action={() => <AddToCartControl product={p} />} />
      return <Box key={p.guid}>{renderItem ? renderItem(card, p.guid) : card}</Box>
    })}
  </Grid>
)

export const ProductGridSkeleton = ({ count = 10, density = 'wide' }: { count?: number; density?: Density }) => (
  <Grid templateColumns={COLS[density]} columnGap={{ base: 3, md: 5 }} rowGap={{ base: 6, md: 8 }}>
    {Array.from({ length: count }, (_, i) => (
      <Stack key={i} gap="3">
        <Skeleton aspectRatio="1" borderRadius="card" />
        <Box px="0.5" pb="2">
          <Skeleton h="16px" w="50%" mb="2" />
          <Skeleton h="12px" w="90%" mb="1.5" />
          <Skeleton h="12px" w="60%" />
        </Box>
      </Stack>
    ))}
  </Grid>
)
