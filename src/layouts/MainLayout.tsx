import { Box, Flex } from '@chakra-ui/react'
import { Outlet, ScrollRestoration } from 'react-router'
import { Header } from '@/widgets/header/Header'
import { Footer } from '@/widgets/footer/Footer'
import { MobileTabBar } from '@/widgets/mobile-tab-bar/MobileTabBar'
import { Container } from '@/shared/ui/Container'

export const MainLayout = () => (
  <Flex direction="column" minH="100dvh">
    <Header />
    <Box as="main" flex="1" py={{ base: 4, md: 6 }}>
      <Container>
        <Outlet />
      </Container>
    </Box>
    <Footer />
    <MobileTabBar />
    <ScrollRestoration />
  </Flex>
)
