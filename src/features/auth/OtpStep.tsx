import { Button, Flex, IconButton, PinInput, Stack, Text } from '@chakra-ui/react'
import { Pencil } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router'
import { paths } from '@/app/router/paths'
import { authFlow, DEMO } from '@/mocks/auth-flow.store'
import { toaster } from '@/shared/ui/toaster'
import { AuthHeading } from './AuthHeading'

const RESEND = 120 // live: 2 minutes

/**
 * Live verify-otp (sign-up and password reset): "Мы отпавили код подтверждения на номер" + phone with an edit
 * button, 6 digits, "Отправить код снова" after 2:00, "Подтвердить". Wrong code: "Неправильный код или срок действия истек".
 */
export const OtpStep = observer(({ mode }: { mode: 'register' | 'reset' }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const k = 'auth.register.otp'
  const [code, setCode] = useState<string[]>([])
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)
  const [left, setLeft] = useState(RESEND)
  const back = mode === 'reset' ? paths.auth.reset.root : paths.auth.register.form

  useEffect(() => {
    const id = window.setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => window.clearInterval(id)
  }, [])

  if (!authFlow.phone) return <Navigate to={back} replace />

  const submit = (digits = code) => {
    if (digits.join('').length !== 6 || busy) return
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      if (digits.join('') === DEMO.wrongCode) {
        setError(true)
        setCode([])
        return
      }
      navigate(mode === 'reset' ? paths.auth.reset.password : paths.auth.register.password)
    }, 600)
  }

  return (
    <>
      <AuthHeading title={t(mode === 'reset' ? 'auth.reset_password.title' : 'auth.register.title')} back={back} step={mode === 'register' ? 3 : undefined} />
      <Stack gap="5">
        <Stack gap="1">
          <Text fontSize="sm" color="fg.muted">
            {t(`${k}.description`)}
          </Text>
          <Flex align="center" gap="1">
            <Text fontWeight="700" fontVariantNumeric="tabular-nums">
              {authFlow.phone}
            </Text>
            <IconButton aria-label="edit phone" variant="ghost" size="xs" color="fg.muted" onClick={() => navigate(back)}>
              <Pencil size={14} />
            </IconButton>
          </Flex>
        </Stack>
        <PinInput.Root
          otp
          value={code}
          onValueChange={(e) => {
            setCode(e.value)
            setError(false)
          }}
          onValueComplete={(e) => submit(e.value)}
          invalid={error}
          size="lg"
          colorPalette="brand"
        >
          <PinInput.HiddenInput />
          <PinInput.Control gap={{ base: 2, sm: 3 }} w="full" display="flex">
            {Array.from({ length: 6 }, (_, i) => (
              <PinInput.Input key={i} index={i} placeholder="" flex="1" h="56px" borderRadius="control" fontSize="xl" fontWeight="700" />
            ))}
          </PinInput.Control>
        </PinInput.Root>
        {error && (
          <Text fontSize="sm" color="fg.error" mt="-2">
            {t(`${k}.error`)}
          </Text>
        )}
        <Button h="52px" colorPalette="brand" borderRadius="control" fontSize="md" loading={busy} disabled={code.join('').length !== 6} onClick={() => submit()}>
          {t(`${k}.continue`)}
        </Button>
        <Flex justify="center">
          {left > 0 ? (
            <Text fontSize="sm" color="fg.muted" fontVariantNumeric="tabular-nums">
              {t(`${k}.resend`)} · {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}
            </Text>
          ) : (
            <Button
              variant="plain"
              size="sm"
              color="fg.link"
              onClick={() => {
                setLeft(RESEND)
                toaster.create({ type: 'success', title: t(`${k}.sent`), duration: 2000 })
              }}
            >
              {t(`${k}.resend`)}
            </Button>
          )}
        </Flex>
      </Stack>
    </>
  )
})
