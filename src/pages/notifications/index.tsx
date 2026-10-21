import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import { Ban, CheckCircle2, Clock, CreditCard, Package, Truck } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { mockNotifications } from '@/mocks/notifications.store'
import type { OrderStatus } from '@/mocks/orders.store'
import { mockOrders } from '@/mocks/orders.store'
import { useLang } from '@/shared/hooks/useLang'
import { formatDate } from '@/shared/lib/format'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Pagination } from '@/shared/ui/Pagination'
import { ProfileHeader } from '@/widgets/profile/ProfileUi'

const PAGE = 10 // live: 10 per page

// Live: an icon per status; delivered green, cancelled red, the rest neutral
const LOOK: Record<OrderStatus, { icon: typeof Package; bg: string; fg: string }> = {
  assembling: { icon: Package, bg: 'bg.tile', fg: 'fg.body' },
  'in-progress': { icon: Package, bg: 'bg.tile', fg: 'fg.body' },
  shipping: { icon: Truck, bg: 'blue.50', fg: 'blue.600' },
  paid: { icon: CreditCard, bg: 'bg.tile', fg: 'fg.body' },
  waiting: { icon: Clock, bg: 'bg.tile', fg: 'fg.body' },
  delivered: { icon: CheckCircle2, bg: 'green.50', fg: 'green.600' },
  cancelled: { icon: Ban, bg: 'red.50', fg: 'red.600' },
}

const time = (iso: string, lang: 'ru' | 'uz') => `${formatDate(iso, lang)}, ${new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`

/**
 * /profile/notifications — live "Уведомления": "У вас N новых уведомлений", order-status messages
 * ("Заказ ID …", message, time, "Не прочитано"). Opening one marks it read and opens the order.
 */
const NotificationsPage = observer(() => {
  const { t } = useTranslation()
  const lang = useLang()
  const [page, setPage] = useState(1)
  const k = 'profile.notifications_page'

  useEffect(() => {
    void mockOrders.load()
  }, [])

  const list = mockNotifications.list
  const pages = Math.ceil(list.length / PAGE)
  const unread = mockNotifications.unread

  return (
    <Stack gap={{ base: 4, md: 5 }}>
      <ProfileHeader title={t(`${k}.title`)} sub={unread > 0 ? t(`${k}.new_count`, { count: unread }) : undefined} />
      {mockOrders.ready && list.length === 0 ? (
        <EmptyState title={t('order.list.empty')} />
      ) : (
        <Stack gap="2">
          {list.slice((page - 1) * PAGE, page * PAGE).map((n) => {
            const look = LOOK[n.status]
            const Icon = look.icon
            const fresh = !n.is_read_by_me
            return (
              <RouterLink key={n.guid} to={paths.order(n.orders_id)} onClick={() => mockNotifications.markRead(n.guid)}>
                <Flex
                  gap="3.5"
                  p={{ base: 3.5, md: 4 }}
                  borderRadius="card"
                  borderWidth="1px"
                  borderColor={fresh ? 'kgray.200' : 'border.subtle'}
                  bg={fresh ? 'bg.surface' : 'bg.tint'}
                  boxShadow={fresh ? 'panel' : undefined}
                  transition="box-shadow .2s"
                  _hover={{ boxShadow: 'raised' }}
                >
                  <Flex boxSize="44px" flexShrink="0" align="center" justify="center" borderRadius="full" bg={look.bg} color={look.fg}>
                    <Icon size={20} />
                  </Flex>
                  <Box flex="1" minW="0">
                    <Flex gap="2" align="center" wrap="wrap">
                      <Text fontWeight={fresh ? '700' : '600'} fontSize="sm">
                        {t(`${k}.order_title`, { id: n.orders_id })}
                      </Text>
                      {fresh && (
                        <Flex align="center" gap="1.5" fontSize="xs" fontWeight="600" color="fg.link">
                          <Box boxSize="6px" borderRadius="full" bg="fg.link" />
                          {t(`${k}.un_read`)}
                        </Flex>
                      )}
                      <Text ms="auto" fontSize="xs" color="fg.muted" whiteSpace="nowrap">
                        {time(n.created_time, lang)}
                      </Text>
                    </Flex>
                    <Text fontSize="sm" color={fresh ? 'fg.body' : 'fg.muted'} mt="0.5">
                      {t(`${k}.items.${n.body}`)}
                    </Text>
                  </Box>
                </Flex>
              </RouterLink>
            )
          })}
          {pages > 1 && <Pagination page={page} totalPages={pages} onChange={setPage} />}
        </Stack>
      )}
    </Stack>
  )
})

export default NotificationsPage
