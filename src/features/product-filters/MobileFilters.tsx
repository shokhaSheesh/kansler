import { Badge, Button, CloseButton, Drawer, Flex, Portal } from '@chakra-ui/react'
import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProductListResult } from '@/mocks/products'
import { FilterPanel, type CategoryMode } from './FilterPanel'
import { activeFilterCount, type Filters } from './params'

interface MobileFiltersProps {
  value: Filters
  onChange: (f: Filters) => void
  data: Pick<ProductListResult, 'priceRange' | 'colors'> | undefined
  categories: CategoryMode
}

/** Phone: the live /mobile-filter page becomes a bottom sheet over the list. Filters apply immediately, like live. */
export const MobileFilters = ({ value, onChange, data, categories }: MobileFiltersProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const count = activeFilterCount(value)

  return (
    <Drawer.Root open={open} placement="bottom" onOpenChange={(e) => setOpen(e.open)}>
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
              <Flex align="center" justify="space-between" w="full">
                <Drawer.Title fontSize="lg">{t('filter.title')}</Drawer.Title>
                <Drawer.CloseTrigger asChild pos="static">
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Flex>
            </Drawer.Header>
            <Drawer.Body px="4" py="0" pb="calc(16px + env(safe-area-inset-bottom))">
              <FilterPanel value={value} onChange={onChange} data={data} categories={categories} />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
