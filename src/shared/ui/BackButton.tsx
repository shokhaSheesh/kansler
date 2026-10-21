import { Button } from '@chakra-ui/react'
import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

/**
 * "Назад": returns to the previous page inside the site; when the page was opened directly
 * (shared link, new tab), goes to `fallback` instead of leaving the site.
 */
export const BackButton = ({ fallback }: { fallback: string }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const inSite = ((window.history.state as { idx?: number } | null)?.idx ?? 0) > 0

  return (
    <Button
      variant="ghost"
      size="sm"
      h="32px"
      ps="1"
      pe="2.5"
      ms="-1"
      gap="1"
      borderRadius="full"
      color="fg.body"
      fontWeight="600"
      flexShrink="0"
      _hover={{ bg: 'bg.muted', color: 'fg.default' }}
      onClick={() => (inSite ? navigate(-1) : navigate(fallback))}
    >
      <ChevronLeft size={18} />
      {t('back')}
    </Button>
  )
}
