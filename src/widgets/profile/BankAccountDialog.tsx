import { Button, Field, Input, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { mockProfile, type BankAccount } from '@/mocks/profile.store'
import { ResponsiveDialog } from '@/shared/ui/ResponsiveDialog'

/** Live "Новый расчетный счет" / "Редактировать расчетный счет": Название (≤50) + 20-digit account, "Добавить". */
export const BankAccountDialog = ({ open, onOpenChange, edit }: { open: boolean; onOpenChange: (o: boolean) => void; edit?: BankAccount | null }) => {
  const { t } = useTranslation()
  const k = 'profile.business_account_page'
  const [name, setName] = useState('')
  const [acc, setAcc] = useState('')
  const [touched, setTouched] = useState(false)

  // Fresh form every time the window opens (reset during render, React's pattern for this)
  const [wasOpen, setWasOpen] = useState(false)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setName(edit?.name ?? '')
      setAcc(edit?.bank_account ?? '')
      setTouched(false)
    }
  }

  const accOk = /^\d{20}$/.test(acc)
  const valid = name.trim() && accOk

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t(edit ? `${k}.modal_edit_title` : `${k}.modal_new_title`)}
      size="sm"
      footer={
        <Button
          w="full"
          h="48px"
          colorPalette="brand"
          borderRadius="control"
          disabled={!valid}
          onClick={() => {
            mockProfile.saveBankAccount({ name: name.trim(), bank_account: acc }, edit?.guid)
            onOpenChange(false)
          }}
        >
          {t(edit ? `${k}.save_button` : 'add_new')}
        </Button>
      }
    >
      <Stack gap="3">
        <Field.Root>
          <Input value={name} maxLength={50} onChange={(e) => setName(e.target.value)} placeholder={t(`${k}.name_placeholder`)} h="48px" borderRadius="control" />
        </Field.Root>
        <Field.Root invalid={touched && !accOk}>
          <Input
            value={acc}
            inputMode="numeric"
            maxLength={20}
            onChange={(e) => setAcc(e.target.value.replace(/\D/g, '').slice(0, 20))}
            onBlur={() => setTouched(true)}
            placeholder={t('profile.company.fields.bank_account.placeholder')}
            h="48px"
            borderRadius="control"
            fontVariantNumeric="tabular-nums"
            letterSpacing="0.04em"
          />
          <Field.HelperText>{acc.length}/20</Field.HelperText>
          <Field.ErrorText>{t('profile.company.fields.bank_account.errors.pattern')}</Field.ErrorText>
        </Field.Root>
      </Stack>
    </ResponsiveDialog>
  )
}
