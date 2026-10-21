import { Box, Button, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { Heart } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { AddToCartControl } from '@/features/add-to-cart/AddToCartControl'
import type { Product } from '@/entities/product/types'
import { ProductCard } from '@/entities/product/ui/ProductCard'
import { shelves } from '@/mocks'
import { mockFavourites } from '@/mocks/favourites.store'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { ProductShelf } from '@/widgets/home/ProductShelf'

type Tab = 'all' | 'discounted' | 'recommended' | 'new'
const TABS: Tab[] = ['all', 'discounted', 'recommended', 'new']

const NEW_DAYS = 60
const hasDiscount = (p: Product) => p.variations.some((v) => (v.discount_percent ?? 0) > 0)
const isNew = (p: Product) => Date.now() - new Date(p.created_at).getTime() < NEW_DAYS * 86_400_000
/** The live tabs don't say how "recommended" is decided; the mock flags a stable subset. Confirm with backend. */
const isRecommended = (p: Product) => [...p.guid].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 3 === 0

const matches: Record<Tab, (p: Product) => boolean> = {
  all: () => true,
  discounted: hasDiscount,
  recommended: isRecommended,
  new: isNew,
}

const columns = {
  base: 'repeat(2, minmax(0, 1fr))',
  sm: 'repeat(3, minmax(0, 1fr))',
  lg: 'repeat(4, minmax(0, 1fr))',
  xl: 'repeat(5, minmax(0, 1fr))',
}

/**
 * /favourites — same content as live: tabs (all / discounted / recommended / new), count, empty state.
 * Un-hearting here doesn't make the card vanish: it fades until you leave, so a mis-tap is one tap to undo.
 */
const FavouritesPage = observer(() => {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('all')
  // Snapshot on arrival: removed items stay (faded) until the next visit
  const [shown] = useState(() => mockFavourites.list)

  // Counts follow the live favourites (same as the title and header badge), not the faded cards
  const live = shown.filter((p) => mockFavourites.has(p.guid))
  const counts = Object.fromEntries(TABS.map((k) => [k, live.filter(matches[k]).length])) as Record<Tab, number>
  const visible = shown.filter(matches[tab])
  const isEmpty = shown.length === 0

  return (
    <Stack gap={{ base: 4, md: 6 }}>
      <Stack gap="2">
        <Breadcrumbs items={[{ label: t('favourites.breadcrumb.home'), to: paths.home }, { label: t('favourites.title') }]} />
        <Flex align="baseline" gap="3" wrap="wrap">
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700" color="fg.default">
            {t('favourites.title')}
          </Heading>
          {!isEmpty && (
            <Text color="fg.muted" fontSize={{ base: 'sm', md: 'md' }}>
              {mockFavourites.count} {t('favourites.products')}
            </Text>
          )}
        </Flex>
      </Stack>

      {isEmpty ? (
        <>
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            gap="3"
            py={{ base: 12, md: 16 }}
            px="6"
            bg="bg.surface"
            borderRadius="card"
            borderWidth="1px"
            borderColor="border.subtle"
          >
            <Flex boxSize="72px" align="center" justify="center" borderRadius="full" bg="primary.50" color="primary.main">
              <Heart size={32} />
            </Flex>
            <Text fontWeight="700" fontSize="xl" color="fg.default">
              {t('favourites.empty.title')}
            </Text>
            <Text color="fg.muted" maxW="320px">
              {t('favourites.empty.description')}
            </Text>
            <Button asChild colorPalette="brand" borderRadius="control" h="48px" px="8" mt="2">
              <RouterLink to={paths.home}>{t('favourites.empty.start_shopping')}</RouterLink>
            </Button>
          </Flex>
          {/* Give an empty page somewhere to go: the existing "Рекомендуем" shelf */}
          <ProductShelf title={t('recommended_products')} products={shelves.recommended} />
        </>
      ) : (
        <>
          <Flex gap="2" overflowX="auto" mx={{ base: -4, md: 0 }} px={{ base: 4, md: 0 }} css={{ scrollbarWidth: 'none' }}>
            {TABS.map((k) => {
              const on = tab === k
              return (
                <Button
                  key={k}
                  size="sm"
                  h="38px"
                  flexShrink="0"
                  borderRadius="full"
                  variant={on ? 'solid' : 'outline'}
                  colorPalette={on ? 'brand' : undefined}
                  bg={on ? undefined : 'bg.surface'}
                  borderColor="border.default"
                  fontWeight="500"
                  disabled={!on && counts[k] === 0}
                  onClick={() => setTab(k)}
                >
                  {t(`favourites.${k}`)}
                  <Text as="span" opacity="0.6">
                    {counts[k]}
                  </Text>
                </Button>
              )
            })}
          </Flex>

          <Grid templateColumns={columns} gap={{ base: 2, md: 4 }}>
            {visible.map((p) => {
              const removed = !mockFavourites.has(p.guid)
              return (
                <Box key={p.guid} opacity={removed ? 0.5 : 1} transition="opacity .2s" css={{ '&:hover': { opacity: 1 } }}>
                  <ProductCard product={p} action={(v, name) => <AddToCartControl variation={v} name={name} />} />
                </Box>
              )
            })}
          </Grid>
        </>
      )}
    </Stack>
  )
})

export default FavouritesPage
