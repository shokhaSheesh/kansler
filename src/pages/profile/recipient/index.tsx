import { Stack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { mockProfile, type Receiver } from '@/mocks/profile.store'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { RecipientDialog } from '@/widgets/profile/RecipientDialog'
import { AddRow, ProfileHeader, SelectableRow } from '@/widgets/profile/ProfileUi'

/**
 * /profile/recipient — live "Получатели": tap to make default, edit, delete (with confirmation),
 * "Добавить получателя". The account owner's own number can't be edited or deleted. `?new=1` opens the form.
 */
const RecipientPage = observer(() => {
  const { t } = useTranslation()
  const p = mockProfile
  const k = 'profile.recipients_page'
  const [params, setParams] = useSearchParams()
  const [form, setForm] = useState<{ open: boolean; edit: Receiver | null }>({ open: false, edit: null })
  const [removing, setRemoving] = useState<Receiver | null>(null)
  const self = p.user.phone.replace(/\D/g, '')

  useEffect(() => {
    if (params.get('new')) {
      setForm({ open: true, edit: null })
      setParams({}, { replace: true })
    }
  }, [params, setParams])

  return (
    <Stack gap={{ base: 4, md: 5 }}>
      <ProfileHeader title={t(`${k}.title`)} />
      <Stack gap="2.5">
        {p.receivers.map((r) => {
          const own = r.phone.replace(/\D/g, '') === self
          return (
            <SelectableRow
              key={r.guid}
              title={r.fullname}
              sub={r.phone}
              selected={r.is_default}
              onSelect={() => p.defaultReceiver(r.guid)}
              onEdit={own ? undefined : () => setForm({ open: true, edit: r })}
              onDelete={own ? undefined : () => setRemoving(r)}
              editLabel={t('profile.personal_info.edit_title')}
              deleteLabel={t('cart.delete')}
            />
          )
        })}
        <AddRow label={t(`${k}.add_button`)} onClick={() => setForm({ open: true, edit: null })} />
      </Stack>

      <RecipientDialog open={form.open} edit={form.edit} onOpenChange={(open) => setForm((f) => ({ ...f, open }))} />
      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(o) => !o && setRemoving(null)}
        title={t(`${k}.confirm_delete_title`)}
        description={t(`${k}.confirm_delete_description`)}
        cancelText={t(`${k}.confirm_delete_cancel`)}
        confirmText={t(`${k}.confirm_delete_confirm`)}
        onConfirm={() => removing && p.removeReceiver(removing.guid)}
      />
    </Stack>
  )
})

export default RecipientPage
