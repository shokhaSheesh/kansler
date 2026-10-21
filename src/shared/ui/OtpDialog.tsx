import { Button, CloseButton, Dialog, Flex, PinInput, Portal, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface OtpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phone: string
  /** Resolve true when the code is accepted. */
  onConfirm: (code: string) => Promise<boolean>
  onResend?: () => void
}

const RESEND_SECONDS = 60

/**
 * Live "Введите код / Мы отправили 6-значный код на номер" (order.otp.*), used for card payment and card binding.
 * 6 boxes, auto-submit on the last digit, resend after a countdown.
 */
export const OtpDialog = ({ open, onOpenChange, phone, onConfirm, onResend }: OtpDialogProps) => {
  const { t } = useTranslation()
  const [code, setCode] = useState<string[]>([])
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)
  const [left, setLeft] = useState(RESEND_SECONDS)

  useEffect(() => {
    if (!open) return
    const id = window.setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => window.clearInterval(id)
  }, [open])

  const submit = async (digits: string[]) => {
    if (digits.join('').length !== 6 || busy) return
    setBusy(true)
    const ok = await onConfirm(digits.join(''))
    setBusy(false)
    if (!ok) {
      setError(true)
      setCode([])
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        onOpenChange(e.open)
        if (e.open) {
          setCode([])
          setError(false)
          setLeft(RESEND_SECONDS)
        }
      }}
      placement="center"
      size="sm"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner px="4">
          <Dialog.Content borderRadius="modal" p="6">
            <Dialog.CloseTrigger asChild top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Stack gap="5" align="center" textAlign="center">
              <Stack gap="1.5">
                <Dialog.Title fontSize="xl" fontWeight="700">
                  {t('order.otp.title')}
                </Dialog.Title>
                <Text fontSize="sm" color="fg.muted">
                  {t('order.otp.description')}
                  <br />
                  <Text as="b" color="fg.default" whiteSpace="nowrap">
                    {phone}
                  </Text>
                </Text>
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
                <PinInput.Control gap="2">
                  {Array.from({ length: 6 }, (_, i) => (
                    <PinInput.Input key={i} index={i} placeholder="" borderRadius="control" w="44px" h="52px" fontSize="xl" fontWeight="700" />
                  ))}
                </PinInput.Control>
              </PinInput.Root>

              {error && (
                <Text fontSize="sm" color="fg.error" mt="-2">
                  {t('order.otp.error')}
                </Text>
              )}

              <Button w="full" h="48px" colorPalette="brand" borderRadius="control" loading={busy} disabled={code.join('').length !== 6} onClick={() => submit(code)}>
                {t('order.otp.confirm')}
              </Button>

              <Flex gap="1.5" fontSize="sm" color="fg.muted" justify="center" wrap="wrap">
                {t('order.otp.resend_description')}
                {left > 0 ? (
                  <Text as="span" fontVariantNumeric="tabular-nums">
                    0:{String(left).padStart(2, '0')}
                  </Text>
                ) : (
                  <Button
                    variant="plain"
                    size="sm"
                    h="auto"
                    p="0"
                    color="fg.link"
                    onClick={() => {
                      setLeft(RESEND_SECONDS)
                      onResend?.()
                    }}
                  >
                    {t('order.otp.resend')}
                  </Button>
                )}
              </Flex>
            </Stack>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
