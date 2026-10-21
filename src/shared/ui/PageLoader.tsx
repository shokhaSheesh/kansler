import { Center, Spinner } from '@chakra-ui/react'

export const PageLoader = () => (
  <Center minH="40vh">
    <Spinner size="lg" color="navy.900" borderWidth="3px" />
  </Center>
)
