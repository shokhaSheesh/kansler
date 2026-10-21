import { Stack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { mockProfile, type BankAccount } from '@/mocks/profile.store'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { BankAccountDialog } from '@/widgets/profile/BankAccountDialog'
import { AddRow, ProfileHeader, SelectableRow, StatusTag } from '@/widgets/profile/ProfileUi'

const TONE = { approved: 'green', pending: 'yellow', rejected: 'red' } as const
/** 20 digits in groups of 4, easier to check against a bank document */
const grouped = (acc: string) => acc.replace(/(\d{4})(?=\d)/g, '$1 ')

/**
 * /profile/business-account — live "Расчетные счета": tap to make default, status (Проверен / В проверке /
 * Отклонен), edit and delete (not for the account from registration), "Добавить расчетный счет". `?new=1` opens the form.
 */
const BusinessAccountPage = observer(() => {
  const { t } = useTranslation()
  const p = mockProfile
  const k = 'profile.business_account_page'
  const [params, setParams] = useSearchParams()
  const [form, setForm] = useState<{ open: boolean; edit: BankAccount | null }>({ open: false, edit: null })
  const [removing, setRemoving] = useState<BankAccount | null>(null)

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
        {p.bankAccounts.map((a) => (
          <SelectableRow
            key={a.guid}
            title={a.name === 'main' ? t('main') : a.name}
            sub={grouped(a.bank_account)}
            tag={<StatusTag tone={TONE[a.status]}>{t(`${k}.status.${a.status}`)}</StatusTag>}
            selected={a.is_default}
            onSelect={() => p.defaultBankAccount(a.guid)}
            onEdit={a.is_initial ? undefined : () => setForm({ open: true, edit: a })}
            onDelete={a.is_initial ? undefined : () => setRemoving(a)}
            editLabel={t('profile.personal_info.edit_title')}
            deleteLabel={t('cart.delete')}
          />
        ))}
        <AddRow label={t(`${k}.add_button`)} onClick={() => setForm({ open: true, edit: null })} />
      </Stack>

      <BankAccountDialog open={form.open} edit={form.edit} onOpenChange={(open) => setForm((f) => ({ ...f, open }))} />
      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(o) => !o && setRemoving(null)}
        title={t(`${k}.confirm_delete_title`)}
        description={t(`${k}.confirm_delete_description`)}
        cancelText={t(`${k}.confirm_delete_cancel`)}
        confirmText={t(`${k}.confirm_delete_confirm`)}
        onConfirm={() => removing && p.removeBankAccount(removing.guid)}
      />
    </Stack>
  )
})

export default BusinessAccountPage
