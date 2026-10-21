import { Button, Flex } from '@chakra-ui/react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { byId } from '@/mocks/catalog'
import { useLang } from '@/shared/hooks/useLang'
import { formatPrice, localized } from '@/shared/lib/format'
import { activeFilterCount, type Filters } from './params'

/** Applied filters as removable chips (layout only: no new text). */
export const ActiveFilters = ({ value, onChange }: { value: Filters; onChange: (f: Filters) => void }) => {
  const { t } = useTranslation()
  const lang = useLang()
  if (!activeFilterCount(value)) return null

  const chips: Array<{ key: string; label: string; remove: () => void }> = [
    ...(value.categoryId && byId.get(value.categoryId)
      ? [{ key: 'cat', label: localized(byId.get(value.categoryId)!.category, 'name', lang), remove: () => onChange({ ...value, categoryId: null }) }]
      : []),
    ...(value.priceMin != null || value.priceMax != null
      ? [
          {
            key: 'price',
            label: `${t('filter.price.title')}: ${value.priceMin != null ? formatPrice(value.priceMin, lang) : '…'} – ${value.priceMax != null ? formatPrice(value.priceMax, lang) : '…'}`,
            remove: () => onChange({ ...value, priceMin: null, priceMax: null }),
          },
        ]
      : []),
    ...value.colors.map((c) => ({ key: `col:${c}`, label: c, remove: () => onChange({ ...value, colors: value.colors.filter((x) => x !== c) }) })),
  ]

  return (
    <Flex wrap="wrap" gap="2">
      {chips.map((c) => (
        <Button key={c.key} size="xs" h="30px" ps="3" pe="2" gap="1.5" borderRadius="full" bg="navy.900" color="white" fontWeight="500" _hover={{ bg: 'navy.hover' }} onClick={c.remove}>
          {c.label}
          <X size={14} />
        </Button>
      ))}
    </Flex>
  )
}
