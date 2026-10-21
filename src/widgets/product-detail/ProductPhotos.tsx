import { Box, Flex, IconButton, Image, Stack } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'

interface ProductPhotosProps {
  images: string[]
  alt: string
  /** Badges / buttons layered on the main photo (discount, favourite). */
  overlay?: ReactNode
}

/**
 * Product page photos. Desktop: thumbnail rail + main photo with arrows on hover.
 * Phone: full-width swipe (scroll-snap) with position dots. Parent re-keys this per variation.
 */
export const ProductPhotos = ({ images, alt, overlay }: ProductPhotosProps) => {
  const [index, setIndex] = useState(0)
  const track = useRef<HTMLDivElement>(null)
  const many = images.length > 1

  const go = (i: number) => {
    const n = (i + images.length) % images.length
    setIndex(n)
    const el = track.current
    if (el) el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <Flex gap="3" align="flex-start">
      {many && (
        <Stack hideBelow="md" gap="2" w="72px" flexShrink="0" maxH="560px" overflowY="auto" css={{ scrollbarWidth: 'none' }}>
          {images.map((src, i) => (
            <Box
              key={src}
              as="button"
              aria-label={`${alt} ${i + 1}`}
              boxSize="72px"
              flexShrink="0"
              bg="bg.tile"
              borderRadius="primary"
              borderWidth="2px"
              borderColor={i === index ? 'navy.900' : 'transparent'}
              overflow="hidden"
              onMouseEnter={() => go(i)}
              onClick={() => go(i)}
            >
              <Image src={src} alt="" w="full" h="full" fit="contain" p="1" mixBlendMode="multiply" />
            </Box>
          ))}
        </Stack>
      )}

      <Box role="group" pos="relative" flex="1" minW="0" aspectRatio="1" bg="bg.tile" borderRadius={{ base: 'card', md: 'modal' }} overflow="hidden">
        <Flex
          ref={track}
          h="full"
          overflowX={many ? 'auto' : 'hidden'}
          scrollSnapType="x mandatory"
          css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
          onScroll={(e) => {
            const el = e.currentTarget
            const i = Math.round(el.scrollLeft / el.clientWidth)
            if (i !== index) setIndex(i)
          }}
        >
          {images.map((src, i) => (
            <Box key={src} flex="0 0 100%" scrollSnapAlign="start" h="full">
              <Image
                src={src}
                alt={i === 0 ? alt : ''}
                loading={i === 0 ? 'eager' : 'lazy'}
                w="full"
                h="full"
                fit="contain"
                p={{ base: 6, md: 10 }}
                mixBlendMode="multiply"
                draggable={false}
              />
            </Box>
          ))}
        </Flex>

        {overlay}

        {many && (
          <>
            {(['prev', 'next'] as const).map((dir) => (
              <IconButton
                key={dir}
                aria-label={dir}
                hideBelow="md"
                pos="absolute"
                top="50%"
                {...(dir === 'prev' ? { left: '3' } : { right: '3' })}
                transform="translateY(-50%)"
                borderRadius="full"
                bg="whiteAlpha.900"
                color="fg.default"
                boxShadow="0 2px 8px rgba(16, 24, 40, 0.12)"
                opacity="0"
                _groupHover={{ opacity: 1 }}
                _hover={{ bg: 'white' }}
                transition="opacity .2s"
                onClick={() => go(index + (dir === 'prev' ? -1 : 1))}
              >
                {dir === 'prev' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </IconButton>
            ))}
            <Flex pos="absolute" bottom="3" left="50%" transform="translateX(-50%)" gap="1.5" pointerEvents="none">
              {images.map((src, i) => (
                <Box
                  key={src}
                  h="6px"
                  w={i === index ? '18px' : '6px'}
                  borderRadius="full"
                  bg={i === index ? 'navy.900' : 'blackAlpha.300'}
                  transition="width .2s"
                />
              ))}
            </Flex>
          </>
        )}
      </Box>
    </Flex>
  )
}
