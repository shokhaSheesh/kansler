import { Box, IconButton, Image } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router'
import { Autoplay, Mousewheel, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css/pagination'
import { paths } from '@/app/router/paths'
import { slugOf } from '@/mocks/catalog'
import { useLang } from '@/shared/hooks/useLang'
import type { Banner } from '@/entities/main-page/types'

/**
 * Was: carousel with the next slide peeking in and cropping its headline.
 * Now: one full-width slide at a time, per-device artwork (web 3:1, tablet 2.4:1, mobile 2:1),
 * autoplay that pauses on hover, arrows on desktop, dots everywhere.
 */
export const HeroBanners = ({ banners }: { banners: Banner[] }) => {
  const lang = useLang()
  const [swiper, setSwiper] = useState<SwiperType | null>(null)

  return (
    <Box pos="relative" borderRadius={{ base: 'card', md: 'modal' }} overflow="hidden" className="hero-banners">
      <Swiper
        modules={[Autoplay, Mousewheel, Pagination]}
        mousewheel={{ forceToAxis: true, thresholdDelta: 20 }}
        onSwiper={setSwiper}
        loop={banners.length > 1}
        autoplay={{ delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: false }}
        pagination={{ clickable: true }}
      >
        {banners.map((b) => {
          const img = (
            <picture>
              <source media="(max-width: 767px)" srcSet={b[`mobile_${lang}`]} />
              <source media="(max-width: 1023px)" srcSet={b[`tablet_${lang}`]} />
              <Image
                src={b[`web_${lang}`]}
                alt=""
                display="block"
                w="full"
                aspectRatio={{ base: '2 / 1', md: '751 / 312', lg: '3 / 1' }}
                fit="cover"
              />
            </picture>
          )
          return (
            <SwiperSlide key={b.guid}>
              {b.categories_id ? <RouterLink to={paths.category(slugOf(b.categories_id))}>{img}</RouterLink> : img}
            </SwiperSlide>
          )
        })}
      </Swiper>

      {banners.length > 1 && (
        <>
          <IconButton
            aria-label="prev"
            hideBelow="lg"
            pos="absolute"
            left="4"
            top="50%"
            transform="translateY(-50%)"
            zIndex="1"
            borderRadius="full"
            bg="whiteAlpha.900"
            color="fg.default"
            _hover={{ bg: 'white' }}
            onClick={() => swiper?.slidePrev()}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <IconButton
            aria-label="next"
            hideBelow="lg"
            pos="absolute"
            right="4"
            top="50%"
            transform="translateY(-50%)"
            zIndex="1"
            borderRadius="full"
            bg="whiteAlpha.900"
            color="fg.default"
            _hover={{ bg: 'white' }}
            onClick={() => swiper?.slideNext()}
          >
            <ChevronRight size={20} />
          </IconButton>
        </>
      )}
    </Box>
  )
}
