import { Box } from '@chakra-ui/react'
import { Children, type ReactNode } from 'react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface ScrollRowProps {
  children: ReactNode
  /** Fixed slide width (e.g. category tiles). Omit to use responsive slidesPerView for product cards. */
  itemWidth?: { base: number; md: number }
  /** Product-card density per breakpoint. */
  perView?: { base: number; sm: number; lg: number; xl: number }
}

/**
 * Horizontal row that scrolls like a native list: trackpad two-finger swipe, mouse drag, touch, momentum.
 * No arrow buttons. Bleeds to the screen edge on mobile.
 */
export const ScrollRow = ({ children, itemWidth, perView = { base: 2.15, sm: 3.2, lg: 4.3, xl: 5.3 } }: ScrollRowProps) => {
  const slides = Children.toArray(children)
  const fixed = Boolean(itemWidth)

  return (
    // py/my give hover shadows room inside the clipped area
    <Box mx={{ base: -4, md: 0 }} px={{ base: 4, md: 0 }} py="3" my="-3" overflow="hidden">
      <Swiper
        modules={[FreeMode, Mousewheel]}
        freeMode={{ enabled: true, momentumRatio: 0.6 }}
        mousewheel={{ forceToAxis: true }}
        grabCursor
        style={{ overflow: 'visible' }}
        slidesPerView={fixed ? 'auto' : perView.base}
        spaceBetween={12}
        breakpoints={{
          640: { slidesPerView: fixed ? 'auto' : perView.sm, spaceBetween: 16 },
          1024: { slidesPerView: fixed ? 'auto' : perView.lg, spaceBetween: 16 },
          1280: { slidesPerView: fixed ? 'auto' : perView.xl, spaceBetween: 20 },
        }}
      >
        {slides.map((child, i) => (
          <SwiperSlide key={i} className={fixed ? 'slide-auto' : undefined} style={{ height: 'auto' }}>
            {fixed ? (
              <Box w={{ base: `${itemWidth!.base}px`, md: `${itemWidth!.md}px` }} h="full">
                {child}
              </Box>
            ) : (
              child
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}
