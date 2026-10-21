import { Box, Button, Field, Flex, Stack, Text } from '@chakra-ui/react'
import { Check } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router'
import { paths } from '@/app/router/paths'
import { authFlow } from '@/mocks/auth-flow.store'
import { toaster } from '@/shared/ui/toaster'
import { AuthHeading } from './AuthHeading'
import { PasswordInput } from './PasswordInput'

// Live criteria (auth.register.password.criteria.*)
const RULES: Array<[string, (p: string) => boolean]> = [
  ['length', (p) => p.length >= 6],
  ['upper', (p) => /[A-ZА-ЯЁ]/.test(p)],
  ['lower', (p) => /[a-zа-яё]/.test(p)],
  ['number', (p) => /[0-9]/.test(p)],
  ['special', (p) => /[^A-Za-z0-9А-Яа-яЁё]/.test(p)],
]

/**
 * Live password step: "Установка пароля" (sign-up) / "Сброс пароля" (reset), new password + repeat,
 * the checklist "Пароль должен содержать:" ticking as you type, "Продолжить".
 * Sign-up → "Регистрация прошла успешно" → home. Reset → "Пароль успешно изменен" → login.
 */
export const PasswordStep = observer(({ mode }: { mode: 'register' | 'reset' }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const k = 'auth.register.password'
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [busy, setBusy] = useState(false)
  if (!authFlow.phone) return <Navigate to={mode === 'reset' ? paths.auth.reset.root : paths.auth.register.check} replace />

  const allMet = RULES.every(([, ok]) => ok(pw))
  const mismatch = pw2.length > 0 && pw2 !== pw

  const submit = () => {
    if (!allMet || pw !== pw2) return
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      toaster.create({ type: 'success', title: t(mode === 'reset' ? 'auth_password_update_success' : 'auth.register.success'), duration: 3000 })
      navigate(mode === 'reset' ? paths.auth.login : paths.home)
    }, 700)
  }

  return (
    <>
      <AuthHeading title={t(mode === 'reset' ? `${k}.reset_title` : `${k}.set_title`)} step={mode === 'register' ? 4 : undefined} />
      <Stack
        as="form"
        gap="4"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Field.Root>
          <Field.Label fontSize="sm">{t(`${k}.new_password.label`)}</Field.Label>
          <PasswordInput value={pw} onChange={setPw} placeholder={t(`${k}.new_password.placeholder`)} autoComplete="new-password" />
        </Field.Root>
        <Box bg="bg.tint" borderRadius="control" p="4">
          <Text fontSize="sm" fontWeight="600" mb="2">
            {t(`${k}.criteria.title`)}
          </Text>
          <Stack gap="1.5">
            {RULES.map(([key, ok]) => {
              const met = ok(pw)
              return (
                <Flex key={key} align="center" gap="2" fontSize="sm" color={met ? 'green.700' : 'fg.muted'} transition="color .2s">
                  <Flex boxSize="18px" align="center" justify="center" borderRadius="full" bg={met ? 'green.500' : 'kgray.200'} color="white" transition="background .2s">
                    <Check size={12} strokeWidth={3} />
                  </Flex>
                  {t(`${k}.criteria.${key}`)}
                </Flex>
              )
            })}
          </Stack>
        </Box>
        <Field.Root invalid={mismatch}>
          <Field.Label fontSize="sm">{t(`${k}.confirm_password.label`)}</Field.Label>
          <PasswordInput value={pw2} onChange={setPw2} placeholder={t(`${k}.confirm_password.placeholder`)} autoComplete="new-password" />
          <Field.ErrorText>{t(`${k}.errors.not_match`)}</Field.ErrorText>
        </Field.Root>
        <Button type="submit" h="52px" mt="2" colorPalette="brand" borderRadius="control" fontSize="md" loading={busy} disabled={!allMet || pw !== pw2}>
          {t('auth.register.continue')}
        </Button>
      </Stack>
    </>
  )
})
