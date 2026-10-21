import { Badge, Box, Flex, Link, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router'

/** Count badge; re-keyed on change so it "bumps" every time the number moves. */
export const CountBadge = ({ count }: { count?: number }) =>
  count ? (
    <Badge
      key={count}
      pos="absolute"
      top="-2"
      right="-3"
      size="xs"
      minW="18px"
      justifyContent="center"
      borderRadius="full"
      bg="primary.main"
      color="white"
      css={{ animation: 'badge-bump .35s ease-out' }}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  ) : null

export const HeaderAction = ({ to, icon, label, count }: { to: string; icon: ReactNode; label: string; count?: number }) => (
  <Link asChild _hover={{ textDecoration: 'none', color: 'navy.900' }} color="fg.body">
    <RouterLink to={to}>
      <Flex direction="column" align="center" gap="1" minW="64px" pos="relative">
        <Box pos="relative">
          {icon}
          <CountBadge count={count} />
        </Box>
        <Text fontSize="xs" fontWeight="500">
          {label}
        </Text>
      </Flex>
    </RouterLink>
  </Link>
)
