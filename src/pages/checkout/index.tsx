import { Accordion, Badge, Box, Button, Flex, Grid, Heading, Image, Separator, Stack, Text } from '@chakra-ui/react'
import { ChevronRight, Download, MapPin, UserRound } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useParams } from 'react-router'
import { paths } from '@/app/router/paths'
import { mockCart } from '@/mocks/cart.store'
import { mockCheckout } from '@/mocks/checkout.store'
import { useLang } from '@/shared/hooks/useLang'
import { formatPrice } from '@/shared/lib/format'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { OtpDialog } from '@/shared/ui/OtpDialog'
import { toaster } from '@/shared/ui/toaster'
import { AddCardDialog } from '@/widgets/checkout/AddCardDialog'
import { CheckoutSummary } from '@/widgets/checkout/CheckoutSummary'
import { PaymentTypeCard } from '@/widgets/checkout/PaymentTypeCard'
import { PickerDialog } from '@/widgets/checkout/PickerDialog'

const card = { bg: 'bg.surface', borderRadius: 'card', borderWidth: '1px', borderColor: 'border.subtle' } as const

const ChoiceRow = ({ icon, label, value, sub, missing, error, onClick }: { icon: ReactNode; label: string; value: string; sub?: string; missing?: boolean; error?: string; onClick: () => void }) => (
  <Flex as="button" w="full" textAlign="start" align="center" gap="3" py="3.5" onClick={onClick} _hover={{ '& .chev': { transform: 'translateX(2px)' } }}>
    <Flex boxSize="40px" flexShrink="0" align="center" justify="center" bg="bg.muted" borderRadius="primary" color="fg.body">
      {icon}
    </Flex>
    <Box flex="1" minW="0">
      <Text fontSize="xs" color="fg.muted">
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="600" color={missing ? 'fg.link' : 'fg.default'} lineClamp="2">
        {value}
      </Text>
      {sub && (
        <Text fontSize="xs" color="fg.muted">
          {sub}
        </Text>
      )}
      {error && (
        <Text fontSize="xs" color="fg.error" mt="0.5">
          {error}
        </Text>
      )}
    </Box>
    <Box className="chev" transition="transform .15s" color="fg.subtle">
      <ChevronRight size={18} />
    </Box>
  </Flex>
)

/**
 * /checkout/:orderId — same content as the live checkout:
 * Оформление заказа + ID заказа + Скачать КП · Доставить в / Информация о получателе (pickers) ·
 * Тип оплаты (card / transfer) · Ваш заказ (items) · summary with promo code, Итого, pay / create order,
 * consent, "Соединение защищено" · card payment confirmed by SMS code.
 */
const CheckoutPage = observer(() => {
  const { t } = useTranslation()
  const lang = useLang()
  const navigate = useNavigate()
  const { id } = useParams()
  const c = mockCheckout
  const [addressOpen, setAddressOpen] = useState(false)
  const [receiverOpen, setReceiverOpen] = useState(false)
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [otp, setOtp] = useState<null | 'pay' | 'card'>(null)
  const [pendingCard, setPendingCard] = useState('')
  const [receiverError, setReceiverError] = useState(false)
  const [busy, setBusy] = useState(false)

  // Design phase: the order lives in memory; a reload (or a direct visit) goes back to the cart
  if (!c.orderId || c.orderId !== id) return <Navigate to={paths.cart} replace />

  const p = c.prices
  const done = () => {
    mockCart.remove(c.lines.map((l) => l.variation.guid))
    toaster.create({ type: 'success', title: t('order.success_message'), duration: 4000 })
    navigate(paths.orders)
  }

  const submit = () => {
    if (!c.address) {
      toaster.create({ type: 'error', title: t('order.checkout.select_region'), duration: 3000 })
      setAddressOpen(true)
      return
    }
    if (!c.receiver) {
      setReceiverError(true)
      toaster.create({ type: 'error', title: t('order.checkout.select_user_error'), duration: 3000 })
      setReceiverOpen(true)
      return
    }
    if (c.paymentType === 'corporate') {
      if (!c.card) return setAddCardOpen(true)
      setOtp('pay')
      return
    }
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      done()
    }, 700)
  }

  return (
    <Stack gap={{ base: 5, md: 6 }} pb={{ base: '84px', md: 0 }}>
      <Stack gap="2">
        <Breadcrumbs items={[{ label: t('favourites.breadcrumb.home'), to: paths.home }, { label: t('cart.title'), to: paths.cart }, { label: t('order.checkout.order_title') }]} />
        <Flex align="center" gap="3" wrap="wrap">
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700">
            {t('order.checkout.order_title')}
          </Heading>
          <Badge size="md" variant="subtle" borderRadius="full" px="2.5" color="fg.body">
            {t('order.detail_page.summary.id')}: {c.orderId}
          </Badge>
          <Box flex="1" />
          {/* Live: downloads the commercial offer (KP) PDF generated for this order */}
          <Button variant="outline" size="sm" h="40px" borderRadius="primary" gap="2" bg="bg.surface">
            <Download size={16} />
            {t('order.checkout.download')}
          </Button>
        </Flex>
      </Stack>

      <Grid templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 400px' }} gap="6" alignItems="start">
        <Stack gap="4" minW="0">
          <Box {...card} px={{ base: 4, md: 6 }} py="2">
            <Text fontSize="lg" fontWeight="700" pt="3" pb="1">
              {t('order.checkout.delivery_info')}
            </Text>
            <ChoiceRow
              icon={<MapPin size={18} />}
              label={t('order.checkout.delivery_location')}
              value={c.address?.address ?? t('order.checkout.select_region')}
              sub={c.address?.comment}
              missing={!c.address}
              onClick={() => setAddressOpen(true)}
            />
            <Separator borderColor="border.subtle" />
            <ChoiceRow
              icon={<UserRound size={18} />}
              label={t('order.checkout.delivery_owner')}
              // Live asks for 'order.checkout.select_user', which is a group of texts (shows a key error); the placeholder text is select_user_error
              value={c.receiver?.fullname ?? t('order.checkout.select_user_error')}
              sub={c.receiver?.phone}
              missing={!c.receiver}
              error={receiverError && !c.receiver ? t('order.checkout.select_user_error') : undefined}
              onClick={() => setReceiverOpen(true)}
            />
          </Box>

          <PaymentTypeCard onAddCard={() => setAddCardOpen(true)} />

          <Box {...card} px={{ base: 4, md: 6 }}>
            <Accordion.Root collapsible defaultValue={['items']} variant="plain">
              <Accordion.Item value="items">
                <Accordion.ItemTrigger py="4" cursor="pointer">
                  <Text flex="1" textAlign="start" fontSize="lg" fontWeight="700">
                    {t('order.checkout.orders_label')}{' '}
                    <Text as="span" color="fg.muted" fontWeight="500" fontSize="md">
                      ({p.items})
                    </Text>
                  </Text>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody pt="0" pb="3">
                    <Stack gap="0" separator={<Separator borderColor="border.subtle" />}>
                      {c.lines.map((l) => (
                        <Flex key={l.variation.guid} gap="3" py="3" align="center">
                          <Box boxSize="56px" flexShrink="0" bg="kgray.50" borderRadius="primary" overflow="hidden">
                            <Image src={l.variation.image[0]} alt="" w="full" h="full" fit="contain" p="1" mixBlendMode="multiply" />
                          </Box>
                          <Box flex="1" minW="0">
                            <Text fontSize="sm" color="fg.default" lineClamp="1">
                              {l.name}
                            </Text>
                            <Text fontSize="xs" color="fg.muted">
                              {l.qty} × {formatPrice(l.price, lang)}
                            </Text>
                          </Box>
                          <Text fontSize="sm" fontWeight="700" whiteSpace="nowrap">
                            {formatPrice(l.qty * l.price, lang)}
                          </Text>
                        </Flex>
                      ))}
                    </Stack>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            </Accordion.Root>
          </Box>
        </Stack>

        <Box pos={{ lg: 'sticky' }} top={{ lg: '128px' }}>
          <CheckoutSummary onSubmit={submit} busy={busy} />
        </Box>
      </Grid>

      {/* Phone: total + pay always in reach */}
      <Flex hideFrom="md" pos="fixed" left="0" right="0" bottom="64px" zIndex="sticky" bg="bg.surface" borderTopWidth="1px" borderColor="border.subtle" px="4" py="2.5" gap="3" align="center" boxShadow="0 -4px 16px rgba(16, 24, 40, 0.06)">
        <Box flexShrink="0">
          <Text fontSize="xs" color="fg.muted">
            {t('order.making.total')}
          </Text>
          <Text fontWeight="800">{formatPrice(p.final_price, lang)}</Text>
        </Box>
        <Button flex="1" h="48px" colorPalette="brand" borderRadius="control" loading={busy} onClick={submit}>
          {c.paymentType === 'corporate' ? t('order.checkout.pay', { price: formatPrice(p.final_price, lang).replace(/\s\S+$/, '') }) : t('order.checkout.create_order')}
        </Button>
      </Flex>

      <PickerDialog
        open={addressOpen}
        onOpenChange={setAddressOpen}
        title={t('order.add_location.add_title')}
        items={c.addresses.map((a) => ({ id: a.guid, title: a.address, sub: a.comment }))}
        selectedId={c.addressId}
        onSelect={(i) => c.setAddress(i)}
        addLabel={t('order.address_select.add_address')}
        addHref={paths.map}
      />
      <PickerDialog
        open={receiverOpen}
        onOpenChange={setReceiverOpen}
        title={t('order.checkout.select_user.title')}
        items={c.receivers.map((r) => ({ id: r.guid, title: r.fullname, sub: r.phone }))}
        selectedId={c.receiverId}
        onSelect={(i) => {
          c.setReceiver(i)
          setReceiverError(false)
        }}
        addLabel={t('order.checkout.select_user.add_user')}
        addHref={paths.profile.recipientForm}
      />
      <AddCardDialog
        open={addCardOpen}
        onOpenChange={setAddCardOpen}
        onSubmit={(pan) => {
          setPendingCard(pan.slice(-4))
          setAddCardOpen(false)
          setOtp('card')
        }}
      />
      <OtpDialog
        open={otp !== null}
        onOpenChange={(o) => !o && setOtp(null)}
        phone={c.userPhone}
        onConfirm={async (code) => {
          // Design phase: any 6 digits except 000000 succeed (000000 shows the error state)
          await new Promise((r) => setTimeout(r, 500))
          if (code === '000000') return false
          if (otp === 'card') {
            c.addCard(pendingCard)
            toaster.create({ type: 'success', title: t('order.otp.success'), duration: 2500 })
          } else done()
          setOtp(null)
          return true
        }}
      />
    </Stack>
  )
})

export default CheckoutPage
