import { Button, Flex } from '@chakra-ui/react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { byId } from '@/mocks/catalog'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { activeFilterCount, EMPTY_FILTERS, type Filters } from './params'

const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(Math.round(n)).replace(/ /g, ' ')

/** Removable chips for everything that is applied, plus "clear all". */
export const ActiveFilters = ({ value, onChange }: { value: Filters; onChange: (f: Filters) => void }) => {
  const { t } = useTranslation()
  const lang = useLang()
  if (!activeFilterCount(value)) return null

  const chips: Array<{ key: string; label: string; remove: () => void }> = [
    ...value.categoryIds.map((id) => ({
      key: `c:${id}`,
      label: byId.get(id) ? localized(byId.get(id)!.category, 'name', lang) : id,
      remove: () => onChange({ ...value, categoryIds: value.categoryIds.filter((x) => x !== id) }),
    })),
    ...(value.type !== 'all'
      ? [{ key: 'type', label: t(`filter.product_type.${value.type}`), remove: () => onChange({ ...value, type: 'all' as const }) }]
      : []),
    ...(value.priceMin != null || value.priceMax != null
      ? [
          {
            key: 'price',
            label: [
              value.priceMin != null && `${t('filter.price.from')} ${fmt(value.priceMin)}`,
              value.priceMax != null && `${t('filter.price.to')} ${fmt(value.priceMax)}`,
            ]
              .filter(Boolean)
              .join(' '),
            remove: () => onChange({ ...value, priceMin: null, priceMax: null }),
          },
        ]
      : []),
    ...value.colors.map((c) => ({
      key: `col:${c}`,
      label: c,
      remove: () => onChange({ ...value, colors: value.colors.filter((x) => x !== c) }),
    })),
  ]

  return (
    <Flex wrap="wrap" gap="2" align="center">
      {chips.map((c) => (
        <Button
          key={c.key}
          size="xs"
          h="30px"
          ps="3"
          pe="2"
          gap="1.5"
          borderRadius="full"
          bg="navy.900"
          color="white"
          fontWeight="500"
          _hover={{ bg: 'navy.hover' }}
          onClick={c.remove}
        >
          {c.label}
          <X size={14} />
        </Button>
      ))}
      <Button size="xs" variant="plain" color="fg.link" px="1" onClick={() => onChange(EMPTY_FILTERS)}>
        {t('filter.clear_all')}
      </Button>
    </Flex>
  )
}
