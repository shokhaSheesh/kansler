import { Box, Flex, Grid, Skeleton, Stack, Text } from '@chakra-ui/react'
import { CheckCircle2, ChevronRight, MessageSquarePlus } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { mockOrders } from '@/mocks/orders.store'
import { useLang } from '@/shared/hooks/useLang'
import { formatDate, formatPrice } from '@/shared/lib/format'
import { Pagination } from '@/shared/ui/Pagination'
import { panel } from '@/shared/ui/surface'
import { ProfileHeader } from '@/widgets/profile/ProfileUi'
import { ReviewDialog } from '@/widgets/profile/ReviewDialog'

const PAGE = 10 // live: 10 per page on computers

/**
 * /profile/comments — live "Отзывы": orders that can be reviewed ("Заказ ID …", date of the review,
 * "N сум • N товаров"). Opening one shows "Оцените заказ"; a sent review is read only.
 * `?order=<id>` opens that order's review (used by "Оценить товары" on the order page).
 */
const CommentsPage = observer(() => {
  const { t } = useTranslation()
  const lang = useLang()
  const [params, setParams] = useSearchParams()
  const [openId, setOpenId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    void mockOrders.load()
  }, [])

  useEffect(() => {
    const id = params.get('order')
    if (id && mockOrders.ready) {
      setOpenId(id)
      setParams({}, { replace: true })
    }
  }, [params, setParams])

  const list = mockOrders.reviewable
  const pages = Math.ceil(list.length / PAGE)

  return (
    <Stack gap={{ base: 4, md: 5 }}>
      <ProfileHeader title={t('profile.reviews')} />
      {!mockOrders.ready ? (
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} h="96px" borderRadius="card" />
          ))}
        </Grid>
      ) : (
        <>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="3">
            {list.slice((page - 1) * PAGE, page * PAGE).map((o) => {
              const done = Boolean(o.review_data)
              return (
                <Flex
                  key={o.order_id}
                  as="button"
                  {...panel}
                  textAlign="start"
                  gap="3"
                  align="center"
                  p="4"
                  transition="box-shadow .2s, border-color .2s"
                  _hover={{ boxShadow: 'raised', borderColor: 'transparent' }}
                  onClick={() => setOpenId(o.order_id)}
                >
                  <Flex boxSize="44px" flexShrink="0" align="center" justify="center" borderRadius="full" bg={done ? 'green.50' : 'bg.tile'} color={done ? 'green.600' : 'fg.body'}>
                    {done ? <CheckCircle2 size={20} /> : <MessageSquarePlus size={20} />}
                  </Flex>
                  <Box flex="1" minW="0">
                    <Flex justify="space-between" gap="2">
                      <Text fontWeight="700">{t('profile.notifications_page.order_title', { id: o.order_id })}</Text>
                      {done && (
                        <Text fontSize="xs" color="fg.muted" whiteSpace="nowrap">
                          {formatDate(o.review_data!.created_at, lang)}
                        </Text>
                      )}
                    </Flex>
                    <Text fontSize="sm" color="fg.muted" mt="0.5">
                      {formatPrice(o.final_price, lang)} • {t('profile.company.orders.mobile_labels.items_count', { count: o.items_count })}
                    </Text>
                  </Box>
                  <Box color="fg.subtle">
                    <ChevronRight size={18} />
                  </Box>
                </Flex>
              )
            })}
          </Grid>
          {pages > 1 && <Pagination page={page} totalPages={pages} onChange={setPage} />}
        </>
      )}
      <ReviewDialog order={openId ? mockOrders.byId(openId) : null} onOpenChange={(o) => !o && setOpenId(null)} />
    </Stack>
  )
})

export default CommentsPage
