import type { PropsWithChildren } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/api/query-client'
import { system } from '@/shared/theme/system'
import { Toaster } from '@/shared/ui/toaster'

export const AppProviders = ({ children }: PropsWithChildren) => (
  <ChakraProvider value={system}>
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  </ChakraProvider>
)
