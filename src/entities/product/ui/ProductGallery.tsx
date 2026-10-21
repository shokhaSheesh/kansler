import { Box, Flex, Image } from '@chakra-ui/react'
import { useRef, useState, type WheelEvent } from 'react'
import { Link as RouterLink } from 'react-router'

interface ProductGalleryProps {
  images: string[]
  alt: string
  href: string
  dimmed?: boolean
}

/**
 * Card photo gallery, browsable without opening the product:
 *  - mouse: move across the photo to flip through it (one hover zone per photo)
 *  - touch: swipe (native scroll-snap)
 *  - trackpad: horizontal two-finger swipe
 * `swiper-no-swiping` / `swiper-no-mousewheel` stop the parent shelf from stealing the gesture.
 */
export const ProductGallery = ({ images, alt, href, dimmed }: ProductGalleryProps) => {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const multi = images.length > 1

  const show = (i: number) => {
    setIndex(i)
    const el = track.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'instant' })
  }

  const onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && track.current) track.current.scrollLeft += e.deltaX
  }

  const img = (src: string, i: number) => (
    <Image
      src={src}
      alt={i === 0 ? alt : ''}
      loading={i === 0 ? 'eager' : 'lazy'}
      draggable={false}
      w="full"
      h="full"
      fit="contain"
      p="3"
      mixBlendMode="multiply"
      opacity={dimmed ? 0.45 : 1}
    />
  )

  if (!multi) {
    return (
      <RouterLink to={href} aria-label={alt} style={{ display: 'block', width: '100%', height: '100%' }}>
        <Box w="full" h="full" transition="transform .3s" _groupHover={{ transform: 'scale(1.04)' }}>
          {img(images[0], 0)}
        </Box>
      </RouterLink>
    )
  }

  return (
    <Box
      pos="relative"
      w="full"
      h="full"
      className="swiper-no-swiping swiper-no-mousewheel"
      onMouseLeave={() => show(0)}
      onWheel={onWheel}
    >
      <Flex
        ref={track}
        h="full"
        overflowX="auto"
        scrollSnapType="x mandatory"
        css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
        onScroll={(e) => {
          const el = e.currentTarget
          const i = Math.round(el.scrollLeft / el.clientWidth)
          if (i !== index) setIndex(i)
        }}
      >
        {images.map((src, i) => (
          <RouterLink key={src} to={href} draggable={false} style={{ flex: '0 0 100%', scrollSnapAlign: 'start' }}>
            {img(src, i)}
          </RouterLink>
        ))}
      </Flex>

      {/* Hover zones: only on devices with a real pointer */}
      <Flex pos="absolute" inset="0" css={{ '@media (hover: none)': { display: 'none' } }}>
        {images.map((src, i) => (
          <RouterLink key={src} to={href} aria-hidden tabIndex={-1} style={{ flex: 1 }} onMouseEnter={() => show(i)} />
        ))}
      </Flex>

      {/* Position bars */}
      <Flex pos="absolute" top="2.5" left="50%" transform="translateX(-50%)" gap="1" pointerEvents="none">
        {images.map((src, i) => (
          <Box
            key={src}
            h="3px"
            w={i === index ? '16px' : '6px'}
            borderRadius="full"
            bg={i === index ? 'navy.900' : 'blackAlpha.300'}
            transition="width .2s, background .2s"
          />
        ))}
      </Flex>
    </Box>
  )
}
