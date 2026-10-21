import { Button } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { EmptyState } from '@/shared/ui/EmptyState'

/**
 * Unknown address. The live site has no such page (it shows an empty screen); this uses the site's own texts:
 * "Ничего не нашлось(" and "На главную".
 */
export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <EmptyState
      title={t('auth.not_found.message')}
      action={
        <Button asChild colorPalette="brand" borderRadius="control" h="44px" px="6">
          <RouterLink to={paths.home}>{t('order.payment_success.to_main')}</RouterLink>
        </Button>
      }
    />
  )
}
