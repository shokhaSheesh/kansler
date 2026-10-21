import { Badge, Box, Flex, Link, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router'

export const HeaderAction = ({ to, icon, label, count }: { to: string; icon: ReactNode; label: string; count?: number }) => (
  <Link asChild _hover={{ textDecoration: 'none', color: 'navy.900' }} color="fg.body">
    <RouterLink to={to}>
      <Flex direction="column" align="center" gap="1" minW="64px" pos="relative">
        <Box pos="relative">
          {icon}
          {!!count && (
            <Badge pos="absolute" top="-2" right="-3" size="xs" borderRadius="full" bg="primary.main" color="white">
              {count > 99 ? '99+' : count}
            </Badge>
          )}
        </Box>
        <Text fontSize="xs" fontWeight="500">
          {label}
        </Text>
      </Flex>
    </RouterLink>
  </Link>
)
