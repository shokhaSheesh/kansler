import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import { Check, Package, Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { OrderStatus } from '@/mocks/orders.store'
import { STEP } from './progress'


const STEPS = [
  { key: 'collecting', icon: Package },
  { key: 'on_the_way', icon: Truck },
  { key: 'delivered', icon: Check },
] as const

/** Live 3-stage delivery progress: Собирается → В пути → Доставлен. */
export const OrderProgress = ({ status }: { status: OrderStatus }) => {
  const { t } = useTranslation()
  const current = STEP[status] ?? 0
  return (
    <Stack gap="3">
      <Flex align="center">
        {STEPS.map(({ key, icon: Icon }, i) => {
          const done = i <= current
          return (
            <Flex key={key} align="center" flex={i ? 1 : 'none'}>
              {i > 0 && <Box flex="1" h="4px" mx="2" borderRadius="full" bg={done ? 'green.500' : 'kgray.150'} transition="background .3s" />}
              <Flex
                boxSize={{ base: '40px', md: '44px' }}
                flexShrink="0"
                align="center"
                justify="center"
                borderRadius="full"
                bg={done ? 'green.500' : 'bg.tile'}
                color={done ? 'white' : 'fg.subtle'}
                boxShadow={i === current ? '0 0 0 5px var(--chakra-colors-green-100)' : undefined}
              >
                <Icon size={20} strokeWidth={i === 2 ? 3 : 2} />
              </Flex>
            </Flex>
          )
        })}
      </Flex>
      <Flex justify="space-between">
        {STEPS.map(({ key }, i) => (
          <Text
            key={key}
            fontSize="sm"
            fontWeight={i === current ? '700' : '500'}
            color={i <= current ? 'fg.default' : 'fg.muted'}
            textAlign={i === 0 ? 'start' : i === 2 ? 'end' : 'center'}
            flex="1"
          >
            {t(`order.detail_page.steps.${key}`)}
          </Text>
        ))}
      </Flex>
    </Stack>
  )
}
