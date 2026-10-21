import { Box, Flex, Grid, Heading, Image, Link, Stack, Text } from '@chakra-ui/react'
import { ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import type { Category } from '@/entities/category/types'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { Container } from '@/shared/ui/Container'

const byOrder = (a: Category, b: Category) => a.display_order - b.display_order

/**
 * Desktop mega-menu over the real 3-level category tree.
 * Left: top-level categories (hover / focus to preview). Right: level 2 as column headings, level 3 as links.
 * Level 4 (9 categories in the live data) is reachable from the product-list filters.
 * Ref: Faire / Walmart department menus.
 */
export const CatalogMenu = ({ categories, onClose }: { categories: Category[]; onClose: () => void }) => {
  const { t } = useTranslation()
  const lang = useLang()
  const [activeId, setActiveId] = useState(categories[0]?.guid)
  const timer = useRef<number>(undefined)

  // Small hover-intent delay so moving the cursor diagonally to the right panel doesn't switch categories
  const preview = (id: string) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setActiveId(id), 90)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      window.clearTimeout(timer.current)
    }
  }, [onClose])

  const active = categories.find((c) => c.guid === activeId) ?? categories[0]
  if (!active) return null
  const children = [...active.categories_data].sort(byOrder)

  return (
    <>
      {/* Backdrop below the header */}
      <Box pos="absolute" top="100%" left="0" right="0" h="100dvh" bg="blackAlpha.400" onClick={onClose} />

      <Box pos="absolute" top="100%" left="0" right="0" pt="2">
        <Container>
          <Grid
            role="dialog"
            aria-label={t('nav.catalog')}
            templateColumns="300px 1fr"
            bg="bg.surface"
            borderRadius="card"
            boxShadow="0 24px 48px rgba(16, 24, 40, 0.18)"
            h="min(620px, calc(100dvh - 150px))"
            overflow="hidden"
          >
            <Stack as="nav" gap="0.5" p="2" overflowY="auto" borderRightWidth="1px" borderColor="border.subtle">
              {categories.map((c) => {
                const isActive = c.guid === active.guid
                return (
                  <RouterLink
                    key={c.guid}
                    to={paths.category(c.slug)}
                    onMouseEnter={() => preview(c.guid)}
                    onFocus={() => setActiveId(c.guid)}
                    onClick={onClose}
                  >
                    <Flex
                      align="center"
                      gap="3"
                      px="2.5"
                      py="2"
                      borderRadius="primary"
                      bg={isActive ? 'bg.muted' : 'transparent'}
                      color={isActive ? 'fg.default' : 'fg.body'}
                      fontWeight={isActive ? '600' : '500'}
                      fontSize="sm"
                    >
                      <Box boxSize="32px" flexShrink="0" bg="bg.page" borderRadius="8px" p="1">
                        {c.image && <Image src={c.image} alt="" w="full" h="full" fit="contain" />}
                      </Box>
                      <Text flex="1" lineClamp="1">
                        {localized(c, 'name', lang)}
                      </Text>
                      {isActive && <ChevronRight size={16} />}
                    </Flex>
                  </RouterLink>
                )
              })}
            </Stack>

            <Box p="6" overflowY="auto" pos="relative">
              {active.image && (
                <Image
                  src={active.image}
                  alt=""
                  pos="absolute"
                  right="6"
                  bottom="6"
                  h="180px"
                  w="auto"
                  maxW="35%"
                  fit="contain"
                  opacity="0.9"
                  pointerEvents="none"
                />
              )}
              <Flex align="baseline" justify="space-between" mb="5" gap="4">
                <Heading as="h3" fontSize="2xl" fontWeight="700" color="fg.default">
                  {localized(active, 'name', lang)}
                </Heading>
                <Link asChild fontSize="sm" fontWeight="600" color="fg.body" _hover={{ color: 'fg.default' }}>
                  <RouterLink to={paths.category(active.slug)} onClick={onClose}>
                    {t('view_all')}
                    <ChevronRight size={16} />
                  </RouterLink>
                </Link>
              </Flex>

              <Box css={{ columnCount: 3, columnGap: '32px' }}>
                {children.map((l2) => (
                  <Box key={l2.guid} mb="6" css={{ breakInside: 'avoid' }}>
                    <Link asChild fontWeight="600" fontSize="sm" color="fg.default" _hover={{ color: 'fg.link' }}>
                      <RouterLink to={paths.category(l2.slug)} onClick={onClose}>
                        {localized(l2, 'name', lang)}
                      </RouterLink>
                    </Link>
                    {l2.categories_data.length > 0 && (
                      <Stack gap="1.5" mt="2">
                        {[...l2.categories_data].sort(byOrder).map((l3) => (
                          <Link
                            key={l3.guid}
                            asChild
                            fontSize="sm"
                            color="fg.muted"
                            _hover={{ color: 'fg.default', textDecoration: 'none' }}
                          >
                            <RouterLink to={paths.category(l3.slug)} onClick={onClose}>
                              {localized(l3, 'name', lang)}
                            </RouterLink>
                          </Link>
                        ))}
                      </Stack>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Container>
      </Box>
    </>
  )
}
