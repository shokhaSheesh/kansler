import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { ProductCard } from '@/entities/product/ui/ProductCard'
import type { Product } from '@/entities/product/types'
import { SectionHeader } from '@/shared/ui/SectionHeader'

interface ProductShelfProps {
  title: string
  to?: string
  products: Product[]
}

export const ProductShelf = ({ title, to, products }: ProductShelfProps) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  if (!products.length) return null

  return (
    <Box as="section">
      <SectionHeader title={title} to={to} onPrev={() => swiper?.slidePrev()} onNext={() => swiper?.slideNext()} />
      <Box mx={{ base: -4, md: 0 }} px={{ base: 4, md: 0 }} overflow="hidden">
        <Swiper
          onSwiper={setSwiper}
          slidesPerView={2.15}
          spaceBetween={8}
          style={{ overflow: 'visible' }}
          breakpoints={{
            640: { slidesPerView: 3.2, spaceBetween: 12 },
            1024: { slidesPerView: 4, spaceBetween: 16, slidesPerGroup: 2 },
            1280: { slidesPerView: 5, spaceBetween: 16, slidesPerGroup: 2 },
          }}
        >
          {products.map((p) => (
            <SwiperSlide key={p.guid} style={{ height: 'auto' }}>
              <ProductCard product={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  )
}
