import { Box, Button, Flex, HStack, IconButton, Image, Input, InputGroup, Link } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router'
import { Heart, LayoutGrid, Package, Phone, Search, ShoppingCart, User } from 'lucide-react'
import logo from '@/shared/assets/logo.png'
import { Container } from '@/shared/ui/Container'
import { paths } from '@/app/router/paths'
import { authStore } from '@/stores/auth.store'
import { useCartCount } from '@/entities/cart/queries'
import { useFavouritesCount } from '@/entities/product/queries'
import { HeaderAction } from './HeaderAction'
import { LanguageSwitcher } from './LanguageSwitcher'

export const Header = observer(() => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { data: cart } = useCartCount()
  const { data: fav } = useFavouritesCount()

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q) navigate(paths.search(encodeURIComponent(q)))
  }

  return (
    <Box as="header" bg="bg.surface" borderBottomWidth="1px" borderColor="border.subtle" pos="sticky" top="0" zIndex="sticky">
      <Container>
        <Flex h={{ base: '60px', md: '72px' }} align="center" gap={{ base: 3, md: 6 }}>
          <RouterLink to={paths.home} aria-label="Kansler">
            <Image src={logo} alt="Kansler" h={{ base: '22px', md: '28px' }} />
          </RouterLink>

          <Button asChild hideBelow="md" colorPalette="brand" borderRadius="control" h="44px" px="5" gap="2">
            <RouterLink to={paths.catalog}>
              <LayoutGrid size={18} />
              {t('nav.catalog')}
            </RouterLink>
          </Button>

          <Box as="form" onSubmit={onSearch} flex="1" minW="0">
            <InputGroup startElement={<Search size={18} />}>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('nav.search_placeholder')}
                h="44px"
                bg="bg.muted"
                borderColor="transparent"
                borderRadius="control"
                _focus={{ bg: 'bg.surface', borderColor: 'navy.900' }}
              />
            </InputGroup>
          </Box>

          <HStack gap="1" hideBelow="md">
            <HeaderAction to={paths.orders} icon={<Package size={22} />} label={t('nav.orders_label')} />
            <HeaderAction to={paths.favourites} icon={<Heart size={22} />} label={t('nav.favorites_label')} count={fav?.data?.count} />
            <HeaderAction to={paths.cart} icon={<ShoppingCart size={22} />} label={t('nav.cart_label')} count={cart?.data?.count} />
            <HeaderAction
              to={authStore.isAuthorized ? paths.profile.root : paths.auth.login}
              icon={<User size={22} />}
              label={t('nav.profile_label')}
            />
          </HStack>

          <IconButton asChild hideFrom="md" variant="ghost" aria-label={t('nav.cart_label')}>
            <RouterLink to={paths.cart}>
              <ShoppingCart size={22} />
            </RouterLink>
          </IconButton>
        </Flex>

        <Flex hideBelow="md" h="40px" align="center" justify="space-between" fontSize="sm" color="fg.body">
          {/* TODO(redesign): top categories from useCategories(), mega-menu on hover */}
          <HStack gap="6" />
          <HStack gap="6">
            <Link href="tel:+998781484444" color="fg.body" gap="2">
              <Phone size={14} /> +998 78 148 44 44
            </Link>
            <LanguageSwitcher />
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
})
