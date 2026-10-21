import { Flex, Progress, Separator, Stack, Text } from '@chakra-ui/react'
import { Building2, CreditCard, MapPin, Truck } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import type { ProductDetails } from '@/entities/product/types'
import { mockCart } from '@/mocks/cart.store'
import { useLang } from '@/shared/hooks/useLang'
import { formatPrice } from '@/shared/lib/format'
import { InfoRow } from '@/shared/ui/InfoRow'

/** Delivery + payment, from the product response (delivery_cost, free_delivery_min_sum) and the live payment options. */
export const DeliveryPayment = observer(function DeliveryPayment({ product }: { product: ProductDetails }) {
  const { t } = useTranslation()
  const lang = useLang()
  const total = mockCart.total
  const min = product.free_delivery_min_sum
  const left = Math.max(0, min - total)
  const free = total > 0 && left === 0

  return (
    <Stack gap="4" p="4" bg="bg.surface" borderRadius="card" borderWidth="1px" borderColor="border.subtle">
      <Text fontWeight="600" fontSize="sm">
        {t('product_detail.delivery_terms')}
      </Text>
      <InfoRow
        icon={<Truck size={18} />}
        title={
          <Flex justify="space-between" gap="2">
            <span>{t('product_detail.courier')}</span>
            <span>{free ? t('product_detail.free') : formatPrice(product.delivery_cost, lang)}</span>
          </Flex>
        }
        sub={
          <Stack gap="1.5" mt="1">
            <Progress.Root value={Math.min(100, (total / min) * 100)} size="xs" colorPalette={free ? 'green' : 'gray'}>
              <Progress.Track bg="bg.muted" borderRadius="full">
                <Progress.Range bg={free ? 'accent.success' : 'navy.900'} />
              </Progress.Track>
            </Progress.Root>
            <Text color={free ? 'accent.success' : 'fg.muted'} fontWeight={free ? '600' : '400'}>
              {free ? t('cart.free_delivery') : `${formatPrice(left, lang)} ${t('cart.to_free_delivery')}`}
            </Text>
          </Stack>
        }
      />
      <InfoRow icon={<MapPin size={18} />} title={t('product_detail.warehouse_subtitle')} sub={t('product_detail.warehouse_address')} />
      <Text fontSize="xs" color="fg.subtle">
        {t('order.making.delivery_cost_note')}
      </Text>

      <Separator borderColor="border.subtle" />
      <Text fontWeight="600" fontSize="sm">
        {t('product_detail.payment_terms')}
      </Text>
      <InfoRow icon={<CreditCard size={18} />} title={t('order.checkout.payment.corporate')} />
      <InfoRow icon={<Building2 size={18} />} title={t('order.checkout.payment.transfer')} />
    </Stack>
  )
})

