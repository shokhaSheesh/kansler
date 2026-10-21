import { Flex, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'
import { Heart, Home, LayoutGrid, ShoppingCart, User } from 'lucide-react'
import { paths } from '@/app/router/paths'

/** Replaces the old `/mobile*` routes: one responsive app with a bottom tab bar under `md`. */
export const MobileTabBar = () => {
  const { t } = useTranslation()
  const tabs = [
    { to: paths.home, icon: Home, label: t('nav.main') },
    { to: paths.catalog, icon: LayoutGrid, label: t('nav.catalog') },
    { to: paths.cart, icon: ShoppingCart, label: t('nav.cart') },
    { to: paths.favourites, icon: Heart, label: t('nav.favourites') },
    { to: paths.profile.root, icon: User, label: t('nav.profile') },
  ]
  return (
    <Flex
      as="nav"
      hideFrom="md"
      pos="fixed"
      bottom="0"
      insetX="0"
      zIndex="sticky"
      bg="bg.surface"
      borderTopWidth="1px"
      borderColor="border.subtle"
      h="64px"
      pb="env(safe-area-inset-bottom)"
    >
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} style={{ flex: 1 }}>
          {({ isActive }) => (
            <Flex direction="column" align="center" justify="center" h="full" gap="1" color={isActive ? 'navy.900' : 'fg.subtle'}>
              <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />
              <Text fontSize="2xs" fontWeight={isActive ? '600' : '500'}>
                {label}
              </Text>
            </Flex>
          )}
        </NavLink>
      ))}
    </Flex>
  )
}
