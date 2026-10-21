import { Box, Button } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { BackButton } from '@/shared/ui/BackButton'
import { EmptyState } from '@/shared/ui/EmptyState'

/** /auth/register/not-found — live "Ничего не нашлось(" + "Ввести в ручную" (manual company form). */
export default function RegisterNotFoundPage() {
  const { t } = useTranslation()
  return (
    <>
      <Box mb="2">
        <BackButton fallback={paths.auth.register.check} />
      </Box>
      <EmptyState
        bare
        title={t('auth.not_found.message')}
        action={
          <Button asChild h="48px" px="6" colorPalette="brand" borderRadius="control">
            <RouterLink to={paths.auth.register.companyForm}>{t('auth.not_found.manual_button')}</RouterLink>
          </Button>
        }
      />
    </>
  )
}
