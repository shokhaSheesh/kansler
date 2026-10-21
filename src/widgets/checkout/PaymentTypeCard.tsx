import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import { ChevronRight, FileText, Plus } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { mockCheckout, type PaymentType } from '@/mocks/checkout.store'

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
    <Stack gap="4" bg="bg.surface" borderRadius="card" borderWidth="1px" borderColor="border.subtle" p={{ base: 4, md: 6 }}>
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
        <Flex gap="3" overflowX="auto" pb="1" css={{ scrollbarWidth: 'thin' }}>
          {c.cards.map((card) => {
            const on = card.guid === c.cardId
            return (
              <Stack
                key={card.guid}
                as="button"
                gap="5"
                textAlign="start"
                minW="168px"
                h="100px"
                p="3.5"
                borderRadius="control"
                bg={on ? 'navy.900' : 'bg.surface'}
                color={on ? 'white' : 'fg.default'}
                borderWidth="2px"
                borderColor={on ? 'navy.900' : 'border.subtle'}
                justify="space-between"
                onClick={() => c.setCard(card.guid)}
              >
                <Text fontSize="xs" fontWeight="700" letterSpacing="0.06em" opacity={on ? 0.8 : 0.6}>
                  {card.type}
                </Text>
                <Text fontSize="md" fontWeight="600" letterSpacing="0.08em" fontVariantNumeric="tabular-nums">
                  •••• {card.last4}
                </Text>
              </Stack>
            )
          })}
          <Flex
            as="button"
            direction="column"
            align="center"
            justify="center"
            gap="1.5"
            minW="140px"
            h="100px"
            borderRadius="control"
            borderWidth="2px"
            borderStyle="dashed"
            borderColor="kgray.300"
            color="fg.muted"
            fontSize="sm"
            fontWeight="500"
            _hover={{ borderColor: 'navy.900', color: 'fg.default' }}
            onClick={onAddCard}
          >
            <Plus size={20} />
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
