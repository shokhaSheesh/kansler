import { Box, Button, Checkbox, Flex, HStack, Image, Input, InputGroup, Separator, Slider, Stack, Text } from '@chakra-ui/react'
import { Search } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Category } from '@/entities/category/types'
import type { ProductListResult, ProductType } from '@/mocks/products'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { swatchFor } from './colorSwatch'
import type { Filters } from './params'

interface FilterPanelProps {
  value: Filters
  onChange: (f: Filters) => void
  data: Pick<ProductListResult, 'priceRange' | 'colors' | 'categoryCounts'> | undefined
  /** /products only: multi-select of top-level categories. */
  categories?: Category[]
}

const Section = ({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) => (
  <Box py="4">
    <Flex justify="space-between" align="center" mb="3">
      <Text fontWeight="600" fontSize="sm" color="fg.default">
        {title}
      </Text>
      {aside}
    </Flex>
    {children}
  </Box>
)

const CheckRow = ({
  checked,
  onToggle,
  icon,
  label,
  count,
}: {
  checked: boolean
  onToggle: () => void
  icon?: ReactNode
  label: string
  count?: number
}) => {
  // Zero results with the other filters: keep visible (no jumping list) but disabled
  const disabled = !checked && count === 0
  return (
  <Checkbox.Root
    checked={checked}
    onCheckedChange={onToggle}
    disabled={disabled}
    colorPalette="brand"
    size="sm"
    w="full"
    py="1.5"
    cursor={disabled ? 'default' : 'pointer'}
    opacity={disabled ? 0.45 : 1}
  >
    <Checkbox.HiddenInput />
    <Checkbox.Control borderRadius="6px" />
    <Checkbox.Label flex="1" display="flex" alignItems="center" gap="2" fontWeight="400" fontSize="sm" color="fg.body" minW="0">
      {icon}
      <Text as="span" truncate flex="1">
        {label}
      </Text>
      {count != null && (
        <Text as="span" color="fg.subtle" fontSize="xs">
          {count}
        </Text>
      )}
    </Checkbox.Label>
  </Checkbox.Root>
  )
}

// ---- price: prices span 101 → 14 186 670 сум, so the slider is logarithmic ----------------------
const STEPS = 1000
const toPos = (price: number, min: number, max: number) =>
  max <= min ? 0 : Math.round((STEPS * Math.log(Math.max(price, min) / min)) / Math.log(max / min))
const toPrice = (pos: number, min: number, max: number) =>
  max <= min ? min : Math.round(min * Math.pow(max / min, pos / STEPS))
const fmt = (n: number | null) => (n == null ? '' : new Intl.NumberFormat('ru-RU').format(Math.round(n)).replace(/ /g, ' '))
const parse = (s: string) => (s.replace(/\D/g, '') ? Number(s.replace(/\D/g, '')) : null)

const PriceFilter = ({
  min,
  max,
  value,
  onChange,
}: {
  min: number
  max: number
  value: [number | null, number | null]
  onChange: (v: [number | null, number | null]) => void
}) => {
  const { t } = useTranslation()
  const lo = Math.max(1, Math.floor(min))
  const [draft, setDraft] = useState<[string, string]>([fmt(value[0]), fmt(value[1])])
  const [synced, setSynced] = useState(value)
  if (synced[0] !== value[0] || synced[1] !== value[1]) {
    setSynced(value)
    setDraft([fmt(value[0]), fmt(value[1])])
  }
  const committed: [number, number] = [toPos(value[0] ?? lo, lo, max), toPos(value[1] ?? max, lo, max)]
  const [dragPos, setDragPos] = useState<number[] | null>(null)

  const commit = (d: [string, string]) => {
    let a = parse(d[0])
    let b = parse(d[1])
    if (a != null && b != null && a > b) [a, b] = [b, a]
    onChange([a != null && a > lo ? a : null, b != null && b < max ? b : null])
  }

  const field = (i: 0 | 1, prefix: string) => (
    <InputGroup startElement={<Text fontSize="xs" color="fg.subtle">{prefix}</Text>} startElementProps={{ ps: '3' }}>
      <Input
        value={draft[i]}
        inputMode="numeric"
        placeholder={fmt(i === 0 ? lo : max)}
        size="sm"
        ps="8"
        borderRadius="primary"
        bg="bg.surface"
        onChange={(e) => {
          const next: [string, string] = [...draft]
          next[i] = fmt(parse(e.target.value))
          setDraft(next)
        }}
        onBlur={() => commit(draft)}
        onKeyDown={(e) => e.key === 'Enter' && commit(draft)}
      />
    </InputGroup>
  )

  return (
    <Stack gap="4">
      <HStack gap="2">
        {field(0, t('filter.price.from'))}
        {field(1, t('filter.price.to'))}
      </HStack>
      <Slider.Root
        min={0}
        max={STEPS}
        value={dragPos ?? committed}
        colorPalette="brand"
        size="sm"
        px="2"
        onValueChange={(d) => {
          setDragPos(d.value)
          setDraft([fmt(toPrice(d.value[0], lo, max)), fmt(toPrice(d.value[1], lo, max))])
        }}
        onValueChangeEnd={(d) => {
          setDragPos(null)
          const a = toPrice(d.value[0], lo, max)
          const b = toPrice(d.value[1], lo, max)
          onChange([d.value[0] > 0 ? a : null, d.value[1] < STEPS ? b : null])
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

// ---- panel ---------------------------------------------------------------------------------------
const COLORS_VISIBLE = 8
const CATEGORIES_VISIBLE = 8

export const FilterPanel = ({ value, onChange, data, categories }: FilterPanelProps) => {
  const { t } = useTranslation()
  const lang = useLang()
  const [colorsOpen, setColorsOpen] = useState(false)
  const [catQuery, setCatQuery] = useState('')
  const [catsOpen, setCatsOpen] = useState(false)

  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch })
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  const types: ProductType[] = ['all', 'super_discount', 'best_selling', 'hit_product']
  const colors = data?.colors ?? []
  const shownColors = colorsOpen ? colors : colors.slice(0, COLORS_VISIBLE)

  const cats = (categories ?? []).filter((c) =>
    localized(c, 'name', lang).toLowerCase().includes(catQuery.trim().toLowerCase()),
  )
  const shownCats = catsOpen || catQuery ? cats : cats.slice(0, CATEGORIES_VISIBLE)

  return (
    <Stack gap="0" separator={<Separator borderColor="border.subtle" />}>
      {categories && categories.length > 0 && (
        <Section
          title={t('filter.categories.title')}
          aside={
            value.categoryIds.length > 0 && (
              <Text fontSize="xs" color="fg.muted">
                {t('filter.categories.selected', { count: value.categoryIds.length })}
              </Text>
            )
          }
        >
          <InputGroup startElement={<Search size={14} />} mb="2">
            <Input
              size="sm"
              borderRadius="primary"
              bg="bg.surface"
              placeholder={t('filter.categories.search')}
              value={catQuery}
              onChange={(e) => setCatQuery(e.target.value)}
            />
          </InputGroup>
          <Stack gap="0">
            {shownCats.map((c) => (
              <CheckRow
                key={c.guid}
                checked={value.categoryIds.includes(c.guid)}
                onToggle={() => set({ categoryIds: toggle(value.categoryIds, c.guid) })}
                icon={c.image ? <Image src={c.image} alt="" boxSize="20px" fit="contain" /> : undefined}
                label={localized(c, 'name', lang)}
                count={data?.categoryCounts[c.guid] ?? 0}
              />
            ))}
          </Stack>
          {!catQuery && cats.length > CATEGORIES_VISIBLE && (
            <Button variant="plain" size="xs" px="0" color="fg.link" onClick={() => setCatsOpen((o) => !o)}>
              {catsOpen ? t('filter.color.less') : t('filter.color.more', { count: cats.length - CATEGORIES_VISIBLE })}
            </Button>
          )}
        </Section>
      )}

      <Section title={t('filter.product_type.title')}>
        <Flex wrap="wrap" gap="2">
          {types.map((type) => {
            const on = value.type === type
            return (
              <Button
                key={type}
                size="xs"
                h="32px"
                px="3"
                borderRadius="full"
                variant={on ? 'solid' : 'outline'}
                colorPalette={on ? 'brand' : undefined}
                bg={on ? undefined : 'bg.surface'}
                borderColor="border.default"
                fontWeight="500"
                onClick={() => set({ type })}
              >
                {t(`filter.product_type.${type}`)}
              </Button>
            )
          })}
        </Flex>
      </Section>

      {data && data.priceRange.max > data.priceRange.min && (
        <Section title={t('filter.price.title')}>
          <PriceFilter
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
            {shownColors.map(({ name, count }) => {
              const sw = swatchFor(name)
              return (
                <CheckRow
                  key={name}
                  checked={value.colors.includes(name)}
                  onToggle={() => set({ colors: toggle(value.colors, name) })}
                  icon={
                    <Box
                      boxSize="16px"
                      flexShrink="0"
                      borderRadius="full"
                      borderWidth="1px"
                      borderColor="blackAlpha.200"
                      css={{ background: sw ?? 'transparent' }}
                      visibility={sw ? 'visible' : 'hidden'}
                    />
                  }
                  label={name}
                  count={count}
                />
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
