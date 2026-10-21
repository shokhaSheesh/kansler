import { Box, Grid, Image, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import type { Category } from '@/entities/category/types'

/** Was: a row of small icons with tiny labels. Now: tappable tiles, 6×2 on desktop, swipeable row on mobile. */
export const CategoryRail = ({ categories }: { categories: Category[] }) => {
  const lang = useLang()
  return (
    <Grid
      as="nav"
      gap={{ base: 2, md: 3 }}
      templateColumns={{ base: 'none', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' }}
      gridAutoFlow={{ base: 'column', md: 'row' }}
      gridAutoColumns={{ base: '116px', md: 'auto' }}
      overflowX={{ base: 'auto', md: 'visible' }}
      mx={{ base: -4, md: 0 }}
      px={{ base: 4, md: 0 }}
      pb={{ base: 1, md: 0 }}
      scrollSnapType="x mandatory"
      css={{ scrollbarWidth: 'none' }}
    >
      {categories.map((c) => (
        <RouterLink key={c.guid} to={paths.category(c.guid)} style={{ scrollSnapAlign: 'start' }}>
          <Box
            role="group"
            pos="relative"
            h={{ base: '116px', md: '128px' }}
            bg="bg.surface"
            borderRadius="card"
            borderWidth="1px"
            borderColor="border.subtle"
            p="3"
            overflow="hidden"
            transition="border-color .2s, box-shadow .2s"
            _hover={{ borderColor: 'navy.900', boxShadow: '0 4px 16px rgba(16, 24, 40, 0.06)' }}
          >
            <Text fontSize="sm" fontWeight="600" color="fg.default" lineHeight="1.3" lineClamp="2" pos="relative" zIndex="1">
              {localized(c, 'name', lang)}
            </Text>
            {c.image && (
              <Image
                src={c.image}
                alt=""
                loading="lazy"
                pos="absolute"
                right={{ base: '2', md: '3' }}
                bottom={{ base: '2', md: '2' }}
                h={{ base: '60px', md: '72px' }}
                w="auto"
                maxW="70%"
                fit="contain"
                transition="transform .25s"
                _groupHover={{ transform: 'translateY(-3px)' }}
              />
            )}
          </Box>
        </RouterLink>
      ))}
    </Grid>
  )
}
