import { Badge, Box, Button, Flex, IconButton, Input, Link, Separator, Stack, Text } from '@chakra-ui/react'
import { Lock, Ticket, X } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { mockCheckout, SAMPLE_PROMOS } from '@/mocks/checkout.store'
import { useLang } from '@/shared/hooks/useLang'
import { formatPrice } from '@/shared/lib/format'
import { SummaryRow } from '@/shared/ui/SummaryRow'
import { tintedPanel } from '@/shared/ui/surface'

/**
 * Live summary: "Ваша корзина" — Товары (N), Доставка (or Бесплатно), VIP скидка, Промокод (removable), Скидка,
 * Итого, then "Оплатить N сум" (card) / "Оформить заказ" (transfer), consent text, "Соединение защищено".
 */
export const CheckoutSummary = observer(({ onSubmit, busy }: { onSubmit: () => void; busy?: boolean }) => {
  const { t } = useTranslation()
  const lang = useLang()
  const c = mockCheckout
  const p = c.prices
  const [promoOpen, setPromoOpen] = useState(false)
  const [code, setCode] = useState('')
  const [promoError, setPromoError] = useState('')

  const applyPromo = () => {
    const key = code.trim().toUpperCase()
    const promo = SAMPLE_PROMOS[key]
    const goods = p.totalPrice - p.total_discount
    if (!promo) return setPromoError(t('order.checkout.promocode_invalid'))
    if (promo.expired) return setPromoError(t('order.checkout.promocode_expired'))
    if (promo.minPrice && goods < promo.minPrice) return setPromoError(t('order.making.promocode_min_price', { price: formatPrice(promo.minPrice, lang).replace(/\s\S+$/, '') }))
    c.setPromo({ code: key, percent: promo.percent ?? 0 })
    setPromoOpen(false)
    setCode('')
    setPromoError('')
  }

  return (
    <Stack gap="4" {...tintedPanel} p={{ base: 4, md: 6 }}>
      <Text fontSize="lg" fontWeight="700">
        {t('cart.your_cart')}
      </Text>
      <Stack gap="2.5">
        <SummaryRow label={`${t('profile.info.products')} (${p.items}):`} value={formatPrice(p.totalPrice, lang)} />
        <SummaryRow label={`${t('order.making.delivery')}:`} value={p.delivery_cost > 0 ? formatPrice(p.delivery_cost, lang) : t('order.checkout.delivery_free')} accent={p.delivery_cost === 0} />
        {c.promo && (
          <Flex justify="space-between" fontSize="sm" align="center">
            <Flex align="center" gap="1.5" color="fg.muted">
              {t('order.making.promocode')}
              <Badge size="sm" bg="navy.900" color="white" borderRadius="full">
                {c.promo.code}
              </Badge>
              <IconButton aria-label="remove promo" size="2xs" variant="ghost" onClick={() => c.setPromo(null)}>
                <X size={12} />
              </IconButton>
            </Flex>
            <Text fontWeight="600" color="fg.discount">
              −{formatPrice(p.promocodeDiscount, lang)}
            </Text>
          </Flex>
        )}
        {p.total_discount > 0 && <SummaryRow label={`${t('order.making.discount')}:`} value={`−${formatPrice(p.total_discount, lang)}`} />}
      </Stack>

      {!c.promo &&
        (promoOpen ? (
          <Stack gap="1.5">
            <Flex gap="2">
              <Input
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setPromoError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                placeholder={t('order.making.promocode_placeholder')}
                h="44px"
                borderRadius="control"
                textTransform="uppercase"
              />
              <Button h="44px" borderRadius="control" variant="outline" onClick={applyPromo} disabled={!code.trim()}>
                {t('order.making.apply_promocode')}
              </Button>
            </Flex>
            {promoError && (
              <Text fontSize="xs" color="fg.error">
                {promoError}
              </Text>
            )}
          </Stack>
        ) : (
          <Button variant="outline" borderStyle="dashed" h="44px" borderRadius="control" gap="2" color="fg.body" onClick={() => setPromoOpen(true)}>
            <Ticket size={16} />
            {t('order.making.add_promocode')}
          </Button>
        ))}

      <Separator borderColor="border.subtle" />
      <Flex justify="space-between" align="baseline">
        <Text fontWeight="600">{t('order.making.total')}</Text>
        <Text fontSize="2xl" fontWeight="800">
          {formatPrice(p.final_price, lang)}
        </Text>
      </Flex>

      <Box hideBelow="md">
        <Button w="full" h="54px" colorPalette="brand" borderRadius="control" fontSize="md" loading={busy} onClick={onSubmit}>
          {c.paymentType === 'corporate'
            ? t('order.checkout.pay', { price: formatPrice(p.final_price, lang).replace(/\s\S+$/, '') })
            : t('order.checkout.create_order')}
        </Button>
      </Box>

      <Text fontSize="xs" color="fg.muted" lineHeight="1.6">
        {t('order.checkout.acception_rules.one')}{' '}
        <Link href="#" color="fg.link">
          {t('order.checkout.acception_rules.two')}
        </Link>{' '}
        <Link href="#" color="fg.link">
          {t('order.checkout.acception_rules.four')}
        </Link>
        {t('order.checkout.acception_rules.five')}
      </Text>
      <Flex align="center" gap="1.5" fontSize="xs" color="fg.muted" justify="center">
        <Lock size={13} />
        {t('order.detail.secure_connection')}
      </Flex>
    </Stack>
  )
})
