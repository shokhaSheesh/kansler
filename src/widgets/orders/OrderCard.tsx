import { Box, Button, Collapsible, Flex, Grid, IconButton, Image, Separator, Stack, Text } from '@chakra-ui/react'
import { ArrowRight, ChevronDown, Copy, RotateCcw } from 'lucide-react'
import { useState, type MouseEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router'
import { paths } from '@/app/router/paths'
import { mockCart } from '@/mocks/cart.store'
import { mockCheckout } from '@/mocks/checkout.store'
import { isPlaced, type Order } from '@/mocks/orders.store'
import { useLang } from '@/shared/hooks/useLang'
import { formatDate, formatPrice, localized } from '@/shared/lib/format'
import { panel } from '@/shared/ui/surface'
import { toaster } from '@/shared/ui/toaster'
import { OrderStatusBadge } from './OrderStatusBadge'

const THUMBS = 5
const stop = (e: MouseEvent) => e.stopPropagation()

const Meta = ({ label, children }: { label: string; children: ReactNode }) => (
  <Flex direction={{ base: 'row', md: 'column' }} justify={{ base: 'space-between', md: 'flex-start' }} alignSelf="start" gap={{ base: 3, md: 0.5 }} minW="0">
    <Text fontSize="xs" color="fg.muted" flexShrink="0">
      {label}
    </Text>
    <Text fontSize="sm" fontWeight="500" color="fg.default" textAlign={{ base: 'end', md: 'start' }} lineClamp="2">
      {children}
    </Text>
  </Flex>
)

/**
 * One order in /profile/orders. Same content as the live list (desktop + mobile versions merged):
 * status, date, ID (copy), total, payment card or contract number, address, items count, product photos,
 * expandable product list, "Повторный заказ", "Детали" / "Продолжать".
 */
export const OrderCard = ({ order }: { order: Order }) => {
  const { t } = useTranslation()
  const lang = useLang()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const placed = isPlaced(order)
  const k = 'profile.company.orders'
  const statusKey = order.status === 'in-progress' ? 'in_progress' : order.status
  const payment = [order.payment_info.card_type, order.payment_info.card_number].filter(Boolean).join(' ')
  const extra = order.product_images.length - THUMBS

  const openOrder = () => {
    if (placed) return navigate(paths.order(order.order_id))
    // Unfinished bank-transfer order: back to its checkout
    mockCheckout.resume(
      order.order_id,
      order.items.map((i) => ({ variation: i.variation, name: localized(i, 'name', lang), qty: i.quantity, price: i.price, addedAt: Date.now() })),
    )
    navigate(paths.checkout(order.order_id))
  }

  // Live: /content/cart/reorder puts the order's products back in the cart, then opens the cart
  const repeat = () => {
    order.items.forEach((i) => mockCart.set(i.variation, mockCart.qty(i.variation.guid) + i.quantity, i.price, localized(i, 'name', lang)))
    navigate(paths.cart)
  }

  const copyId = () => {
    void navigator.clipboard?.writeText(order.order_id)
    toaster.create({ type: 'success', title: t('copied_to_clipboard'), duration: 2000 })
  }

  return (
    <Box
      {...panel}
      p={{ base: 4, md: 5 }}
      cursor="pointer"
      transition="box-shadow .2s, border-color .2s"
      _hover={{ boxShadow: 'raised', borderColor: 'transparent' }}
      onClick={openOrder}
    >
      {/* Status, date, ID · total, payment */}
      <Flex gap="4" justify="space-between" align="flex-start" wrap={{ base: 'wrap', md: 'nowrap' }}>
        <Stack gap="1.5" minW="0">
          <Flex gap="2" align="center" wrap="wrap">
            <OrderStatusBadge status={order.status} />
            <Flex align="center" gap="0.5" fontSize="xs" color="fg.muted">
              {t(`${k}.mobile_labels.id`)}:{' '}
              <Text as="span" fontWeight="600" color="fg.body" fontVariantNumeric="tabular-nums">
                {order.order_id}
              </Text>
              <IconButton aria-label={t('copied_to_clipboard')} title={order.order_id} variant="ghost" size="2xs" color="fg.subtle" onClick={(e) => (stop(e), copyId())}>
                <Copy size={13} />
              </IconButton>
            </Flex>
          </Flex>
          <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="700" color="fg.default">
            {t(`${k}.status_label.${statusKey}`)}
          </Text>
          <Text fontSize="sm" color="fg.muted">
            {t(`${k}.mobile_labels.date`)}: {formatDate(order.created_at, lang)}
          </Text>
        </Stack>
        <Stack gap="0.5" textAlign={{ base: 'start', md: 'end' }} flexShrink="0" w={{ base: 'full', md: 'auto' }} hideBelow="md">
          <Text fontSize="xl" fontWeight="800" color="fg.default" whiteSpace="nowrap">
            {formatPrice(order.final_price, lang)}
          </Text>
          {payment && (
            <Text fontSize="sm" color="fg.muted" fontVariantNumeric="tabular-nums">
              {payment}
            </Text>
          )}
        </Stack>
      </Flex>

      <Separator borderColor="border.subtle" my="4" />

      {/* Photos · address, contract, items */}
      <Grid templateColumns={{ base: '1fr', md: 'auto minmax(0, 1fr)' }} gap={{ base: 4, md: 8 }} alignItems="center">
        <Flex gap="2">
          {order.product_images.slice(0, THUMBS).map((src, i) => (
            <Box key={`${src}-${i}`} boxSize={{ base: '52px', md: '60px' }} flexShrink="0" bg="bg.tile" borderRadius="control" overflow="hidden" pos="relative">
              <Image src={src} alt="" w="full" h="full" fit="contain" p="1.5" mixBlendMode="multiply" loading="lazy" />
              {i === THUMBS - 1 && extra > 0 && (
                <Flex pos="absolute" inset="0" align="center" justify="center" bg="blackAlpha.600" color="white" fontSize="sm" fontWeight="700">
                  +{extra + 1}
                </Flex>
              )}
            </Box>
          ))}
        </Flex>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }} gap={{ base: 2, md: 4 }}>
          {order.address && <Meta label={t(`${k}.mobile_labels.address`)}>{order.address}</Meta>}
          {order.agreement?.contract_number && <Meta label={t(`${k}.contract_label`)}>{order.agreement.contract_number}</Meta>}
          <Meta label={t(`${k}.mobile_labels.items`)}>{order.items_count}</Meta>
          {/* Phones: total and payment sit with the other details */}
          <Box hideFrom="md">
            <Meta label={t(`${k}.mobile_labels.sum`)}>
              <Text as="span" fontWeight="800">
                {formatPrice(order.final_price, lang)}
              </Text>
            </Meta>
          </Box>
          {payment && (
            <Box hideFrom="md">
              <Meta label={t('order.checkout.title')}>{payment}</Meta>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Products (expand) · actions */}
      <Collapsible.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Flex mt="4" gap="2" align="center" wrap="wrap" justify="space-between">
          <Collapsible.Trigger asChild>
            <Button variant="ghost" size="sm" ms="-2" gap="1.5" color="fg.body" fontWeight="600" onClick={stop}>
              {t(`${k}.mobile_labels.items_count`, { count: order.items_count })}
              <Box transition="transform .2s" transform={open ? 'rotate(180deg)' : undefined}>
                <ChevronDown size={16} />
              </Box>
            </Button>
          </Collapsible.Trigger>
          <Flex gap="2" w={{ base: 'full', sm: 'auto' }}>
            {placed && (
              <Button flex={{ base: 1, sm: 'none' }} variant="outline" size="sm" h="40px" borderRadius="control" gap="2" onClick={(e) => (stop(e), repeat())}>
                <RotateCcw size={15} />
                {t(`${k}.repeat_order_button`)}
              </Button>
            )}
            <Button flex={{ base: 1, sm: 'none' }} colorPalette="brand" size="sm" h="40px" borderRadius="control" gap="2" onClick={(e) => (stop(e), openOrder())}>
              {t(placed ? `${k}.details_button` : `${k}.continue_order`)}
              <ArrowRight size={15} />
            </Button>
          </Flex>
        </Flex>
        <Collapsible.Content onClick={stop} cursor="auto">
          <Stack gap="0" mt="3" bg="bg.panel" borderRadius="control" px="3" separator={<Separator borderColor="border.subtle" />}>
            {order.items.map((i) => (
              <Flex key={i.variation.guid} gap="3" py="3" align="center">
                <Box boxSize="56px" flexShrink="0" bg="bg.surface" borderRadius="primary" overflow="hidden">
                  <Image src={i.variation.image[0]} alt="" w="full" h="full" fit="contain" p="1" mixBlendMode="multiply" loading="lazy" />
                </Box>
                <Box flex="1" minW="0">
                  <Text fontSize="sm" color="fg.default" lineClamp="2">
                    {localized(i.variation, 'name', lang) || localized(i, 'name', lang)}
                  </Text>
                  <RouterLink to={paths.product(i.productId)}>
                    <Text fontSize="xs" fontWeight="600" color="fg.link" _hover={{ textDecoration: 'underline' }}>
                      {t(`${k}.view_product_details`)}
                    </Text>
                  </RouterLink>
                </Box>
                <Stack gap="0" textAlign="end" flexShrink="0">
                  <Text fontSize="sm" fontWeight="700" whiteSpace="nowrap">
                    {formatPrice(i.price, lang)}
                  </Text>
                  {i.oldPrice > 0 && (
                    <Text fontSize="xs" color="fg.subtle" textDecoration="line-through" whiteSpace="nowrap">
                      {formatPrice(i.oldPrice, lang)}
                    </Text>
                  )}
                  <Text fontSize="xs" color="fg.muted">
                    × {i.quantity}
                  </Text>
                </Stack>
              </Flex>
            ))}
          </Stack>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  )
}
