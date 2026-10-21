import { Box, Button, Flex, Heading, Skeleton, Stack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useSearchParams } from 'react-router'
import { paths } from '@/app/router/paths'
import { IN_PROGRESS, mockOrders, ORDERS_PAGE_SIZE, type OrderStatus } from '@/mocks/orders.store'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Pagination } from '@/shared/ui/Pagination'
import { panel } from '@/shared/ui/surface'
import { OrderCard } from '@/widgets/orders/OrderCard'

type Tab = 'all' | 'in_progress' | 'delivered' | 'shipping' | 'cancelled'
// Live tab order
const TABS: Tab[] = ['all', 'in_progress', 'delivered', 'shipping', 'cancelled']

const matches = (tab: Tab, status: OrderStatus) =>
  tab === 'all' ? true : tab === 'in_progress' ? IN_PROGRESS.has(status) : status === tab

/**
 * /profile/orders — same content as the live page: "Заказы", tabs Все · В процессе · Доставленные · Перевозки ·
 * Отмененные, 5 orders per page, empty state with "Начать покупки". Tab and page are kept in the address.
 */
const OrdersPage = observer(() => {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const tab = (TABS.includes(params.get('tab') as Tab) ? params.get('tab') : 'all') as Tab
  const page = Math.max(1, Number(params.get('page')) || 1)
  const k = 'profile.company.orders'

  useEffect(() => {
    void mockOrders.load()
  }, [])

  const list = mockOrders.orders.filter((o) => matches(tab, o.status))
  const totalPages = Math.max(1, Math.ceil(list.length / ORDERS_PAGE_SIZE))
  const visible = list.slice((page - 1) * ORDERS_PAGE_SIZE, page * ORDERS_PAGE_SIZE)

  const go = (next: { tab?: Tab; page?: number }) => {
    const p = new URLSearchParams()
    const nt = next.tab ?? tab
    const np = next.page ?? 1
    if (nt !== 'all') p.set('tab', nt)
    if (np > 1) p.set('page', String(np))
    setParams(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const noOrders = mockOrders.ready && mockOrders.orders.length === 0

  return (
    <Stack gap={{ base: 4, md: 5 }}>
      <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700">
        {t(`${k}.title`)}
      </Heading>

      {!noOrders && (
        // Phones: the tabs scroll sideways and stay under the header
        <Box pos={{ base: 'sticky', md: 'static' }} top="60px" zIndex="docked" bg="bg.app" mx={{ base: -4, md: 0 }} px={{ base: 4, md: 0 }} py={{ base: 2, md: 0 }}>
          <Flex gap="1.5" overflowX="auto" css={{ scrollbarWidth: 'none' }}>
            {TABS.map((id) => {
              const on = id === tab
              return (
                <Button
                  key={id}
                  size="sm"
                  h="38px"
                  px="4"
                  flexShrink="0"
                  borderRadius="full"
                  fontWeight={on ? '600' : '500'}
                  bg={on ? 'navy.900' : 'bg.tile'}
                  color={on ? 'white' : 'fg.body'}
                  _hover={{ bg: on ? 'navy.900' : 'kgray.150' }}
                  aria-pressed={on}
                  onClick={() => go({ tab: id })}
                >
                  {t(`${k}.tabs.${id}`)}
                </Button>
              )
            })}
          </Flex>
        </Box>
      )}

      {!mockOrders.ready ? (
        Array.from({ length: 3 }, (_, i) => (
          <Box key={i} {...panel} p="5">
            <Skeleton h="20px" w="40%" mb="3" />
            <Skeleton h="14px" w="25%" mb="5" />
            <Flex gap="2">
              {Array.from({ length: 4 }, (_, j) => (
                <Skeleton key={j} boxSize="60px" borderRadius="control" />
              ))}
            </Flex>
          </Box>
        ))
      ) : noOrders || visible.length === 0 ? (
        <EmptyState
          title={t(`${k}.empty_title`)}
          description={t(`${k}.empty_description`)}
          action={
            <Button asChild colorPalette="brand" borderRadius="control" h="44px" px="6">
              <RouterLink to={paths.home}>{t(`${k}.start_shopping`)}</RouterLink>
            </Button>
          }
        />
      ) : (
        <Stack gap="3">
          {visible.map((o) => (
            <OrderCard key={o.order_id} order={o} />
          ))}
          <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} onChange={(p) => go({ page: p })} />
        </Stack>
      )}
    </Stack>
  )
})

export default OrdersPage
