import { Box, Button, Flex, HStack, IconButton, Image, Link, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useLocation, useMatch } from 'react-router'
import { MapPin, BadgePercent, FileText, FolderOpen, Heart, LayoutGrid, Package, PackageOpen, Phone, Search, ShoppingCart, User, X } from 'lucide-react'
import logo from '@/shared/assets/logo.png'
import { Container } from '@/shared/ui/Container'
import { paths } from '@/app/router/paths'
import { authStore } from '@/stores/auth.store'
import { CartPreview } from './CartPreview'
import { CatalogMenu } from './CatalogMenu'
import { CountBadge, HeaderAction } from './HeaderAction'
import { SearchBox } from '@/features/search/SearchBox'
import { MobileSearch } from '@/features/search/MobileSearch'
import { mockCart } from '@/mocks/cart.store'
import { mockFavourites } from '@/mocks/favourites.store'
import { LanguageSwitcher } from './LanguageSwitcher'
import { categories } from '@/mocks'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { copyText } from '@/shared/lib/copy'
import { env } from '@/shared/config/env'
import { mockProfile } from '@/mocks/profile.store'

export const Header = observer(() => {
  const { t } = useTranslation()
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const closeCatalog = useCallback(() => setCatalogOpen(false), [])
  const closeMobileSearch = useCallback(() => setMobileSearchOpen(false), [])
  const onSearchOpenChange = useCallback((open: boolean) => {
    setSearchOpen(open)
    if (open) setCatalogOpen(false)
  }, [])

  // On /search/:query the input shows the current query
  const searchMatch = useMatch('/search/:query')
  const routeWord = searchMatch?.params.query ? decodeURIComponent(searchMatch.params.query) : ''
  // /search/discounted | new | recommended | all are product lists, not typed searches: keep the box empty
  const routeQuery = ['discounted', 'new', 'recommended', 'all'].includes(routeWord) ? '' : routeWord
  const [query, setQuery] = useState(routeQuery)

  // Close menus and resync the input whenever the route changes
  const { pathname, search } = useLocation()
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setCatalogOpen(false)
    setSearchOpen(false)
    setQuery(routeQuery)
  }
  // Design phase: shared mock cart. Wiring: useCartCount()
  const cartCount = mockCart.count
  // Design phase shows the signed-in look (as the profile pages do). Wiring: authStore.isAuthorized + /user/address/list
  const signedIn = env.designMode || authStore.isAuthorized
  const defaultAddress = mockProfile.addresses.find((a) => a.is_default)?.address

  const lang = useLang()
  const shortcuts = [
    ...categories.slice(0, 3).map((c, i) => ({
      to: paths.category(c.slug),
      icon: [FileText, PackageOpen, FolderOpen][i],
      label: localized(c, 'name', lang),
      promo: false,
    })),
    // Live: Акции opens the discounted products (/search/discounted)
    { to: paths.search('discounted'), icon: BadgePercent, label: t('footer.promotions'), promo: true },
  ]
  const isActive = (to: string) => {
    const [path, qs] = to.split('?')
    return qs ? pathname === path && search.includes(qs) : pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <Box as="header" bg="bg.surface" borderBottomWidth="1px" borderColor="border.subtle" pos="sticky" top="0" zIndex="sticky">
      <Container>
        <Flex h={{ base: '60px', md: '72px' }} align="center" gap={{ base: 3, md: 6 }}>
          <RouterLink to={paths.home} aria-label="Kansler">
            <Image src={logo} alt="Kansler" h={{ base: '22px', md: '28px' }} />
          </RouterLink>

          <Button
            hideBelow="md"
            colorPalette="brand"
            borderRadius="control"
            h="44px"
            px="5"
            gap="2"
            aria-expanded={catalogOpen}
            onClick={() => {
              setCatalogOpen((o) => !o)
              setSearchOpen(false)
            }}
          >
            {catalogOpen ? <X size={18} /> : <LayoutGrid size={18} />}
            {t('nav.catalog')}
          </Button>

          <Box hideBelow="md" flex="1" minW="0" display="flex">
            <SearchBox query={query} onQueryChange={setQuery} open={searchOpen} onOpenChange={onSearchOpenChange} />
          </Box>

          {/* Mobile: looks like an input, opens the full-screen search */}
          <Flex
            as="button"
            hideFrom="md"
            flex="1"
            minW="0"
            h="44px"
            px="3"
            gap="2"
            align="center"
            bg="bg.muted"
            borderRadius="control"
            color="fg.subtle"
            onClick={() => setMobileSearchOpen(true)}
          >
            <Search size={18} />
            <Text truncate fontSize="md" color={query ? 'fg.default' : 'fg.subtle'}>
              {query || t('nav.search_placeholder')}
            </Text>
          </Flex>

          <HStack gap="1" hideBelow="md">
            <HeaderAction to={paths.orders} icon={<Package size={22} />} label={t('nav.orders_label')} />
            <HeaderAction to={paths.favourites} icon={<Heart size={22} />} label={t('nav.favorites_label')} count={mockFavourites.count} />
            <CartPreview>
              <HeaderAction to={paths.cart} icon={<ShoppingCart size={22} />} label={t('nav.cart_label')} count={cartCount} />
            </CartPreview>
            {/* Live: signed-in buyers see their first name instead of "Профиль" */}
            <HeaderAction to={signedIn ? paths.profile.root : paths.auth.login} icon={<User size={22} />} label={signedIn ? mockProfile.user.fullname.split(' ')[0] : t('nav.profile_label')} />
          </HStack>

          <IconButton asChild hideFrom="md" variant="ghost" aria-label={t('nav.cart_label')}>
            <RouterLink to={paths.cart}>
              <Box pos="relative">
                <ShoppingCart size={22} />
                <CountBadge count={cartCount} />
              </Box>
            </RouterLink>
          </IconButton>
        </Flex>

        <Flex hideBelow="md" h="48px" align="center" justify="space-between" gap="4" fontSize="sm">
          {/* Same 4 shortcuts as the live header, as pills: the current page is navy, Акции in the discount red */}
          <HStack gap="1">
            {shortcuts.map(({ to, icon: Icon, label, promo }) => {
              const on = isActive(to)
              return (
                <Link
                  key={label}
                  asChild
                  h="34px"
                  px="3"
                  gap="2"
                  borderRadius="full"
                  fontWeight="500"
                  textDecoration="none"
                  whiteSpace="nowrap"
                  transition="background .15s, color .15s"
                  bg={on ? (promo ? 'primary.main' : 'navy.900') : promo ? 'primary.50' : 'transparent'}
                  color={on ? 'white' : promo ? 'fg.discount' : 'fg.body'}
                  _hover={{ bg: on ? undefined : promo ? 'primary.100' : 'bg.tile', color: on ? 'white' : promo ? 'fg.discount' : 'fg.default', textDecoration: 'none' }}
                  aria-current={on ? 'page' : undefined}
                >
                  <RouterLink to={to}>
                    <Icon size={16} strokeWidth={on || promo ? 2.2 : 1.8} />
                    {label}
                  </RouterLink>
                </Link>
              )
            })}
          </HStack>
          <HStack gap="3">
            {/* Live: a signed-in buyer's default delivery address (first 30 characters) */}
            {signedIn && defaultAddress && (
              <Link asChild h="34px" px="3" gap="2" borderRadius="full" color="fg.body" fontWeight="500" textDecoration="none" title={defaultAddress} _hover={{ bg: 'bg.tile', color: 'fg.default', textDecoration: 'none' }}>
                <RouterLink to={paths.profile.address}>
                  <MapPin size={15} />
                  {defaultAddress.length > 30 ? `${defaultAddress.slice(0, 30)}…` : defaultAddress}
                </RouterLink>
              </Link>
            )}
            {/* Live: clicking the number copies it ("Номер телефона скопирован") */}
            <Link
              as="button"
              onClick={() => copyText('+998781484444', t('phone_copied'))}
              h="34px"
              ps="1"
              pe="3"
              gap="2"
              borderRadius="full"
              color="fg.body"
              fontWeight="500"
              fontVariantNumeric="tabular-nums"
              textDecoration="none"
              _hover={{ bg: 'bg.tile', color: 'fg.default', textDecoration: 'none' }}
            >
              <Flex boxSize="26px" align="center" justify="center" borderRadius="full" bg="bg.tile" color="fg.default">
                <Phone size={13} />
              </Flex>
              +998 78 148 44 44
            </Link>
            <LanguageSwitcher />
          </HStack>
        </Flex>
      </Container>

      {searchOpen && (
        <Box hideBelow="md" pos="absolute" top="100%" left="0" right="0" h="100dvh" bg="blackAlpha.400" onClick={() => setSearchOpen(false)} />
      )}

      {mobileSearchOpen && <MobileSearch query={query} onQueryChange={setQuery} onClose={closeMobileSearch} />}

      {catalogOpen && (
        <Box hideBelow="md">
          <CatalogMenu categories={categories} onClose={closeCatalog} />
        </Box>
      )}
    </Box>
  )
})
