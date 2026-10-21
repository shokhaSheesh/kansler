import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { BackButton } from '@/shared/ui/BackButton'

/** Sign-up has 4 steps: company → contact → SMS code → password */
const STEPS = 4

/** Step title with an optional back button, step progress (sign-up only) and text under it. */
export const AuthHeading = ({ title, back, step, children }: { title: string; back?: string; step?: number; children?: ReactNode }) => (
  <Stack gap="3" mb="6">
    {back && (
      <Box>
        <BackButton fallback={back} />
      </Box>
    )}
    {step && (
      <Flex gap="1.5" aria-hidden>
        {Array.from({ length: STEPS }, (_, i) => (
          <Box key={i} flex="1" h="4px" borderRadius="full" bg={i < step ? 'navy.900' : 'kgray.150'} transition="background .3s" />
        ))}
      </Flex>
    )}
    <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700" letterSpacing="-0.01em">
      {title}
    </Heading>
    {children && (
      <Text fontSize="sm" color="fg.muted">
        {children}
      </Text>
    )}
  </Stack>
)
