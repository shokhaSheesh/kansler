import { Badge, Box, Button, Flex, Grid, Highlight, IconButton, Image, Skeleton, Stack, Text } from '@chakra-ui/react'
import { ArrowRight, ArrowUpLeft, Clock, Folder, Search, TrendingUp, X } from 'lucide-react'
import { createContext, useContext, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AddToCartControl } from '@/features/add-to-cart/AddToCartControl'
import type { Product } from '@/entities/product/types'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Price } from '@/shared/ui/Price'
import { searchHistory } from '@/stores/search-history.store'
import type { NavItem, PanelState, SearchActions } from './model'

interface SearchPanelProps {
  state: PanelState
  items: NavItem[]
  active: number
  onHover: (index: number) => void
  actions: SearchActions
  variant: 'desktop' | 'mobile'
}

const Label = ({ children, action }: { children: ReactNode; action?: ReactNode }) => (
  <Flex align="center" justify="space-between" mb="2" px="1" minH="24px">
    <Text fontSize="xs" fontWeight="600" color="fg.muted" textTransform="uppercase" letterSpacing="0.04em">
      {children}
    </Text>
    {action}
  </Flex>
)

const terms = (q: string) => q.split(/\s+/).filter(Boolean)

interface PanelCtxValue {
  items: NavItem[]
  active: number
  onHover: (index: number) => void
}
const PanelCtx = createContext<PanelCtxValue>({ items: [], active: -1, onHover: () => {} })

const useNav = (key: string) => {
  const { items, active, onHover } = useContext(PanelCtx)
  const i = items.findIndex((it) => it.key === key)
  return {
    i,
    isActive: i === active,
    bind: {
      id: `search-item-${i}`,
      'data-index': i,
      onMouseEnter: () => onHover(i),
      onMouseDown: (e: { preventDefault: () => void }) => e.preventDefault(), // keep input focus
      onClick: () => items[i]?.run(),
    },
  }
}

/** A keyboard/mouse navigable row. */
const Row = ({ k, children, ...rest }: { k: string; children: ReactNode } & Record<string, unknown>) => {
  const { isActive, bind } = useNav(k)
  return (
    <Flex
      role="option"
      aria-selected={isActive}
      align="center"
      gap="3"
      px="3"
      minH="40px"
      borderRadius="primary"
      cursor="pointer"
      bg={isActive ? 'bg.muted' : 'transparent'}
      {...bind}
      {...rest}
    >
      {children}
    </Flex>
  )
}

const Chip = ({ k, icon, children }: { k: string; icon?: ReactNode; children: ReactNode }) => {
  const { isActive, bind } = useNav(k)
  return (
    <Button
      size="sm"
      variant="outline"
      borderRadius="full"
      borderColor={isActive ? 'navy.900' : 'border.default'}
      bg={isActive ? 'bg.muted' : 'bg.surface'}
      color="fg.body"
      fontWeight="500"
      gap="1.5"
      {...bind}
    >
      {icon}
      {children}
    </Button>
  )
}

const hl = { fontWeight: '700', color: 'fg.default', bg: 'transparent' }

const ProductRow = ({ p, q, mobile }: { p: Product; q: string[]; mobile: boolean }) => {
  const { t } = useTranslation()
  const lang = useLang()
  const v = p.variations[0]
  const name = localized(v, 'name', lang) || localized(p, 'name', lang)
  const discount = v.discount_percent ?? 0
  return (
    <Row k={`pr:${p.guid}`} py="2" gap="3" align="center">
      <Box boxSize={mobile ? '56px' : '60px'} flexShrink="0" bg="kgray.50" borderRadius="primary" overflow="hidden">
        <Image src={v.image[0]} alt="" w="full" h="full" fit="contain" p="1" mixBlendMode="multiply" />
      </Box>
      <Stack flex="1" minW="0" gap="1">
        <Text fontSize="sm" color="fg.muted" lineClamp="2" lineHeight="1.35">
          <Highlight query={q} ignoreCase styles={hl}>
            {name}
          </Highlight>
        </Text>
        <Price value={discount && v.discount_price ? v.discount_price : v.price} oldValue={discount ? v.price : null} size="sm" />
      </Stack>
      <Box flexShrink="0" onMouseDown={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
        {v.in_stock > 0 ? (
          <AddToCartControl product={p} size="sm" />
        ) : (
          <Text fontSize="xs" color="fg.subtle">
            {t('product_detail.out_of_stock')}
          </Text>
        )}
      </Box>
    </Row>
  )
}

const PopularChips = ({ popular }: { popular: string[] }) => {
  const { t } = useTranslation()
  return (
    <Box>
      <Label>{t('nav.popular')}</Label>
      <Flex wrap="wrap" gap="2" px="1">
        {popular.map((p) => (
          <Chip key={p} k={`p:${p}`} icon={<TrendingUp size={14} />}>
            {p}
          </Chip>
        ))}
      </Flex>
    </Box>
  )
}

/** Shared content of the desktop dropdown and the mobile full-screen search. */
export const SearchPanel = (props: SearchPanelProps) => (
  <PanelCtx.Provider value={{ items: props.items, active: props.active, onHover: props.onHover }}>
    <PanelBody {...props} />
  </PanelCtx.Provider>
)

const PanelBody = ({ state, items, active, onHover, actions, variant }: SearchPanelProps) => {
  const { t } = useTranslation()
  const lang = useLang()
  const mobile = variant === 'mobile'
  const idx = (key: string) => items.findIndex((i) => i.key === key)

  // ---- empty: history + popular + categories -----------------------------------------------
  if (state.kind === 'empty') {
    return (
      <Stack gap="6" p={mobile ? 0 : 5}>
        <Grid templateColumns={{ base: '1fr', md: state.history.length ? '1fr 1fr' : '1fr' }} gap="6">
          {state.history.length > 0 && (
            <Box>
              <Label
                action={
                  <Button
                    size="2xs"
                    variant="plain"
                    color="fg.link"
                    px="0"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => searchHistory.clear()}
                  >
                    {t('search_history.clear')}
                  </Button>
                }
              >
                {t('nav.recent')}
              </Label>
              <Stack gap="0">
                {state.history.map((h) => (
                  <Row key={h} k={`h:${h}`}>
                    <Clock size={16} color="var(--chakra-colors-fg-subtle)" />
                    <Text flex="1" fontSize="sm" color="fg.body" truncate>
                      {h}
                    </Text>
                    <IconButton
                      aria-label={t('cart.delete')}
                      size="2xs"
                      variant="ghost"
                      color="fg.subtle"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation()
                        searchHistory.remove(h)
                      }}
                    >
                      <X size={14} />
                    </IconButton>
                  </Row>
                ))}
              </Stack>
            </Box>
          )}
          <PopularChips popular={state.popular} />
        </Grid>

        <Box>
          <Label>{t('categories.title')}</Label>
          <Flex wrap="wrap" gap="2" px="1">
            {state.categories.map((c) => (
              <Chip
                key={c.guid}
                k={`c:${c.guid}`}
                icon={c.image ? <Image src={c.image} alt="" boxSize="18px" fit="contain" /> : <Folder size={14} />}
              >
                {localized(c, 'name', lang)}
              </Chip>
            ))}
          </Flex>
        </Box>
      </Stack>
    )
  }

  // ---- loading ------------------------------------------------------------------------------
  if (state.kind === 'loading') {
    return (
      <Stack gap="3" p={mobile ? 0 : 5}>
        {Array.from({ length: 5 }, (_, i) => (
          <Flex key={i} gap="3" align="center">
            <Skeleton boxSize="48px" borderRadius="primary" />
            <Stack flex="1" gap="2">
              <Skeleton h="12px" w="70%" />
              <Skeleton h="12px" w="30%" />
            </Stack>
          </Flex>
        ))}
      </Stack>
    )
  }

  // ---- nothing found ------------------------------------------------------------------------
  if (state.kind === 'none') {
    return (
      <Stack gap="6" p={mobile ? 0 : 5}>
        <EmptyState size="sm" title={t('products.not_found')} description={`«${state.query}»`} />
        <PopularChips popular={state.popular} />
      </Stack>
    )
  }

  // ---- results ------------------------------------------------------------------------------
  const q = terms(state.query)

  const suggestions = state.suggestions.length > 0 && (
    <Box>
      <Stack gap="0">
        {state.suggestions.map((s) => (
          <Row key={s} k={`s:${s}`}>
            <Search size={16} color="var(--chakra-colors-fg-subtle)" />
            <Text flex="1" fontSize="sm" color="fg.muted" truncate>
              <Highlight query={q} ignoreCase styles={hl}>
                {s}
              </Highlight>
            </Text>
            <IconButton
              aria-label="↖"
              size="2xs"
              variant="ghost"
              color="fg.subtle"
              title={s}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation()
                actions.fill(s)
              }}
            >
              <ArrowUpLeft size={14} />
            </IconButton>
          </Row>
        ))}
      </Stack>
    </Box>
  )

  const categoryHits = state.categories.length > 0 && (
    <Box>
      <Label>{t('categories.title')}</Label>
      <Stack gap="0">
        {state.categories.map(({ category, path }) => (
          <Row key={category.guid} k={`c:${category.guid}`} py="1.5">
            <Flex boxSize="32px" flexShrink="0" align="center" justify="center" bg="bg.page" borderRadius="8px" p="1">
              {path[0]?.image ? <Image src={path[0].image} alt="" w="full" h="full" fit="contain" /> : <Folder size={16} />}
            </Flex>
            <Box minW="0">
              <Text fontSize="sm" color="fg.default" fontWeight="500" truncate>
                <Highlight query={q} ignoreCase styles={hl}>
                  {localized(category, 'name', lang)}
                </Highlight>
              </Text>
              {path.length > 1 && (
                <Text fontSize="xs" color="fg.subtle" truncate>
                  {path
                    .slice(0, -1)
                    .map((c) => localized(c, 'name', lang))
                    .join(' › ')}
                </Text>
              )}
            </Box>
          </Row>
        ))}
      </Stack>
    </Box>
  )

  const allIdx = idx('all')
  const products = state.products.length > 0 && (
    <Box>
      <Label>
        {t('search.all')}{' '}
        <Badge ml="1" size="sm" variant="subtle" borderRadius="full" color="fg.body">
          {state.count}
        </Badge>
      </Label>
      <Stack gap="0">
        {state.products.map((p) => (
          <ProductRow key={p.guid} p={p} q={q} mobile={mobile} />
        ))}
      </Stack>
      <Button
        id={`search-item-${allIdx}`}
        data-index={allIdx}
        mt="2"
        w="full"
        h="44px"
        borderRadius="primary"
        variant={allIdx === active ? 'solid' : 'subtle'}
        colorPalette={allIdx === active ? 'brand' : undefined}
        justifyContent="space-between"
        onMouseEnter={() => onHover(allIdx)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => items[allIdx]?.run()}
      >
        <Text>
          {t('search.all')} · {state.count}
        </Text>
        <ArrowRight size={16} />
      </Button>
    </Box>
  )

  if (mobile) {
    return (
      <Stack gap="5">
        {suggestions}
        {products}
        {categoryHits}
      </Stack>
    )
  }

  return (
    <Grid templateColumns="minmax(0, 5fr) minmax(0, 7fr)">
      <Stack gap="5" p="4" borderRightWidth="1px" borderColor="border.subtle">
        {suggestions}
        {categoryHits}
      </Stack>
      <Box p="4">{products}</Box>
    </Grid>
  )
}
