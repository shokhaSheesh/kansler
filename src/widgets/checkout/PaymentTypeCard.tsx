import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import { ChevronRight, FileText, Plus } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { mockCheckout, type PaymentType } from '@/mocks/checkout.store'
import { panel } from '@/shared/ui/surface'
import { BankCard, CARD_SIZE } from './BankCard'

const DIDOX_URL = 'https://didox.uz'

/**
 * Live "Тип оплаты": tabs Корпоративная карта | Перечисление.
 * Card: saved cards (masked) + dashed "Добавить карту". Transfer: "Посмотреть договор / Перейти в Didox".
 */
export const PaymentTypeCard = observer(({ onAddCard }: { onAddCard: () => void }) => {
  const { t } = useTranslation()
  const c = mockCheckout
  const tabs: PaymentType[] = ['corporate', 'transfer']

  return (
    <Stack gap="4" {...panel} p={{ base: 4, md: 6 }}>
      <Text fontSize="lg" fontWeight="700">
        {t('order.checkout.title')}
      </Text>
      <Flex bg="bg.muted" p="1" borderRadius="control" gap="1">
        {tabs.map((k) => {
          const on = c.paymentType === k
          return (
            <Box
              key={k}
              as="button"
              flex="1"
              h="40px"
              borderRadius="primary"
              fontSize="sm"
              fontWeight={on ? '600' : '500'}
              bg={on ? 'bg.surface' : 'transparent'}
              color={on ? 'fg.default' : 'fg.muted'}
              boxShadow={on ? '0 1px 3px rgba(16, 24, 40, 0.1)' : undefined}
              onClick={() => c.setPaymentType(k)}
            >
              {t(`order.checkout.payment.${k}`)}
            </Box>
          )
        })}
      </Flex>

      {c.paymentType === 'corporate' ? (
        // p/m give the selection ring room inside the scroll area
        <Flex gap="3" overflowX="auto" p="1" m="-1" scrollSnapType="x mandatory" css={{ scrollbarWidth: 'none' }}>
          {c.cards.map((card) => (
            <BankCard key={card.guid} card={card} selected={card.guid === c.cardId} onSelect={() => c.setCard(card.guid)} />
          ))}
          <Flex
            as="button"
            direction="column"
            align="center"
            justify="center"
            gap="2.5"
            {...CARD_SIZE}
            flexShrink="0"
            scrollSnapAlign="start"
            borderRadius="14px"
            borderWidth="1.5px"
            borderStyle="dashed"
            borderColor="kgray.300"
            bg="bg.panel"
            color="fg.muted"
            fontSize="sm"
            fontWeight="600"
            transition="border-color .2s, color .2s"
            _hover={{ borderColor: 'navy.900', color: 'fg.default', '& .plus': { transform: 'rotate(90deg)' } }}
            onClick={onAddCard}
          >
            <Flex className="plus" boxSize="36px" align="center" justify="center" bg="bg.surface" borderRadius="full" boxShadow="panel" transition="transform .25s">
              <Plus size={18} />
            </Flex>
            {t('order.checkout.add_card')}
          </Flex>
        </Flex>
      ) : (
        <Flex as="a" {...{ href: DIDOX_URL, target: '_blank', rel: 'noreferrer' }} align="center" gap="3" p="3.5" borderRadius="control" borderWidth="1px" borderColor="border.subtle" _hover={{ bg: 'bg.muted' }}>
          <Flex boxSize="40px" flexShrink="0" align="center" justify="center" bg="bg.muted" borderRadius="primary">
            <FileText size={20} />
          </Flex>
          <Box flex="1" minW="0">
            <Text fontSize="sm" fontWeight="600">
              {t('order.checkout.didox_agreement')}
            </Text>
            <Text fontSize="xs" color="fg.link">
              {t('order.checkout.didox_link')}
            </Text>
          </Box>
          <ChevronRight size={18} />
        </Flex>
      )}
    </Stack>
  )
})
