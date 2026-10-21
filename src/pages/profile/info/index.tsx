import { Box, Grid, IconButton, Stack, Text } from '@chakra-ui/react'
import { Copy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { mockProfile } from '@/mocks/profile.store'
import { useLang } from '@/shared/hooks/useLang'
import { formatDate } from '@/shared/lib/format'
import { panel } from '@/shared/ui/surface'
import { toaster } from '@/shared/ui/toaster'
import { ProfileHeader } from '@/widgets/profile/ProfileUi'

// Numbers people copy into documents
const COPYABLE = new Set(['inn', 'pinfl', 'bank_account', 'bank_code', 'oked'])

/**
 * /profile/details — live "Данные компании" (/user/company/info), read only.
 * Company (login by INN): 11 fields. Sole trader (login by PINFL): 6 fields. Empty fields are hidden.
 */
export default function ProfileCompanyPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const c = mockProfile.company
  const f = 'profile.company.fields'
  const date = formatDate(c.regdate, lang)

  const fields =
    c.login_status === 'pinfl'
      ? [
          ['name', c.name],
          ['pinfl', c.directorpinfl],
          ['address', c.address],
          ['bank_account', c.bankaccount],
          ['bank_code', c.bankcode],
          ['registration_date', date],
        ]
      : [
          ['name', c.name],
          ['inn', c.tin],
          ['legal_form', c.na1name],
          ['address', c.address],
          ['status', c.statusname],
          ['director', c.director],
          ['registration_date', date],
          ['bank_account', c.bankaccount],
          ['bank_code', c.bankcode],
          ['oked', c.oked],
          ['vat', c.vat_payer === true ? t('yes') : c.vat_payer === false ? t('no') : ''],
        ]
  const label = (key: string) => (key === 'bank_account' || key === 'bank_code' ? t(`${f}.${key}.label`) : t(`${f}.${key}`))

  return (
    <Stack gap={{ base: 4, md: 5 }}>
      <ProfileHeader title={t('profile.company_data')} />
      <Grid {...panel} templateColumns={{ base: '1fr', md: '1fr 1fr' }} p="2" gap="0">
        {fields
          .filter(([, v]) => v && String(v).trim())
          .map(([key, value], i) => (
            <Box
              key={key}
              role="group"
              pos="relative"
              px={{ base: 3, md: 4 }}
              py="3.5"
              // Hairlines between cells: rows on phones, rows + middle column on computers
              borderTopWidth={{ base: i ? '1px' : 0, md: i > 1 ? '1px' : 0 }}
              borderInlineStartWidth={{ md: i % 2 ? '1px' : 0 }}
              borderColor="border.subtle"
            >
              <Text fontSize="xs" color="fg.muted">
                {label(key)}
              </Text>
              <Text fontSize="sm" fontWeight="600" mt="0.5" pe="8" wordBreak="break-word" fontVariantNumeric="tabular-nums">
                {value}
              </Text>
              {COPYABLE.has(key) && (
                <IconButton
                  aria-label={t('copied_to_clipboard')}
                  variant="ghost"
                  size="xs"
                  color="fg.subtle"
                  pos="absolute"
                  right="2"
                  top="50%"
                  transform="translateY(-50%)"
                  opacity={{ base: 1, md: 0 }}
                  _groupHover={{ opacity: 1 }}
                  _focusVisible={{ opacity: 1 }}
                  onClick={() => {
                    void navigator.clipboard?.writeText(String(value).replace(/\s/g, ''))
                    toaster.create({ type: 'success', title: t('copied_to_clipboard'), duration: 2000 })
                  }}
                >
                  <Copy size={14} />
                </IconButton>
              )}
            </Box>
          ))}
      </Grid>
    </Stack>
  )
}
