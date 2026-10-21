import { Box, Button, Flex, Grid, Heading, IconButton, Image, Separator, Skeleton, Stack, Text } from '@chakra-ui/react'
import { ChevronRight, Copy, Download, FileText, MapPin, PackageCheck, Star, XCircle } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, Navigate, useParams } from 'react-router'
import { paths } from '@/app/router/paths'
import { mockOrders } from '@/mocks/orders.store'
import { useLang } from '@/shared/hooks/useLang'
import { formatDate, formatPrice, localized } from '@/shared/lib/format'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { panel, tintedPanel } from '@/shared/ui/surface'
import { SummaryRow } from '@/shared/ui/SummaryRow'
import { toaster } from '@/shared/ui/toaster'
import { SUPPORT_BOT } from '@/widgets/cart/CartSummary'
import { OrderProgress } from '@/widgets/order-detail/OrderProgress'
import { hasProgress } from '@/widgets/order-detail/progress'
import { OrderStatusBadge } from '@/widgets/orders/OrderStatusBadge'

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
  <Stack {...panel} gap="3" p={{ base: 4, md: 5 }}>
    <Text fontSize="md" fontWeight="700">
      {title}
    </Text>
    {children}
  </Stack>
)

const IconTile = ({ children, tone = 'bg.tile', color = 'fg.body' }: { children: ReactNode; tone?: string; color?: string }) => (
  <Flex boxSize="44px" flexShrink="0" align="center" justify="center" bg={tone} color={color} borderRadius="full">
    {children}
  </Flex>
)

/** Row that is a link: icon, text, chevron ("Оценить товары", "Отменить заказ"). */
const ActionRow = ({ icon, label, danger, ...link }: { icon: ReactNode; label: string; danger?: boolean } & ({ to: string } | { href: string })) => {
  const content = (
    <Flex align="center" gap="3" py="1" role="group">
      <IconTile tone={danger ? 'primary.50' : 'bg.tile'} color={danger ? 'fg.discount' : 'fg.body'}>
        {icon}
      </IconTile>
      <Text flex="1" fontSize="sm" fontWeight="600" color={danger ? 'fg.discount' : 'fg.default'}>
        {label}
      </Text>
      <Box color="fg.subtle" transition="transform .15s" _groupHover={{ transform: 'translateX(2px)' }}>
        <ChevronRight size={18} />
      </Box>
    </Flex>
  )
  return 'to' in link ? (
    <RouterLink to={link.to}>{content}</RouterLink>
  ) : (
    <a href={link.href} target="_blank" rel="noreferrer">
      {content}
    </a>
  )
}

/**
 * /profile/orders/:id — same content as the live order page:
 * status (label, date, badge, "Скачать чек", 3-step progress) · products · "Ваш заказ" summary ·
 * "Оплачено с" · "Адрес доставки" · "Оценить товары" (delivered) · "Хотите отменить заказ?" (not finished) ·
 * "Спасибо за ваш отзыв" banner after a review.
 */
const OrderPage = observer(() => {
  const { t } = useTranslation()
  const lang = useLang()
  const { id = '' } = useParams()
  const k = 'order.detail_page'

  useEffect(() => {
    void mockOrders.load()
  }, [])

  if (!mockOrders.ready)
    return (
      <Grid templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 380px' }} gap="6">
        <Stack gap="4">
          <Skeleton h="200px" borderRadius="card" />
          <Skeleton h="320px" borderRadius="card" />
        </Stack>
        <Skeleton h="300px" borderRadius="card" />
      </Grid>
    )

  const order = mockOrders.byId(id)
  if (!order) return <Navigate to={paths.orders} replace />

  const statusKey = order.status === 'in-progress' ? 'in_progress' : order.status
  const progress = hasProgress(order.status)
  // Live: cancelling is offered while the order is not finished (via the support bot)
  const cancellable = ['in-progress', 'waiting', 'assembling', 'shipping'].includes(order.status)
  const card = order.payment_info.card_number
  const sum = (v: number) => formatPrice(v, lang)

  const copyId = () => {
    void navigator.clipboard?.writeText(order.order_id)
    toaster.create({ type: 'success', title: t('copied_to_clipboard'), duration: 2000 })
  }

  return (
    <Stack gap={{ base: 4, md: 6 }}>
      <Stack gap="2">
        <Breadcrumbs
          items={[
            { label: t('favourites.breadcrumb.home'), to: paths.home },
            { label: t('profile.company.orders.title'), to: paths.orders },
            { label: t('profile.notifications_page.order_title', { id: order.order_id }) },
          ]}
          back={paths.orders}
        />
        <Flex align="center" gap="3" wrap="wrap">
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700">
            {t('profile.notifications_page.order_title', { id: order.order_id })}
          </Heading>
          <Box flex="1" />
          {/* Live: fiscal receipt (OFD) PDF, once paid */}
          {order.ofd_url && (
            <Button variant="outline" size="sm" h="40px" borderRadius="primary" gap="2" bg="bg.surface">
              <Download size={16} />
              {t('download')}
            </Button>
          )}
        </Flex>
      </Stack>

      {order.has_review && (
        <Flex {...tintedPanel} bg="green.50" gap="4" align="center" p={{ base: 4, md: 5 }}>
          <IconTile tone="green.100" color="green.700">
            <PackageCheck size={22} />
          </IconTile>
          <Box>
            <Text fontWeight="700">{t('order.detail.thank_title')}</Text>
            <Text fontSize="sm" color="fg.muted">
              {t('order.detail.thank_description')}
            </Text>
          </Box>
        </Flex>
      )}

      <Grid templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 380px' }} gap="6" alignItems="start">
        <Stack gap="4" minW="0">
          {/* Status */}
          <Stack {...panel} gap={progress ? 6 : 4} p={{ base: 4, md: 6 }}>
            <Flex justify="space-between" align="flex-start" gap="3">
              <Box>
                <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="700">
                  {t(`${k}.status.${statusKey}.label`)}
                </Text>
                <Text fontSize="sm" color="fg.muted">
                  {t(`${k}.delivery_date`, { date: formatDate(order.created_at, lang) })}
                </Text>
              </Box>
              <OrderStatusBadge status={order.status} label={t(`${k}.status.${statusKey}.badge`)} size="md" />
            </Flex>
            {progress ? (
              <OrderProgress status={order.status} />
            ) : (
              // Cancelled / other: the live page shows the total and the number of products instead of the progress
              <Flex gap={{ base: 5, md: 10 }} wrap="wrap">
                <Box>
                  <Text fontWeight="700">{sum(order.final_price)}</Text>
                  <Text fontSize="sm" color="fg.muted">
                    {[order.payment_info.card_type, card].filter(Boolean).join(' ') || '—'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="700">{t(`${k}.items_label`)}</Text>
                  <Text fontSize="sm" color="fg.muted">
                    {order.items_count}x
                  </Text>
                </Box>
              </Flex>
            )}
          </Stack>

          {/* Products */}
          <Stack {...panel} gap="1" p={{ base: 4, md: 6 }}>
            <Text fontSize="lg" fontWeight="700" mb="2">
              {t(`${k}.items_label`)}{' '}
              <Text as="span" color="fg.muted" fontWeight="500" fontSize="md">
                ({order.items_count})
              </Text>
            </Text>
            <Stack gap="0" separator={<Separator borderColor="border.subtle" />}>
              {order.items.map((i) => {
                const name = localized(i.variation, 'name', lang) || localized(i, 'name', lang)
                return (
                  <Flex key={i.variation.guid} gap={{ base: 3, md: 4 }} py="3" align="center">
                    <RouterLink to={paths.product(i.productId)}>
                      <Box boxSize={{ base: '64px', md: '72px' }} flexShrink="0" bg="bg.tile" borderRadius="control" overflow="hidden">
                        <Image src={i.variation.image[0]} alt={name} w="full" h="full" fit="contain" p="1.5" mixBlendMode="multiply" loading="lazy" />
                      </Box>
                    </RouterLink>
                    <Box flex="1" minW="0">
                      <RouterLink to={paths.product(i.productId)}>
                        <Text fontSize="sm" color="fg.default" lineClamp="2" _hover={{ color: 'fg.link' }}>
                          {name}
                        </Text>
                      </RouterLink>
                      <Flex gap="2" align="baseline" mt="1">
                        <Text fontSize="sm" fontWeight="700">
                          {sum(i.price)}
                        </Text>
                        {i.oldPrice > 0 && (
                          <Text fontSize="xs" color="fg.subtle" textDecoration="line-through">
                            {sum(i.oldPrice)}
                          </Text>
                        )}
                      </Flex>
                    </Box>
                    <Text fontSize="sm" fontWeight="600" color="fg.muted" flexShrink="0" bg="bg.tile" px="2.5" py="1" borderRadius="full">
                      {i.quantity}x
                    </Text>
                  </Flex>
                )
              })}
            </Stack>
          </Stack>
        </Stack>

        <Stack gap="4" pos={{ lg: 'sticky' }} top={{ lg: '128px' }}>
          {/* Summary */}
          <Stack {...tintedPanel} gap="3" p={{ base: 4, md: 6 }}>
            <Text fontSize="lg" fontWeight="700">
              {t(`${k}.order_title`)}
            </Text>
            <SummaryRow
              label={t(`${k}.summary.id`)}
              value={
                <Flex as="span" align="center" gap="1">
                  {order.order_id}
                  <IconButton aria-label={t('copied_to_clipboard')} variant="ghost" size="2xs" color="fg.subtle" onClick={copyId}>
                    <Copy size={13} />
                  </IconButton>
                </Flex>
              }
            />
            {order.agreement?.contract_number && <SummaryRow label={t(`${k}.summary.contract`)} value={order.agreement.contract_number} />}
            <SummaryRow label={t(`${k}.summary.items`, { count: order.items_count })} value={sum(order.total_price)} />
            {order.delivery_cost > 0 && <SummaryRow label={t(`${k}.summary.delivery`)} value={sum(order.delivery_cost)} />}
            {order.total_discount > 0 && (
              <Flex justify="space-between" fontSize="sm">
                <Text color="fg.muted">{t(`${k}.summary.discount`)}</Text>
                <Text fontWeight="600" color="fg.discount">
                  −{sum(order.total_discount)}
                </Text>
              </Flex>
            )}
            <Separator borderColor="border.default" />
            <Flex justify="space-between" align="baseline" gap="3">
              <Text fontWeight="700">{t(`${k}.summary.total`)}</Text>
              <Text fontSize="2xl" fontWeight="800" whiteSpace="nowrap">
                {sum(order.final_price)}
              </Text>
            </Flex>
          </Stack>

          <Block title={t(`${k}.paid_with`)}>
            <Flex align="center" gap="3">
              <IconTile>{card ? <Text fontSize="2xs" fontWeight="800" fontStyle="italic">{order.payment_info.card_type}</Text> : <FileText size={20} />}</IconTile>
              <Text fontSize="sm" fontWeight="600" fontVariantNumeric="tabular-nums">
                {card || t(`${k}.paid_with_didox`)}
              </Text>
            </Flex>
          </Block>

          <Block title={t(`${k}.delivery_address`)}>
            <Flex align="center" gap="3">
              <IconTile>
                <MapPin size={20} />
              </IconTile>
              <Text fontSize="sm" fontWeight="600">
                {order.address || '—'}
              </Text>
            </Flex>
          </Block>

          {order.status === 'delivered' && (
            <Block title={t(`${k}.reviews_title`)}>
              <ActionRow icon={<Star size={20} />} label={t(`${k}.rate_products`)} to={paths.profile.comments} />
            </Block>
          )}

          {cancellable && (
            <Block title={t(`${k}.cancel_question`)}>
              <ActionRow icon={<XCircle size={20} />} label={t(`${k}.cancel_action`)} href={SUPPORT_BOT} danger />
            </Block>
          )}
        </Stack>
      </Grid>
    </Stack>
  )
})

export default OrderPage
