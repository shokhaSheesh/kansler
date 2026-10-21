import { Button, Field, Stack, Text, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { mockOrders, type Order } from '@/mocks/orders.store'
import { ResponsiveDialog } from '@/shared/ui/ResponsiveDialog'
import { toaster } from '@/shared/ui/toaster'

type Key = 'advantages' | 'disadvantages' | 'comment'
// Live labels: delivery_title (advantages field), issues_title, comment_title
const FIELDS: Array<[Key, string, string]> = [
  ['advantages', 'delivery_title', 'delivery_placeholder'],
  ['disadvantages', 'issues_title', 'issues_placeholder'],
  ['comment', 'comment_title', 'comment_placeholder'],
]

/** Live "Оцените заказ": three required texts and "Отправить". A sent review opens read only. */
export const ReviewDialog = ({ order, onOpenChange }: { order: Order | null; onOpenChange: (o: boolean) => void }) => {
  const { t } = useTranslation()
  const k = 'profile.comments'
  const [v, setV] = useState<Record<Key, string>>({ advantages: '', disadvantages: '', comment: '' })
  const [tried, setTried] = useState(false)
  const [shown, setShown] = useState<string | null>(null)

  // Fresh form for every order opened (reset during render)
  const id = order?.order_id ?? null
  if (id !== shown) {
    setShown(id)
    const r = order?.review_data
    setV({ advantages: r?.advantages ?? '', disadvantages: r?.disadvantages ?? '', comment: r?.comment ?? '' })
    setTried(false)
  }

  const sent = Boolean(order?.review_data)
  const valid = FIELDS.every(([key]) => v[key].trim())

  return (
    <ResponsiveDialog
      open={Boolean(order)}
      onOpenChange={onOpenChange}
      title={t(`${k}.rate_order`)}
      size="lg"
      footer={
        sent ? undefined : (
          <Button
            w="full"
            h="48px"
            colorPalette="brand"
            borderRadius="control"
            onClick={() => {
              setTried(true)
              if (!valid || !order) return
              mockOrders.review(order.order_id, { advantages: v.advantages.trim(), disadvantages: v.disadvantages.trim(), comment: v.comment.trim() })
              onOpenChange(false)
              toaster.create({ type: 'success', title: t('order.detail.thank_title'), duration: 2500 })
            }}
          >
            {t(`${k}.send`)}
          </Button>
        )
      }
    >
      <Stack gap="4">
        <Text fontSize="sm" color="fg.muted" mt="-1">
          {t('profile.notifications_page.order_title', { id: order?.order_id })} · {t(`${k}.help_text`)}
        </Text>
        {FIELDS.map(([key, label, ph]) => (
          <Field.Root key={key} invalid={tried && !v[key].trim()} readOnly={sent}>
            <Field.Label fontWeight="600">{t(`${k}.${label}`)}</Field.Label>
            <Textarea
              value={v[key]}
              onChange={(e) => setV((x) => ({ ...x, [key]: e.target.value }))}
              placeholder={t(`${k}.${ph}`)}
              rows={3}
              resize="none"
              borderRadius="control"
              bg={sent ? 'bg.tint' : undefined}
            />
            <Field.ErrorText>{t(`${k}.required`)}</Field.ErrorText>
          </Field.Root>
        ))}
      </Stack>
    </ResponsiveDialog>
  )
}
