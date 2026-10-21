import { Box, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import type { OrderStatus } from '@/mocks/orders.store'

// Same colour per status as the live site
const TONE: Record<OrderStatus, string> = {
  delivered: 'green',
  paid: 'green',
  'in-progress': 'yellow',
  assembling: 'yellow',
  waiting: 'gray',
  shipping: 'blue',
  cancelled: 'red',
}

/** Status pill ("Собирается", "Доставлен"…), texts from profile.company.orders.status. */
export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const { t } = useTranslation()
  const tone = TONE[status] ?? 'gray'
  // Russian has no status."in-progress" text (the live site shows the raw key); the tab name says the same thing
  const label = status === 'in-progress' ? t('profile.company.orders.tabs.in_progress') : t(`profile.company.orders.status.${status}`)
  return (
    <Flex
      display="inline-flex"
      align="center"
      gap="1.5"
      px="2.5"
      py="1"
      borderRadius="full"
      bg={`${tone}.50`}
      color={`${tone}.700`}
      fontSize="xs"
      fontWeight="600"
      whiteSpace="nowrap"
    >
      <Box boxSize="6px" borderRadius="full" bg={`${tone}.500`} />
      {label}
    </Flex>
  )
}
