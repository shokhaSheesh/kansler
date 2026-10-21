import { Box, Image, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { ScrollRow } from '@/shared/ui/ScrollRow'
import type { Category } from '@/entities/category/types'

/** One swipeable row of category tiles, same scrolling as the product shelves. */
export const CategoryRail = ({ categories }: { categories: Category[] }) => {
  const lang = useLang()
  return (
    <ScrollRow itemWidth={{ base: 124, md: 184 }}>
      {categories.map((c) => (
        <RouterLink key={c.guid} to={paths.category(c.guid)} draggable={false}>
          <Box
            role="group"
            pos="relative"
            h={{ base: '124px', md: '140px' }}
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
                draggable={false}
                loading="lazy"
                pos="absolute"
                right="2"
                bottom="2"
                h={{ base: '60px', md: '76px' }}
                w="auto"
                maxW="75%"
                fit="contain"
                transition="transform .25s"
                _groupHover={{ transform: 'translateY(-3px)' }}
              />
            )}
          </Box>
        </RouterLink>
      ))}
    </ScrollRow>
  )
}
