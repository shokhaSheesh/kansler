import { Button, Stack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { mockProfile, type Address } from '@/mocks/profile.store'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Pagination } from '@/shared/ui/Pagination'
import { AddressDialog } from '@/widgets/profile/AddressDialog'
import { AddRow, ProfileHeader, SelectableRow } from '@/widgets/profile/ProfileUi'

const PAGE = 6 // live: 6 per page

/**
 * /profile/address — live "Адрес": saved addresses, tap one to make it the default (radio), edit, delete,
 * "Добавить адрес" (map + form). Empty: "У вас нету адреса доставки" + "Добавить новый адрес".
 * `?new=1` opens the form (used by /profile/map, /profile/address-form and checkout).
 */
const AddressPage = observer(() => {
  const { t } = useTranslation()
  const p = mockProfile
  const [params, setParams] = useSearchParams()
  const [form, setForm] = useState<{ open: boolean; edit: Address | null }>({ open: false, edit: null })
  const [removing, setRemoving] = useState<Address | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (params.get('new')) {
      setForm({ open: true, edit: null })
      setParams({}, { replace: true })
    }
  }, [params, setParams])

  const add = () => setForm({ open: true, edit: null })
  const pages = Math.ceil(p.addresses.length / PAGE)
  const list = p.addresses.slice((page - 1) * PAGE, page * PAGE)
  const k = 'order.add_location'

  return (
    <Stack gap={{ base: 4, md: 5 }}>
      <ProfileHeader title={t('order.address_select.title')} />

      {p.addresses.length === 0 ? (
        <EmptyState
          title={t('profile.company.address.empty_title')}
          description={t('profile.company.address.empty_description')}
          action={
            <Button colorPalette="brand" borderRadius="control" h="44px" px="6" onClick={add}>
              {t('profile.company.address.start_shopping')}
            </Button>
          }
        />
      ) : (
        <Stack gap="2.5">
          {list.map((a) => (
            <SelectableRow
              key={a.guid}
              title={a.address}
              sub={[a.apartment && `${t(`${k}.apartment`)}: ${a.apartment}`, a.floor && `${t(`${k}.floor`)}: ${a.floor}`].filter(Boolean).join(' · ')}
              note={a.comment}
              selected={a.is_default}
              onSelect={() => p.defaultAddress(a.guid)}
              onEdit={() => setForm({ open: true, edit: a })}
              onDelete={() => setRemoving(a)}
              editLabel={t('profile.personal_info.edit_title')}
              deleteLabel={t('cart.delete')}
            />
          ))}
          <AddRow label={t('order.address_select.add_address')} onClick={add} />
          {pages > 1 && <Pagination page={page} totalPages={pages} onChange={setPage} />}
        </Stack>
      )}

      <AddressDialog open={form.open} edit={form.edit} onOpenChange={(open) => setForm((f) => ({ ...f, open }))} />
      {/* Live deletes addresses without asking; the design asks first, with the texts used for the other lists */}
      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(o) => !o && setRemoving(null)}
        title={t('profile.recipients_page.confirm_delete_title')}
        description={t('profile.recipients_page.confirm_delete_description')}
        cancelText={t('profile.recipients_page.confirm_delete_cancel')}
        confirmText={t('profile.recipients_page.confirm_delete_confirm')}
        onConfirm={() => removing && p.removeAddress(removing.guid)}
      />
    </Stack>
  )
})

export default AddressPage
