import { Button, CloseButton, Dialog, Field, Input, Portal, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/** Live "Введите номер карты" form (profile.cards_page.*): 16-digit number + ММ/ГГ. Confirmed by SMS code next. */
export const AddCardDialog = ({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (o: boolean) => void; onSubmit: (pan: string) => void }) => {
  const { t } = useTranslation()
  const [pan, setPan] = useState('')
  const [exp, setExp] = useState('')
  const [touched, setTouched] = useState(false)
  const digits = pan.replace(/\D/g, '')
  const expDigits = exp.replace(/\D/g, '')
  const panOk = digits.length === 16
  const expOk = expDigits.length === 4

  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} placement="center" size="sm">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner px="4">
          <Dialog.Content borderRadius="modal" p="6">
            <Dialog.CloseTrigger asChild top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Stack gap="4">
              <Dialog.Title fontSize="xl" fontWeight="700">
                {t('profile.cards_page.modal_title')}
              </Dialog.Title>
              <Field.Root invalid={touched && !panOk}>
                <Input
                  value={pan}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder={t('profile.cards_page.card_number_placeholder')}
                  h="48px"
                  borderRadius="control"
                  fontSize="md"
                  letterSpacing="0.06em"
                  onChange={(e) => setPan((e.target.value.replace(/\D/g, '').slice(0, 16).match(/.{1,4}/g) ?? []).join(' '))}
                />
                <Field.ErrorText>{t('profile.cards_page.card_number_error')}</Field.ErrorText>
              </Field.Root>
              <Field.Root invalid={touched && !expOk} maxW="140px">
                <Input
                  value={exp}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder={t('profile.cards_page.card_expiry_placeholder')}
                  h="48px"
                  borderRadius="control"
                  fontSize="md"
                  onChange={(e) => {
                    const d = e.target.value.replace(/\D/g, '').slice(0, 4)
                    setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
                  }}
                />
                <Field.ErrorText>{t('profile.cards_page.card_expiry_error')}</Field.ErrorText>
              </Field.Root>
              <Text fontSize="xs" color="fg.muted">
                {t('profile.cards_page.agreement_text')}{' '}
                <Text as="span" color="fg.link">
                  {t('profile.cards_page.agreement_link')}
                </Text>
              </Text>
              <Button
                h="48px"
                colorPalette="brand"
                borderRadius="control"
                onClick={() => {
                  setTouched(true)
                  if (panOk && expOk) {
                    onSubmit(digits)
                    setPan('')
                    setExp('')
                    setTouched(false)
                  }
                }}
              >
                {t('profile.cards_page.save_button')}
              </Button>
            </Stack>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
