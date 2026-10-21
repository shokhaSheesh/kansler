import { Box, Grid, Skeleton, Stack } from '@chakra-ui/react'
import { AddToCartControl } from '@/features/add-to-cart/AddToCartControl'
import { ProductCard } from '@/entities/product/ui/ProductCard'
import type { Product } from '@/entities/product/types'

const columns = { base: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))', xl: 'repeat(5, minmax(0, 1fr))' }

/** Product grid used by search results, product list and favourites. */
export const ProductGrid = ({ products, loading }: { products: Product[]; loading?: boolean }) => (
  <Grid templateColumns={columns} gap={{ base: 2, md: 4 }} opacity={loading ? 0.6 : 1} transition="opacity .15s">
    {products.map((p) => (
      <ProductCard key={p.guid} product={p} action={(v, name) => <AddToCartControl variation={v} name={name} />} />
    ))}
  </Grid>
)

export const ProductGridSkeleton = ({ count = 10 }: { count?: number }) => (
  <Grid templateColumns={columns} gap={{ base: 2, md: 4 }}>
    {Array.from({ length: count }, (_, i) => (
      <Stack key={i} bg="bg.surface" borderRadius="card" p="2" gap="3">
        <Skeleton aspectRatio="1" borderRadius="control" />
        <Box px="1.5" pb="2">
          <Skeleton h="16px" w="50%" mb="2" />
          <Skeleton h="12px" w="90%" mb="1.5" />
          <Skeleton h="12px" w="60%" />
        </Box>
      </Stack>
    ))}
  </Grid>
)
