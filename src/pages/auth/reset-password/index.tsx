import { Button, Field, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { paths } from '@/app/router/paths'
import { authFlow, DEMO } from '@/mocks/auth-flow.store'
import { AuthHeading } from '@/features/auth/AuthHeading'
import { fullPhone, localDigits } from '@/shared/lib/phone'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { toaster } from '@/shared/ui/toaster'

/** /auth/reset-password — live "Сброс пароля": phone, "Подтвердить" → SMS code → new password. */
export default function ResetPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const k = 'auth.reset_password'
  const [phone, setPhone] = useState(authFlow.mode === 'reset' ? localDigits(authFlow.phone) : '')
  const [notFound, setNotFound] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = () => {
    if (phone.length !== 9) return
    if (fullPhone(phone) === DEMO.unknownPhone) return setNotFound(true)
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      authFlow.setMode('reset')
      authFlow.setContact(fullPhone(phone))
      toaster.create({ type: 'success', title: t('auth.register.otp.sent'), duration: 2500 })
      navigate(paths.auth.reset.verifyOtp)
    }, 600)
  }

  return (
    <>
      <AuthHeading title={t(`${k}.title`)} back={paths.auth.login} />
      <Stack
        as="form"
        gap="4"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Field.Root invalid={notFound}>
          <Field.Label fontSize="sm">{t(`${k}.phone_label`)}</Field.Label>
          <PhoneInput
            value={phone}
            onChange={(v) => {
              setPhone(v)
              setNotFound(false)
            }}
            placeholder={t(`${k}.phone_placeholder`)}
          />
          <Field.ErrorText>{t(`${k}.user_not_found`)}</Field.ErrorText>
        </Field.Root>
        <Button type="submit" h="52px" mt="2" colorPalette="brand" borderRadius="control" fontSize="md" loading={busy} disabled={phone.length !== 9}>
          {t(`${k}.continue`)}
        </Button>
      </Stack>
    </>
  )
}
