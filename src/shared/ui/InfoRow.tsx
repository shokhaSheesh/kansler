import { Box, Flex } from '@chakra-ui/react'
import type { ReactNode } from 'react'

/** Icon tile + title + optional sub-line. Used for delivery / payment / order info blocks. */
export const InfoRow = ({ icon, title, sub }: { icon: ReactNode; title: ReactNode; sub?: ReactNode }) => (
  <Flex gap="3" align="flex-start">
    <Flex boxSize="36px" flexShrink="0" align="center" justify="center" bg="bg.muted" borderRadius="primary" color="fg.body">
      {icon}
    </Flex>
    <Box minW="0" flex="1">
      <Box fontSize="sm" color="fg.default" fontWeight="500">
        {title}
      </Box>
      {sub && (
        <Box fontSize="xs" color="fg.muted" mt="0.5">
          {sub}
        </Box>
      )}
    </Box>
  </Flex>
)
