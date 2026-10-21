import { Flex, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

/** "Label ........ value" row for order summaries (cart, checkout, order details). */
export const SummaryRow = ({ label, value, accent }: { label: ReactNode; value: ReactNode; accent?: boolean }) => (
  <Flex justify="space-between" fontSize="sm" gap="3">
    <Text color="fg.muted">{label}</Text>
    <Text fontWeight="600" color={accent ? 'accent.success' : 'fg.default'}>
      {value}
    </Text>
  </Flex>
)
