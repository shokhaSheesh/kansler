import { Button, Field, Input, NativeSelect, Stack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router'
import { paths } from '@/app/router/paths'
import { authFlow, DEMO } from '@/mocks/auth-flow.store'
import { AgreeText } from '@/features/auth/Agreement'
import { AuthHeading } from '@/features/auth/AuthHeading'
import { fullPhone, localDigits } from '@/shared/lib/phone'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { toaster } from '@/shared/ui/toaster'

const ROLES: Array<[string, string]> = [
  ['purchase', 'purchasing_department'],
  ['accounting', 'accounting'],
  ['owner', 'owner'],
  ['other', 'other'],
]

/**
 * /auth/register/form — live "Регистрация": phone, role in the company (Отдел закупа / Бухгалтерия /
 * Владелец / Другое), ФИО (5–150), agreement, "Регистрация" → SMS code.
 */
const RegisterFormPage = observer(() => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const k = 'auth.register'
  const [phone, setPhone] = useState(localDigits(authFlow.phone))
  const [role, setRole] = useState(authFlow.role)
  const [name, setName] = useState(authFlow.fullname)
  const [tried, setTried] = useState(false)
  const [busy, setBusy] = useState(false)
  if (!authFlow.company) return <Navigate to={paths.auth.register.check} replace />

  const nameOk = name.trim().length >= 5 && name.trim().length <= 150
  const valid = phone.length === 9 && role && nameOk

  const submit = () => {
    setTried(true)
    if (!valid) return
    if (fullPhone(phone) === DEMO.existingPhone) return toaster.create({ type: 'error', title: t(`${k}.errors.user_already_exists`), duration: 3500 })
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      authFlow.setContact(fullPhone(phone), name.trim(), role)
      toaster.create({ type: 'success', title: t(`${k}.otp.sent`), duration: 2500 })
      navigate(paths.auth.register.verifyOtp)
    }, 600)
  }

  return (
    <>
      <AuthHeading title={t(`${k}.form.title`)} back={paths.auth.register.checkResult} step={2} />
      <Stack
        as="form"
        gap="4"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Field.Root invalid={tried && phone.length !== 9}>
          <Field.Label fontSize="sm">{t(`${k}.phone.label`)}</Field.Label>
          <PhoneInput value={phone} onChange={setPhone} placeholder={t(`${k}.form.phone_placeholder`)} />
          <Field.ErrorText>{phone ? t(`${k}.errors.invalid_phone`) : t(`${k}.errors.required`)}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={tried && !role}>
          <Field.Label fontSize="sm">{t(`${k}.department.label`)}</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field value={role} onChange={(e) => setRole(e.target.value)} h="48px" borderRadius="control" color={role ? 'fg.default' : 'fg.subtle'}>
              <option value="" disabled>
                {t(`${k}.department.placeholder`)}
              </option>
              {ROLES.map(([value, key]) => (
                <option key={value} value={value}>
                  {t(`${k}.department.options.${key}`)}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Field.ErrorText>{t(`${k}.errors.required`)}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={tried && !nameOk}>
          <Field.Label fontSize="sm">{t(`${k}.full_name.label`)}</Field.Label>
          <Input value={name} maxLength={150} onChange={(e) => setName(e.target.value)} placeholder={t(`${k}.form.full_name_placeholder`)} h="48px" borderRadius="control" autoComplete="name" />
          <Field.ErrorText>{name.length > 150 ? t(`${k}.full_name.errors.max_length`) : t(`${k}.full_name.errors.required`)}</Field.ErrorText>
        </Field.Root>
        <AgreeText textKey={`${k}.form.agree_text`} linkKey={`${k}.form.agree_link`} />
        <Button type="submit" h="52px" mt="2" colorPalette="brand" borderRadius="control" fontSize="md" loading={busy}>
          {t(`${k}.form.submit`)}
        </Button>
      </Stack>
    </>
  )
})

export default RegisterFormPage
