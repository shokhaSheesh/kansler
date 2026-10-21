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
  /** Shelf sits on a tinted band (photo tiles turn white) to break up the white page. */
  tinted?: boolean
}

// Inside a band the grey photo tiles would blend in, so they switch to white
const band = {
  bg: 'bg.tint',
  borderRadius: { base: 0, md: 'modal' },
  mx: { base: -4, md: 0 },
  px: { base: 4, md: 6 },
  py: { base: 5, md: 6 },
  css: { '--chakra-colors-bg-tile': 'white' },
} as const

export const ProductShelf = ({ title, to, products, tinted }: ProductShelfProps) => {
  if (!products.length) return null
  return (
    <Box as="section" {...(tinted ? band : {})}>
      <SectionHeader title={title} to={to} />
      <ScrollRow>
        {products.map((p) => (
          <ProductCard key={p.guid} product={p} action={() => <AddToCartControl product={p} />} />
        ))}
      </ScrollRow>
    </Box>
  )
}
