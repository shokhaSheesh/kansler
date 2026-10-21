import { Button, Field, Flex, Link, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router'
import { paths } from '@/app/router/paths'
import { DEMO } from '@/mocks/auth-flow.store'
import { AuthHeading } from '@/features/auth/AuthHeading'
import { PasswordInput } from '@/features/auth/PasswordInput'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { toaster } from '@/shared/ui/toaster'

/** /auth/login — live "Войти в систему": phone, password (4+), "Забыли пароль?", "Войти", "Регистрация". */
export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const k = 'auth.login'
  const short = password.length > 0 && password.length < 4

  const submit = () => {
    if (phone.length !== 9 || password.length < 4) return
    setBusy(true)
    // Design phase: any password works except the demo wrong one
    window.setTimeout(() => {
      setBusy(false)
      if (password === DEMO.wrongPassword) return setError(true)
      toaster.create({ type: 'success', title: t(`${k}.success_message`), duration: 2500 })
      navigate(paths.home)
    }, 600)
  }

  return (
    <>
      <AuthHeading title={t(`${k}.title`)} />
      <Stack
        as="form"
        gap="4"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Field.Root>
          <Field.Label fontSize="sm">{t(`${k}.phone_label`)}</Field.Label>
          <PhoneInput
            value={phone}
            onChange={(v) => {
              setPhone(v)
              setError(false)
            }}
          />
        </Field.Root>
        <Field.Root invalid={short || error}>
          <Flex w="full" justify="space-between" align="baseline">
            <Field.Label fontSize="sm">{t(`${k}.password_label`)}</Field.Label>
            <Link asChild fontSize="sm" fontWeight="600" color="fg.link">
              <RouterLink to={paths.auth.reset.root}>{t(`${k}.forgot_password`)}</RouterLink>
            </Link>
          </Flex>
          <PasswordInput
            value={password}
            onChange={(v) => {
              setPassword(v)
              setError(false)
            }}
            placeholder={t(`${k}.password_placeholder`)}
          />
          <Field.ErrorText>{error ? t(`${k}.error_message`) : t(`${k}.password_min_length_error`)}</Field.ErrorText>
        </Field.Root>
        <Button type="submit" h="52px" mt="2" colorPalette="brand" borderRadius="control" fontSize="md" loading={busy} disabled={phone.length !== 9 || password.length < 4}>
          {t(`${k}.continue`)}
        </Button>
      </Stack>
      <Button asChild mt="3" w="full" h="52px" variant="outline" borderRadius="control" fontSize="md">
        <RouterLink to={paths.auth.register.check}>{t(`${k}.register`)}</RouterLink>
      </Button>
    </>
  )
}
