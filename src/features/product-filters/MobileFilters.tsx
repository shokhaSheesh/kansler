import { Badge, Button, CloseButton, Drawer, Flex, Portal, Text } from '@chakra-ui/react'
import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Category } from '@/entities/category/types'
import type { ProductListResult } from '@/mocks/products'
import { FilterPanel } from './FilterPanel'
import { activeFilterCount, EMPTY_FILTERS, type Filters } from './params'

interface MobileFiltersProps {
  value: Filters
  onApply: (f: Filters) => void
  data: Pick<ProductListResult, 'priceRange' | 'colors' | 'categoryCounts'> | undefined
  categories?: Category[]
}

/**
 * Bottom sheet, like the live /mobile-filter page: edit a draft, then "Сохранить" applies or "Отмена" discards.
 * Ref: adidas filter sheet.
 */
export const MobileFilters = ({ value, onApply, data, categories }: MobileFiltersProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)
  const count = activeFilterCount(value)

  return (
    <Drawer.Root
      open={open}
      placement="bottom"
      onOpenChange={(e) => {
        setOpen(e.open)
        if (e.open) setDraft(value)
      }}
    >
      <Drawer.Trigger asChild>
        <Button size="sm" h="40px" variant="outline" bg="bg.surface" borderRadius="primary" gap="2" flexShrink="0">
          <SlidersHorizontal size={16} />
          {t('filter.title')}
          {count > 0 && (
            <Badge size="xs" borderRadius="full" bg="navy.900" color="white" minW="18px" justifyContent="center">
              {count}
            </Badge>
          )}
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content borderTopRadius="modal" maxH="88dvh">
            <Drawer.Header borderBottomWidth="1px" borderColor="border.subtle" py="3">
              <Flex align="center" justify="space-between" w="full" gap="3">
                <Drawer.Title fontSize="lg">{t('filter.title')}</Drawer.Title>
                <Flex align="center" gap="1">
                  {activeFilterCount(draft) > 0 && (
                    <Button size="xs" variant="plain" color="fg.link" onClick={() => setDraft(EMPTY_FILTERS)}>
                      {t('filter.clear_all')}
                    </Button>
                  )}
                  <Drawer.CloseTrigger asChild pos="static">
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                </Flex>
              </Flex>
            </Drawer.Header>
            <Drawer.Body px="4" py="0">
              <FilterPanel value={draft} onChange={setDraft} data={data} categories={categories} />
            </Drawer.Body>
            <Drawer.Footer gap="2" borderTopWidth="1px" borderColor="border.subtle" pb="calc(12px + env(safe-area-inset-bottom))">
              <Button flex="1" h="48px" variant="outline" borderRadius="control" onClick={() => setOpen(false)}>
                {t('filter.reset')}
              </Button>
              <Button
                flex="2"
                h="48px"
                colorPalette="brand"
                borderRadius="control"
                onClick={() => {
                  onApply(draft)
                  setOpen(false)
                }}
              >
                <Text>{t('filter.apply')}</Text>
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
