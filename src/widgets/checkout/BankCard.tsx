import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import { Check } from 'lucide-react'
import type { Card } from '@/mocks/checkout.store'
import { palette } from '@/shared/theme/tokens'

// eslint-disable-next-line react-refresh/only-export-components
export const CARD_SIZE = { w: { base: '196px', md: '216px' }, aspectRatio: '1.586' } as const

// Brand navy shades only; the two card networks get different tones so they are told apart at a glance
const { navy, secondary } = palette
const CARD_BG: Record<string, string> = {
  UZCARD: `linear-gradient(135deg, ${navy[700]} 0%, ${navy[900]} 55%, ${navy.deep} 100%)`,
  HUMO: `linear-gradient(135deg, ${secondary.main} 0%, ${navy[800]} 50%, ${navy[900]} 100%)`,
}

/** Saved card drawn as a bank card: network, masked number, a tick on the selected one. */
export const BankCard = ({ card, selected, onSelect }: { card: Card; selected: boolean; onSelect: () => void }) => (
  <Stack
    as="button"
    aria-pressed={selected}
    {...CARD_SIZE}
    flexShrink="0"
    scrollSnapAlign="start"
    pos="relative"
    overflow="hidden"
    justify="space-between"
    textAlign="start"
    p="4"
    borderRadius="14px"
    color="white"
    bgImage={CARD_BG[card.type] ?? CARD_BG.UZCARD}
    outline="2px solid"
    outlineColor={selected ? 'navy.900' : 'transparent'}
    outlineOffset="3px"
    transition="transform .2s, box-shadow .2s, outline-color .2s"
    _hover={{ transform: 'translateY(-2px)', boxShadow: 'raised' }}
    // Soft light circles, a common bank-card texture
    _before={{ content: '""', pos: 'absolute', boxSize: '160px', borderRadius: 'full', top: '-70px', right: '-50px', bg: 'whiteAlpha.100' }}
    _after={{ content: '""', pos: 'absolute', boxSize: '120px', borderRadius: 'full', bottom: '-60px', left: '-30px', bg: 'whiteAlpha.50' }}
    onClick={onSelect}
  >
    <Flex justify="space-between" align="center" pos="relative" zIndex="1">
      {/* EMV chip */}
      <Box w="30px" h="22px" borderRadius="5px" bgImage={`linear-gradient(135deg, ${palette.gray[200]}, ${palette.gray[400]})`} opacity="0.9" />
      <Flex
        boxSize="22px"
        align="center"
        justify="center"
        borderRadius="full"
        bg={selected ? 'accent.main' : 'transparent'}
        borderWidth={selected ? 0 : '1.5px'}
        borderColor="whiteAlpha.600"
        color="navy.900"
      >
        {selected && <Check size={14} strokeWidth={3} />}
      </Flex>
    </Flex>
    <Flex justify="space-between" align="flex-end" gap="2" pos="relative" zIndex="1">
      <Text fontSize="md" fontWeight="600" letterSpacing="0.12em" fontVariantNumeric="tabular-nums" whiteSpace="nowrap">
        •••• {card.last4}
      </Text>
      <Text fontSize="xs" fontWeight="800" letterSpacing="0.04em" fontStyle="italic" opacity="0.85">
        {card.type}
      </Text>
    </Flex>
  </Stack>
)
