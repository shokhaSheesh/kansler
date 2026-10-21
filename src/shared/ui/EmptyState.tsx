import { Flex, Image, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import emptyArt from '@/shared/assets/empty.svg'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  /** md: page-level card. sm: inside dropdowns / previews. */
  size?: 'md' | 'sm'
  /** Without the white card (when the parent is already a card). */
  bare?: boolean
}

/** One empty-state illustration for every empty page (cart, favourites, search, lists, orders…). */
export const EmptyState = ({ title, description, action, size = 'md', bare }: EmptyStateProps) => {
  const sm = size === 'sm'
  return (
    <Flex
      direction="column"
      align="center"
      textAlign="center"
      gap="2"
      py={sm ? 6 : { base: 10, md: 14 }}
      px="6"
      {...(bare || sm ? {} : { bg: 'bg.surface', borderRadius: 'modal', borderWidth: '1px', borderColor: 'border.subtle' })}
    >
      <Image src={emptyArt} alt="" w={sm ? '120px' : { base: '180px', md: '220px' }} mb={sm ? 1 : 3} draggable={false} />
      <Text fontSize={sm ? 'md' : 'lg'} fontWeight="700" color="fg.default">
        {title}
      </Text>
      {description && (
        <Text fontSize="sm" color="fg.muted" maxW="360px">
          {description}
        </Text>
      )}
      {action && <Flex mt={sm ? 2 : 4}>{action}</Flex>}
    </Flex>
  )
}
