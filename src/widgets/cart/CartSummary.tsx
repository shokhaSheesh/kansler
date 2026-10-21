import { Box, Button, Flex, Link, Progress, Separator, Stack, Text } from '@chakra-ui/react'
import { Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLang } from '@/shared/hooks/useLang'
import { formatPrice } from '@/shared/lib/format'

export const SUPPORT_BOT = 'https://t.me/Kansler_CustomerCare_bot'

/** Live: "N сум до бесплатной доставки" + progress, or "Бесплатная доставка" once reached (cart.delivery.free_from). */
export const FreeDeliveryProgress = ({ total, freeFrom }: { total: number; freeFrom: number }) => {
  const { t } = useTranslation()
  const lang = useLang()
  if (!freeFrom) return null
  const left = freeFrom - total
  if (left <= 0) {
    return (
      <Flex gap="2.5" align="center" color="accent.success" fontWeight="600" fontSize="sm">
        <Truck size={20} />
        {t('cart.free_delivery')}
      </Flex>
    )
  }
  return (
    <Stack gap="2.5">
      <Flex gap="2.5" align="center" fontSize="sm" fontWeight="500" color="fg.default">
        <Truck size={20} />
        <Text>
          {formatPrice(left, lang)} {t('cart.to_free_delivery')}
        </Text>
      </Flex>
      <Progress.Root value={Math.min(100, (total / freeFrom) * 100)} size="sm">
        <Progress.Track bg="kgray.150" borderRadius="full">
          <Progress.Range bg="navy.900" />
        </Progress.Track>
      </Progress.Root>
    </Stack>
  )
}

/** Live "Ваш заказ" card: free-delivery progress, Товары (N), Итого, "Перейти к оформлению", support bot link. */
export const CartSummary = ({ count, total, freeFrom, onCheckout }: { count: number; total: number; freeFrom: number; onCheckout: () => void }) => {
  const { t } = useTranslation()
  const lang = useLang()
  return (
    <Stack gap="5" bg="bg.surface" borderRadius="card" borderWidth="1px" borderColor="border.subtle" p={{ base: 5, md: 6 }}>
      <FreeDeliveryProgress total={total} freeFrom={freeFrom} />
      <Box>
        <Text fontSize="xl" fontWeight="700" color="fg.default" mb="3">
          {t('cart.order_title')}
        </Text>
        <Flex justify="space-between" fontSize="sm">
          <Text color="fg.muted">
            {t('cart.items_label')} ({count}):
          </Text>
          <Text fontWeight="600" color="fg.default">
            {formatPrice(total, lang)}
          </Text>
        </Flex>
      </Box>
      <Separator borderColor="border.subtle" />
      <Flex justify="space-between" align="baseline">
        <Text fontWeight="600" color="fg.default">
          {t('cart.total')}
        </Text>
        <Text fontSize="2xl" fontWeight="800" color="fg.default">
          {formatPrice(total, lang)}
        </Text>
      </Flex>
      <Box hideBelow="md">
        <Button w="full" h="54px" colorPalette="brand" borderRadius="control" fontSize="md" disabled={count === 0} onClick={onCheckout}>
          {t('cart.proceed_to_checkout')}
        </Button>
      </Box>
      <Link href={SUPPORT_BOT} target="_blank" rel="noreferrer" fontSize="sm" color="fg.muted" mt="-2" _hover={{ color: 'fg.link' }}>
        {t('cart.telegram_link')}
      </Link>
    </Stack>
  )
}
