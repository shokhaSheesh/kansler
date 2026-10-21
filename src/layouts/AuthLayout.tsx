import { Box, Center, Flex, Image } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { Link, Navigate, Outlet, useSearchParams } from 'react-router'
import logo from '@/shared/assets/logo.png'
import { paths } from '@/app/router/paths'
import { authStore } from '@/stores/auth.store'

/** Focused full-page auth (multi-step B2B register), brand panel on desktop. */
export const AuthLayout = observer(() => {
  const [params] = useSearchParams()
  if (authStore.isAuthorized) return <Navigate to={params.get('redirect') ?? paths.home} replace />

  return (
    <Flex minH="100dvh">
      <Box hideBelow="lg" flex="1" bg="bg.inverted" pos="relative" overflow="hidden">
        <Box pos="absolute" w="420px" h="420px" borderRadius="full" bg="accent.main" opacity="0.12" bottom="-120px" right="-120px" />
      </Box>
      <Center flex="1" p={{ base: 4, md: 10 }} bg="bg.surface">
        <Box w="full" maxW="420px">
          <Link to={paths.home}>
            <Image src={logo} alt="Kansler" h="32px" mb="10" />
          </Link>
          <Outlet />
        </Box>
      </Center>
    </Flex>
  )
})
