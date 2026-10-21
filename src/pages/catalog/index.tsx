import { Accordion, Box, Flex, Grid, Heading, Image, Link, Stack, Text } from '@chakra-ui/react'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import type { Category } from '@/entities/category/types'
import { categories } from '@/mocks'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { panel } from '@/shared/ui/surface'

const byOrder = (a: Category, b: Category) => a.display_order - b.display_order

const CategoryThumb = ({ src, size }: { src: string | null; size: string }) => (
  <Box boxSize={size} flexShrink="0" bg="bg.page" borderRadius="primary" p="1.5">
    {src && <Image src={src} alt="" w="full" h="full" fit="contain" />}
  </Box>
)

/**
 * /categories: the mobile "Каталог" tab (replaces the old /categories-mobile route),
 * and a full category overview on desktop. Desktop users mostly reach categories via the header mega-menu.
 */
export default function CatalogPage() {
  const { t } = useTranslation()
  const lang = useLang()

  return (
    <Stack gap={{ base: 4, md: 6 }}>
      <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700" color="fg.default">
        {t('categories.title')}
      </Heading>

      {/* Mobile: expandable list */}
      <Accordion.Root hideFrom="md" collapsible variant="plain" bg="bg.surface" borderRadius="card" overflow="hidden">
        {categories.map((c, i) => (
          <Accordion.Item key={c.guid} value={c.guid} borderTopWidth={i ? '1px' : 0} borderColor="border.subtle">
            <Accordion.ItemTrigger px="3" py="2.5" gap="3" cursor="pointer">
              <CategoryThumb src={c.image} size="44px" />
              <Text flex="1" textAlign="start" fontWeight="600" fontSize="sm" color="fg.default">
                {localized(c, 'name', lang)}
              </Text>
              <Accordion.ItemIndicator color="fg.muted" />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody px="3" pt="0" pb="3">
                <Stack gap="0" pl="14">
                  <RouterLink to={paths.category(c.slug)}>
                    <Flex py="2.5" fontSize="sm" fontWeight="600" color="fg.default" align="center" justify="space-between">
                      {t('view_all')}
                      <ChevronRight size={16} />
                    </Flex>
                  </RouterLink>
                  {[...c.categories_data].sort(byOrder).map((l2) => (
                    <RouterLink key={l2.guid} to={paths.category(l2.slug)}>
                      <Flex
                        py="2.5"
                        borderTopWidth="1px"
                        borderColor="border.subtle"
                        fontSize="sm"
                        color="fg.body"
                        align="center"
                        justify="space-between"
                      >
                        {localized(l2, 'name', lang)}
                        <ChevronRight size={16} color="var(--chakra-colors-fg-subtle)" />
                      </Flex>
                    </RouterLink>
                  ))}
                </Stack>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      {/* Desktop: overview grid */}
      <Grid hideBelow="md" templateColumns={{ md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap="4">
        {categories.map((c) => (
          <Stack key={c.guid} {...panel} p="5" gap="4">
            <RouterLink to={paths.category(c.slug)}>
              <Flex align="center" gap="3">
                <CategoryThumb src={c.image} size="56px" />
                <Text flex="1" fontWeight="700" fontSize="lg" color="fg.default">
                  {localized(c, 'name', lang)}
                </Text>
                <ChevronRight size={18} />
              </Flex>
            </RouterLink>
            <Flex wrap="wrap" gap="2">
              {[...c.categories_data].sort(byOrder).map((l2) => (
                <Link
                  key={l2.guid}
                  asChild
                  fontSize="sm"
                  color="fg.body"
                  bg="bg.muted"
                  px="3"
                  py="1.5"
                  borderRadius="full"
                  _hover={{ bg: 'navy.900', color: 'white', textDecoration: 'none' }}
                >
                  <RouterLink to={paths.category(l2.slug)}>{localized(l2, 'name', lang)}</RouterLink>
                </Link>
              ))}
            </Flex>
          </Stack>
        ))}
      </Grid>
    </Stack>
  )
}
