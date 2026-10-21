import { Box, Flex, Image } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { Link, Navigate, Outlet, useSearchParams } from 'react-router'
import authImage from '@/shared/assets/auth-image.svg'
import logo from '@/shared/assets/logo.png'
import { paths } from '@/app/router/paths'
import { authStore } from '@/stores/auth.store'
import { LanguageSwitcher } from '@/widgets/header/LanguageSwitcher'

/**
 * Same split as the live /auth pages: the form on the left (logo + language on top),
 * the Kansler warehouse picture on the right (computers only).
 */
export const AuthLayout = observer(() => {
  const [params] = useSearchParams()
  if (authStore.isAuthorized) return <Navigate to={params.get('redirect') ?? paths.home} replace />

  return (
    <Flex minH="100dvh" bg="bg.surface">
      <Flex direction="column" flex="1" minW="0">
        <Flex as="header" w="full" maxW="440px" mx="auto" px={{ base: 4, md: 0 }} py="4" align="center" justify="space-between" pos="sticky" top="0" bg="bg.surface" zIndex="docked">
          <Link to={paths.home}>
            <Image src={logo} alt="Kansler" h="30px" />
          </Link>
          <LanguageSwitcher />
        </Flex>
        <Flex flex="1" justify="center" align={{ base: 'flex-start', md: 'center' }} px={{ base: 4, md: 6 }} pt={{ base: 4, md: 0 }} pb="10">
          <Box w="full" maxW="440px">
            <Outlet />
          </Box>
        </Flex>
      </Flex>
      <Box hideBelow="lg" flex="1" pos="sticky" top="0" h="100dvh" p="3">
        <Image src={authImage} alt="" w="full" h="full" fit="cover" borderRadius="modal" />
      </Box>
    </Flex>
  )
})
