import { Box, Button, Flex, HStack, IconButton, Image, Link, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useLocation, useMatch } from 'react-router'
import { BadgePercent, FileText, FolderOpen, Heart, LayoutGrid, Package, PackageOpen, Phone, Search, ShoppingCart, User, X } from 'lucide-react'
import logo from '@/shared/assets/logo.png'
import { Container } from '@/shared/ui/Container'
import { paths } from '@/app/router/paths'
import { authStore } from '@/stores/auth.store'
import { useFavouritesCount } from '@/entities/product/queries'
import { CatalogMenu } from './CatalogMenu'
import { CountBadge, HeaderAction } from './HeaderAction'
import { SearchBox } from '@/features/search/SearchBox'
import { MobileSearch } from '@/features/search/MobileSearch'
import { mockCart } from '@/mocks/cart.store'
import { LanguageSwitcher } from './LanguageSwitcher'
import { categories } from '@/mocks'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'

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
  const routeQuery = searchMatch?.params.query ? decodeURIComponent(searchMatch.params.query) : ''
  const [query, setQuery] = useState(routeQuery)

  // Close menus and resync the input whenever the route changes
  const { pathname } = useLocation()
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setCatalogOpen(false)
    setSearchOpen(false)
    setQuery(routeQuery)
  }
  // Design phase: shared mock cart. Wiring: useCartCount()
  const cartCount = mockCart.count
  const { data: fav } = useFavouritesCount()

  const lang = useLang()
  const shortcuts = [
    ...categories.slice(0, 3).map((c, i) => ({
      to: paths.category(c.guid),
      icon: [FileText, PackageOpen, FolderOpen][i],
      label: localized(c, 'name', lang),
    })),
    { to: `${paths.products}?type=super_discount`, icon: BadgePercent, label: t('footer.promotions') },
  ]

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
            <HeaderAction to={paths.favourites} icon={<Heart size={22} />} label={t('nav.favorites_label')} count={fav?.data?.count} />
            <HeaderAction to={paths.cart} icon={<ShoppingCart size={22} />} label={t('nav.cart_label')} count={cartCount} />
            <HeaderAction
              to={authStore.isAuthorized ? paths.profile.root : paths.auth.login}
              icon={<User size={22} />}
              label={t('nav.profile_label')}
            />
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

        <Flex hideBelow="md" h="40px" align="center" justify="space-between" fontSize="sm" color="fg.body">
          {/* Same 4 shortcuts as the live header */}
          <HStack gap="6">
            {shortcuts.map(({ to, icon: Icon, label }) => (
              <Link key={label} asChild color="fg.body" gap="2" _hover={{ color: 'fg.default' }}>
                <RouterLink to={to}>
                  <Icon size={16} /> {label}
                </RouterLink>
              </Link>
            ))}
          </HStack>
          <HStack gap="6">
            <Link href="tel:+998781484444" color="fg.body" gap="2">
              <Phone size={14} /> +998 78 148 44 44
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
