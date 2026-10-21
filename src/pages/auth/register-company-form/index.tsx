import { Button, Field, Grid, Input, NativeSelect, Stack, Switch } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { paths } from '@/app/router/paths'
import { authFlow } from '@/mocks/auth-flow.store'
import { AuthHeading } from '@/features/auth/AuthHeading'

type Spec = {
  name: string
  label: string
  placeholder?: string
  /** exact number of digits */
  digits?: number
  max?: number
  error?: string
  helper?: string
  options?: Array<[string, string]>
  date?: boolean
  optional?: boolean
  half?: boolean
}

const C = 'auth.register.company'

/**
 * /auth/register/company-form — live manual company entry (when the lookup finds nothing or "Ввести вручную").
 * Company (ИНН): name, ИНН (9), legal form, address, director, registration date, ОКЭД (5), account (20),
 * "Является плательщиком НДС?" → Код НДС (12), bank code (5).
 * Sole trader (ПИНФЛ): ПИНФЛ (14), ФИО, address, status, registration date, bank code (5), account (20).
 */
const RegisterCompanyFormPage = observer(() => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const inn = authFlow.registerType === 'inn'
  const [v, setV] = useState<Record<string, string>>({})
  const [vat, setVat] = useState(false)
  const [tried, setTried] = useState(false)

  const legal: Spec[] = [
    { name: 'company_name', label: `${C}.company_name.label`, placeholder: `${C}.company_name.placeholder`, max: 150 },
    { name: 'inn', label: `${C}.inn.label`, placeholder: `${C}.inn.placeholder`, digits: 9, error: 'auth.register.check.errors.inn_pattern', half: true },
    {
      name: 'legal_form',
      label: `${C}.legal_form.label`,
      placeholder: `${C}.legal_form.placeholder`,
      options: ['ooo', 'ao', 'individual', 'partnership', 'cooperative'].map((o) => [o, `${C}.legal_form.options.${o}`]),
      half: true,
    },
    { name: 'address', label: `${C}.address.label`, placeholder: `${C}.address.placeholder`, helper: `${C}.address.helper`, max: 150 },
    { name: 'director', label: `${C}.director.label`, placeholder: `${C}.director.placeholder`, max: 150, error: `${C}.director.required` },
    { name: 'registration_date', label: `${C}.registration_date.label`, date: true, error: `${C}.registration_date.required`, half: true },
    { name: 'okved', label: `${C}.okved.label`, placeholder: `${C}.okved.placeholder`, digits: 5, error: `${C}.okved.errors.pattern`, half: true },
    { name: 'bank_account', label: `${C}.bank_account.label`, placeholder: `${C}.bank_account.placeholder`, digits: 20, error: `${C}.bank_account.errors.pattern` },
    { name: 'bank_code', label: `${C}.bank_code.label`, placeholder: `${C}.bank_code.placeholder`, digits: 5, error: 'auth.register.check.errors.bank_code_pattern', half: true },
  ]
  const pinfl: Spec[] = [
    { name: 'pnfl', label: `${C}.pnfl_form.label`, placeholder: `${C}.pnfl_form.placeholder`, digits: 14, error: 'auth.register.check.errors.pinfl_pattern' },
    { name: 'director', label: `${C}.pnfl_form.first_name`, placeholder: `${C}.pnfl_form.first_name_placeholder`, max: 150 },
    { name: 'address', label: `${C}.address.label`, placeholder: `${C}.address.placeholder`, helper: `${C}.address.helper`, max: 150 },
    {
      name: 'status',
      label: `${C}.status.label`,
      placeholder: `${C}.status.placeholder`,
      options: [
        ['active', `${C}.pnfl_form.status.active`],
        ['inactive', `${C}.pnfl_form.status.inactive`],
      ],
      half: true,
    },
    { name: 'registration_date', label: `${C}.registration_date.label`, date: true, half: true },
    { name: 'bank_code', label: `${C}.bank_code.label`, placeholder: `${C}.bank_code.placeholder`, digits: 5, error: 'auth.register.check.errors.bank_code_pattern', half: true },
    { name: 'bank_account', label: `${C}.bank_account.label`, placeholder: `${C}.bank_account.placeholder`, digits: 20, error: `${C}.bank_account.errors.pattern` },
  ]
  const fields = inn ? legal : pinfl

  const bad = (f: Spec) => {
    const x = (v[f.name] ?? '').trim()
    if (!x) return !f.optional
    return f.digits ? x.length !== f.digits : false
  }
  const vatBad = inn && vat && (v.nds_code ?? '').length !== 12
  const valid = !fields.some(bad) && !vatBad

  const submit = () => {
    setTried(true)
    if (!valid) return
    authFlow.setCompany({
      tinOrPinfl: inn ? v.inn : v.pnfl,
      name: v.company_name ?? '',
      fullName: v.director ?? '',
      address: v.address,
      regDate: v.registration_date ?? '',
      na1Name: v.legal_form ?? '',
      oked: v.okved ?? '',
      bankCode: v.bank_code,
      bankAccount: v.bank_account,
      vatRegCode: v.nds_code ?? '',
      statusName: v.status ?? '',
      director: v.director ?? '',
    })
    navigate(paths.auth.register.form)
  }

  const input = (f: Spec) => {
    const set = (x: string) => setV((s) => ({ ...s, [f.name]: f.digits ? x.replace(/\D/g, '').slice(0, f.digits) : x }))
    const invalid = tried && bad(f)
    return (
      <Field.Root key={f.name} required={!f.optional} invalid={invalid} gridColumn={f.half ? undefined : '1 / -1'}>
        <Field.Label fontSize="sm">
          {t(f.label)}
          <Field.RequiredIndicator />
        </Field.Label>
        {f.options ? (
          <NativeSelect.Root>
            <NativeSelect.Field value={v[f.name] ?? ''} onChange={(e) => set(e.target.value)} h="48px" borderRadius="control" color={v[f.name] ? 'fg.default' : 'fg.subtle'}>
              <option value="" disabled>
                {t(f.placeholder!)}
              </option>
              {f.options.map(([val, label]) => (
                <option key={val} value={val}>
                  {t(label)}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        ) : (
          <Input
            type={f.date ? 'date' : 'text'}
            value={v[f.name] ?? ''}
            onChange={(e) => set(e.target.value)}
            placeholder={f.placeholder ? t(f.placeholder) : undefined}
            inputMode={f.digits ? 'numeric' : undefined}
            maxLength={f.digits ?? f.max}
            h="48px"
            borderRadius="control"
            fontVariantNumeric={f.digits ? 'tabular-nums' : undefined}
          />
        )}
        {f.helper && <Field.HelperText>{t(f.helper)}</Field.HelperText>}
        <Field.ErrorText>{v[f.name] && f.error ? t(f.error) : t('auth.register.not_empty')}</Field.ErrorText>
      </Field.Root>
    )
  }

  return (
    <>
      {/* Live shows no heading here; "Регистрация компании" is the site's own text for this form */}
      <AuthHeading title={t(`${C}.title`)} back={paths.auth.register.check} step={1} />
      <Stack
        as="form"
        gap="5"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4">
          {fields.map(input)}
          {inn && (
            <>
              <Switch.Root checked={vat} onCheckedChange={(e) => setVat(e.checked)} colorPalette="brand" gridColumn="1 / -1" display="flex" justifyContent="space-between" w="full" py="1">
                <Switch.HiddenInput />
                <Switch.Label fontSize="sm" fontWeight="500">
                  {t(`${C}.is_vat_payer`)}
                </Switch.Label>
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch.Root>
              {vat && (
                <Field.Root required invalid={tried && vatBad} gridColumn="1 / -1">
                  <Field.Label fontSize="sm">
                    {t(`${C}.nds_code.label`)}
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    value={v.nds_code ?? ''}
                    onChange={(e) => setV((s) => ({ ...s, nds_code: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                    placeholder={t(`${C}.nds_code.placeholder`)}
                    inputMode="numeric"
                    h="48px"
                    borderRadius="control"
                  />
                  <Field.ErrorText>{v.nds_code ? t(`${C}.nds_code.errors.pattern`) : t(`${C}.nds_code.required`)}</Field.ErrorText>
                </Field.Root>
              )}
            </>
          )}
        </Grid>
        <Button type="submit" h="52px" colorPalette="brand" borderRadius="control" fontSize="md">
          {t(`${C}.continue`)}
        </Button>
      </Stack>
    </>
  )
})

export default RegisterCompanyFormPage
