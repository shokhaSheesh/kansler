import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react'
import { Building2 } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, Navigate } from 'react-router'
import { paths } from '@/app/router/paths'
import { authFlow } from '@/mocks/auth-flow.store'
import { AuthHeading } from '@/features/auth/AuthHeading'
import { panel } from '@/shared/ui/surface'

/** Live: only the first and last 4 digits of the account */
const masked = (acc: string) => (acc ? `${acc.slice(0, 4)}…${acc.slice(-4)}` : '-')

/**
 * /auth/register/check-result — live "Результат": what the tax service returned, then "Продолжить".
 * Company (ИНН): ИНН, name, address, date, ОПФ, ОКЭД, bank code, account, VAT status/code, director.
 * Sole trader (ПИНФЛ): ПИНФЛ, ФИО, address, VAT status, date, bank code, account.
 */
const RegisterCheckResultPage = observer(() => {
  const { t } = useTranslation()
  const c = authFlow.company
  const k = 'auth.register.check_result'
  if (!c) return <Navigate to={paths.auth.register.check} replace />
  const inn = authFlow.registerType === 'inn'

  const rows: Array<[string, string]> = inn
    ? [
        ['inn', c.tinOrPinfl],
        ['address', c.address],
        ['registration_date', c.regDate],
        ['opf', c.na1Name],
        ['oked', c.oked],
        ['bank_code', c.bankCode],
        ['account', masked(c.bankAccount)],
        ['vat_status', c.statusName],
        ['vat_code', c.vatRegCode],
        ['director', c.director],
      ]
    : [
        ['pinfl', c.tinOrPinfl],
        ['address', c.address],
        ['vat_status', c.statusName],
        ['registration_date', c.regDate],
        ['bank_code', c.bankCode],
        ['account', masked(c.bankAccount)],
      ]

  return (
    <>
      <AuthHeading title={t(`${k}.title`)} back={paths.auth.register.check} step={1} />
      <Box {...panel} overflow="hidden">
        {/* The company itself, as the heading of the card */}
        <Flex gap="3" align="center" p="4" bg="bg.tint" borderBottomWidth="1px" borderColor="border.subtle">
          <Flex boxSize="44px" flexShrink="0" align="center" justify="center" borderRadius="full" bg="bg.surface" boxShadow="panel">
            <Building2 size={20} />
          </Flex>
          <Box minW="0">
            <Text fontSize="xs" color="fg.muted">
              {t(inn ? `${k}.company_name` : `${k}.fullname`)}
            </Text>
            <Text fontWeight="700" lineClamp="2">
              {inn ? c.name : c.fullName}
            </Text>
          </Box>
        </Flex>
        <Stack gap="0" px="4" py="1" separator={<Box borderTopWidth="1px" borderColor="border.subtle" />}>
          {rows
            .filter(([, v]) => v)
            .map(([key, v]) => (
              <Flex key={key} justify="space-between" gap="4" py="2.5" fontSize="sm">
                <Text color="fg.muted" flexShrink="0">
                  {t(`${k}.${key}`)}
                </Text>
                <Text fontWeight="600" textAlign="end" wordBreak="break-word" fontVariantNumeric="tabular-nums">
                  {v}
                </Text>
              </Flex>
            ))}
        </Stack>
      </Box>
      <Button asChild w="full" h="52px" mt="6" colorPalette="brand" borderRadius="control" fontSize="md">
        <RouterLink to={paths.auth.register.form}>{t(`${k}.continue`)}</RouterLink>
      </Button>
    </>
  )
})

export default RegisterCheckResultPage
