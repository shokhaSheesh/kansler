import { Box, Button, Checkbox, Flex, Separator, Slider, Stack, Text } from '@chakra-ui/react'
import { ChevronRight } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import type { Category } from '@/entities/category/types'
import type { ProductListResult } from '@/mocks/products'
import { useLang } from '@/shared/hooks/useLang'
import { formatPrice, localized } from '@/shared/lib/format'
import { swatchFor } from './colorSwatch'
import type { Filters } from './params'

/**
 * The live filter sidebar: "Категории", then "Фильтры" → "Цена, сум" (range slider) and "Цвет" (list + "Ещё N").
 * Category list: on a category page it navigates (Все категории › current › sub-categories);
 * on search / favourites / all products it filters by one category.
 */
export type CategoryMode =
  | { kind: 'navigate'; current: Category; parent?: Category | null }
  | { kind: 'filter'; options: Category[] }

interface FilterPanelProps {
  value: Filters
  onChange: (f: Filters) => void
  data: Pick<ProductListResult, 'priceRange' | 'colors'> | undefined
  categories: CategoryMode
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <Box py="4">
    <Text fontWeight="600" fontSize="sm" color="fg.default" mb="3">
      {title}
    </Text>
    {children}
  </Box>
)

const CatRow = ({ active, depth = 0, children, ...rest }: { active?: boolean; depth?: number; children: ReactNode } & Record<string, unknown>) => (
  <Flex
    align="center"
    justify="space-between"
    gap="2"
    py="1.5"
    ps={depth * 3}
    fontSize="sm"
    color={active ? 'fg.default' : 'fg.muted'}
    fontWeight={active ? '600' : '400'}
    cursor="pointer"
    _hover={{ color: 'fg.default' }}
    {...rest}
  >
    {children}
  </Flex>
)

// Prices span 101 → 14 186 670 сум, so the slider is logarithmic (otherwise cheap items are unreachable)
const STEPS = 1000
const toPos = (price: number, min: number, max: number) =>
  max <= min ? 0 : Math.round((STEPS * Math.log(Math.max(price, min) / min)) / Math.log(max / min))
const toPrice = (pos: number, min: number, max: number) => (max <= min ? min : Math.round(min * Math.pow(max / min, pos / STEPS)))

const PriceSlider = ({ min, max, value, onChange }: { min: number; max: number; value: [number | null, number | null]; onChange: (v: [number | null, number | null]) => void }) => {
  const lang = useLang()
  const lo = Math.max(1, min)
  const committed = [toPos(value[0] ?? lo, lo, max), toPos(value[1] ?? max, lo, max)]
  const [drag, setDrag] = useState<number[] | null>(null)
  const pos = drag ?? committed
  return (
    <Stack gap="2">
      <Flex justify="space-between" fontSize="sm" color="fg.default" fontWeight="500">
        <Text>{formatPrice(toPrice(pos[0], lo, max), lang)}</Text>
        <Text>{formatPrice(toPrice(pos[1], lo, max), lang)}</Text>
      </Flex>
      <Slider.Root
        min={0}
        max={STEPS}
        value={pos}
        colorPalette="brand"
        size="sm"
        px="2"
        onValueChange={(d) => setDrag(d.value)}
        onValueChangeEnd={(d) => {
          setDrag(null)
          onChange([d.value[0] > 0 ? toPrice(d.value[0], lo, max) : null, d.value[1] < STEPS ? toPrice(d.value[1], lo, max) : null])
        }}
      >
        <Slider.Control>
          <Slider.Track bg="bg.muted">
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
    </Stack>
  )
}

const COLORS_VISIBLE = 8

export const FilterPanel = ({ value, onChange, data, categories }: FilterPanelProps) => {
  const { t } = useTranslation()
  const lang = useLang()
  const [colorsOpen, setColorsOpen] = useState(false)
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch })
  const colors = data?.colors ?? []
  const shownColors = colorsOpen ? colors : colors.slice(0, COLORS_VISIBLE)
  const byOrder = (a: Category, b: Category) => a.display_order - b.display_order

  return (
    <Stack gap="0" separator={<Separator borderColor="border.subtle" />}>
      <Section title={t('filter.categories.title')}>
        {categories.kind === 'navigate' ? (
          <Stack gap="0">
            <CatRow asChild>
              <RouterLink to={paths.catalog}>{t('filter.all_categories')}</RouterLink>
            </CatRow>
            {categories.parent && (
              <CatRow asChild depth={1}>
                <RouterLink to={paths.category(categories.parent.slug)}>{localized(categories.parent, 'name', lang)}</RouterLink>
              </CatRow>
            )}
            <CatRow active depth={categories.parent ? 2 : 1}>
              {localized(categories.current, 'name', lang)}
            </CatRow>
            {[...categories.current.categories_data].sort(byOrder).map((c) => (
              <CatRow key={c.guid} asChild depth={categories.parent ? 3 : 2}>
                <RouterLink to={paths.category(c.slug)}>
                  {localized(c, 'name', lang)}
                  <ChevronRight size={14} />
                </RouterLink>
              </CatRow>
            ))}
          </Stack>
        ) : (
          <Stack gap="0">
            <CatRow active={!value.categoryId} onClick={() => set({ categoryId: null })}>
              {t('filter.all_categories')}
            </CatRow>
            {categories.options.map((c) => (
              <CatRow key={c.guid} depth={1} active={value.categoryId === c.guid} onClick={() => set({ categoryId: c.guid })}>
                {localized(c, 'name', lang)}
              </CatRow>
            ))}
          </Stack>
        )}
      </Section>

      <Box pt="4">
        <Text fontWeight="700" fontSize="md" color="fg.default">
          {t('filter.title')}
        </Text>
      </Box>

      {data && data.priceRange.max > data.priceRange.min && (
        <Section title={t('filter.price.title')}>
          <PriceSlider
            min={data.priceRange.min}
            max={data.priceRange.max}
            value={[value.priceMin, value.priceMax]}
            onChange={([priceMin, priceMax]) => set({ priceMin, priceMax })}
          />
        </Section>
      )}

      {colors.length > 0 && (
        <Section title={t('filter.color.title')}>
          <Stack gap="0">
            {shownColors.map((name) => {
              const sw = swatchFor(name)
              const checked = value.colors.includes(name)
              return (
                <Checkbox.Root
                  key={name}
                  checked={checked}
                  onCheckedChange={() => set({ colors: checked ? value.colors.filter((c) => c !== name) : [...value.colors, name] })}
                  colorPalette="brand"
                  size="sm"
                  py="1.5"
                  cursor="pointer"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control borderRadius="6px" />
                  <Checkbox.Label display="flex" alignItems="center" gap="2" fontWeight="400" fontSize="sm" color="fg.body">
                    <Box
                      boxSize="16px"
                      borderRadius="full"
                      borderWidth="1px"
                      borderColor="blackAlpha.200"
                      css={{ background: sw ?? 'transparent' }}
                      visibility={sw ? 'visible' : 'hidden'}
                    />
                    {name}
                  </Checkbox.Label>
                </Checkbox.Root>
              )
            })}
          </Stack>
          {colors.length > COLORS_VISIBLE && (
            <Button variant="plain" size="xs" px="0" mt="1" color="fg.link" onClick={() => setColorsOpen((o) => !o)}>
              {colorsOpen ? t('filter.color.less') : t('filter.color.more', { count: colors.length - COLORS_VISIBLE })}
            </Button>
          )}
        </Section>
      )}
    </Stack>
  )
}
