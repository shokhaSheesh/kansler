import { Box } from '@chakra-ui/react'
import { AddToCartControl } from '@/features/add-to-cart/AddToCartControl'
import { ProductCard } from '@/entities/product/ui/ProductCard'
import type { Product } from '@/entities/product/types'
import { ScrollRow } from '@/shared/ui/ScrollRow'
import { SectionHeader } from '@/shared/ui/SectionHeader'

interface ProductShelfProps {
  title: string
  to?: string
  products: Product[]
}

export const ProductShelf = ({ title, to, products }: ProductShelfProps) => {
  if (!products.length) return null
  return (
    <Box as="section">
      <SectionHeader title={title} to={to} />
      <ScrollRow>
        {products.map((p) => (
          <ProductCard key={p.guid} product={p} action={(v, name) => <AddToCartControl variation={v} name={name} />} />
        ))}
      </ScrollRow>
    </Box>
  )
}
