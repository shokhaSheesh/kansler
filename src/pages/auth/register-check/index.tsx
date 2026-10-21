import { Box, Button, Field, Flex, Input, Stack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { paths } from '@/app/router/paths'
import { authFlow, type RegisterType } from '@/mocks/auth-flow.store'
import { AgreeText } from '@/features/auth/Agreement'
import { AuthHeading } from '@/features/auth/AuthHeading'

/**
 * /auth/register/check — live "Поиск": Юр Лицо (ИНН, 9 digits) / ИП (ПИНФЛ, 14 digits), agreement,
 * "Поиск" (tax-service lookup → Результат or "Ничего не нашлось(") and "Ввести вручную".
 */
const RegisterCheckPage = observer(() => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const k = 'auth.register.check'
  const type = authFlow.registerType
  const len = type === 'inn' ? 9 : 14
  const [id, setId] = useState('')
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const ok = id.length === len

  const search = () => {
    setTouched(true)
    if (!ok) return
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      authFlow.setMode('register')
      navigate(authFlow.lookup(id) ? paths.auth.register.checkResult : paths.auth.register.notFound)
    }, 700)
  }

  return (
    <>
      <AuthHeading title={t(`${k}.title`)} back={paths.auth.login} step={1} />
      <Stack
        as="form"
        gap="4"
        onSubmit={(e) => {
          e.preventDefault()
          search()
        }}
      >
        <Flex bg="bg.tile" p="1" borderRadius="control" gap="1" role="tablist">
          {(['inn', 'pinfl'] as RegisterType[]).map((v) => {
            const on = type === v
            return (
              <Box
                key={v}
                as="button"
                role="tab"
                aria-selected={on}
                flex="1"
                h="40px"
                borderRadius="primary"
                fontSize="sm"
                fontWeight={on ? '600' : '500'}
                bg={on ? 'bg.surface' : 'transparent'}
                color={on ? 'fg.default' : 'fg.muted'}
                boxShadow={on ? 'panel' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  authFlow.setType(v)
                  setId('')
                  setTouched(false)
                }}
              >
                {t(`${k}.company_type.${v === 'inn' ? 'legal' : 'ip'}`)}
              </Box>
            )
          })}
        </Flex>
        <Field.Root invalid={touched && !ok}>
          <Input
            value={id}
            inputMode="numeric"
            maxLength={len}
            onChange={(e) => setId(e.target.value.replace(/\D/g, '').slice(0, len))}
            onBlur={() => id && setTouched(true)}
            placeholder={t(`${k}.${type}_placeholder`)}
            h="52px"
            borderRadius="control"
            fontSize="lg"
            letterSpacing="0.06em"
            fontVariantNumeric="tabular-nums"
            autoFocus
          />
          <Field.HelperText>
            {id.length}/{len}
          </Field.HelperText>
          <Field.ErrorText>{t(`${k}.errors.${type}_pattern`)}</Field.ErrorText>
        </Field.Root>
        <AgreeText textKey={`${k}.agree_text`} linkKey={`${k}.agree_link`} />
        <Stack gap="2.5" mt="2">
          <Button type="submit" h="52px" colorPalette="brand" borderRadius="control" fontSize="md" loading={busy} disabled={!id}>
            {t(`${k}.search`)}
          </Button>
          <Button
            h="52px"
            variant="outline"
            borderRadius="control"
            fontSize="md"
            onClick={() => {
              authFlow.setMode('register')
              navigate(paths.auth.register.companyForm)
            }}
          >
            {t(`${k}.manual`)}
          </Button>
        </Stack>
      </Stack>
    </>
  )
})

export default RegisterCheckPage
