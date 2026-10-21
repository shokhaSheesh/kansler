import { IconButton } from '@chakra-ui/react'
import { ArrowDownUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/** The live "sort by price" icon toggle (cheapest first on / off). */
export const CheapFirstToggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => {
  const { t } = useTranslation()
  return (
    <IconButton
      aria-label={t('filter.sort.price_asc')}
      title={t('filter.sort.price_asc')}
      aria-pressed={value}
      size="sm"
      h="40px"
      w="40px"
      borderRadius="primary"
      variant={value ? 'solid' : 'outline'}
      colorPalette={value ? 'brand' : undefined}
      bg={value ? undefined : 'bg.surface'}
      borderColor="border.default"
      onClick={() => onChange(!value)}
    >
      <ArrowDownUp size={16} />
    </IconButton>
  )
}
