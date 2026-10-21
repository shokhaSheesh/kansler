import { Button, Field, Input, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { mockProfile, type Receiver } from '@/mocks/profile.store'
import { fullPhone, localDigits } from '@/shared/lib/phone'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { ResponsiveDialog } from '@/shared/ui/ResponsiveDialog'

// Live rule: first and last name at least 4 letters each
const nameOk = (v: string) => v.trim().length >= 4

/** Live "Новый получатель" / "Редактировать получателя": Имя, Фамилия, phone, helper text, "Сохранить". */
export const RecipientDialog = ({ open, onOpenChange, edit, onSaved }: { open: boolean; onOpenChange: (o: boolean) => void; edit?: Receiver | null; onSaved?: (guid: string) => void }) => {
  const { t } = useTranslation()
  const k = 'profile.recipients_page'
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [phone, setPhone] = useState('')
  const [touched, setTouched] = useState({ first: false, last: false })
  const [dup, setDup] = useState(false)

  // Fresh form every time the window opens (reset during render, React's pattern for this)
  const [wasOpen, setWasOpen] = useState(false)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      const [f = '', ...rest] = (edit?.fullname ?? '').split(' ')
      setFirst(f)
      setLast(rest.join(' '))
      setPhone(edit ? localDigits(edit.phone) : '')
      setTouched({ first: false, last: false })
      setDup(false)
    }
  }

  const valid = nameOk(first) && nameOk(last) && phone.length === 9

  const save = () => {
    const full = fullPhone(phone)
    // Live: the backend refuses a second recipient with the same number ("already_has")
    if (mockProfile.hasReceiverPhone(full, edit?.guid)) return setDup(true)
    const guid = mockProfile.saveReceiver({ fullname: `${first.trim()} ${last.trim()}`, phone: full }, edit?.guid)
    onOpenChange(false)
    onSaved?.(guid)
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t(edit ? `${k}.modal_edit_title` : `${k}.modal_new_title`)}
      size="sm"
      footer={
        <Button w="full" h="48px" colorPalette="brand" borderRadius="control" disabled={!valid} onClick={save}>
          {t(`${k}.save_button`)}
        </Button>
      }
    >
      <Stack gap="3">
        <Field.Root invalid={touched.first && !nameOk(first)}>
          <Input
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            onBlur={() => setTouched((x) => ({ ...x, first: true }))}
            placeholder={t(`${k}.first_name_placeholder`)}
            h="48px"
            borderRadius="control"
            autoComplete="given-name"
          />
          <Field.ErrorText>{t(`${k}.first_name_error`)}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={touched.last && !nameOk(last)}>
          <Input
            value={last}
            onChange={(e) => setLast(e.target.value)}
            onBlur={() => setTouched((x) => ({ ...x, last: true }))}
            placeholder={t(`${k}.last_name_placeholder`)}
            h="48px"
            borderRadius="control"
            autoComplete="family-name"
          />
          <Field.ErrorText>{t(`${k}.last_name_error`)}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={dup}>
          <PhoneInput
            value={phone}
            invalid={dup}
            onChange={(v) => {
              setPhone(v)
              setDup(false)
            }}
          />
          <Field.ErrorText>{t(`${k}.already_has`)}</Field.ErrorText>
        </Field.Root>
        <Text fontSize="sm" color="fg.muted">
          {t(`${k}.helper_text`)}
        </Text>
      </Stack>
    </ResponsiveDialog>
  )
}
