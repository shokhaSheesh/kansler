import { Box } from '@chakra-ui/react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { AddToCartControl } from '@/features/add-to-cart/AddToCartControl'
import { ProductCard } from '@/entities/product/ui/ProductCard'
import type { Product } from '@/entities/product/types'
import { SectionHeader } from '@/shared/ui/SectionHeader'

interface ProductShelfProps {
  title: string
  to?: string
  products: Product[]
}

/** Scrolls like a native list: trackpad two-finger swipe, drag, touch. No arrow buttons. */
export const ProductShelf = ({ title, to, products }: ProductShelfProps) => {
  if (!products.length) return null

  return (
    <Box as="section">
      <SectionHeader title={title} to={to} />
      {/* py/my give hover shadows room inside the clipped area */}
      <Box mx={{ base: -4, md: 0 }} px={{ base: 4, md: 0 }} py="3" my="-3" overflow="hidden">
        <Swiper
          modules={[FreeMode, Mousewheel]}
          freeMode={{ enabled: true, momentumRatio: 0.6 }}
          mousewheel={{ forceToAxis: true }}
          grabCursor
          slidesPerView={2.15}
          spaceBetween={8}
          style={{ overflow: 'visible' }}
          breakpoints={{
            640: { slidesPerView: 3.2, spaceBetween: 12 },
            1024: { slidesPerView: 4.3, spaceBetween: 16 },
            1280: { slidesPerView: 5.3, spaceBetween: 16 },
          }}
        >
          {products.map((p) => (
            <SwiperSlide key={p.guid} style={{ height: 'auto' }}>
              <ProductCard product={p} action={(v, name) => <AddToCartControl variation={v} name={name} />} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  )
}
