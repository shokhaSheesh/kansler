import { Box, Button, Checkbox, Flex, Grid, Heading, Separator, Stack, Text } from '@chakra-ui/react'
import { ShoppingCart } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { shelves } from '@/mocks'
import { mockCart } from '@/mocks/cart.store'
import { useLang } from '@/shared/hooks/useLang'
import { formatPrice } from '@/shared/lib/format'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { CartLineItem } from '@/widgets/cart/CartLineItem'
import { CartSummary } from '@/widgets/cart/CartSummary'
import { ProductShelf } from '@/widgets/home/ProductShelf'

/**
 * /cart — same content as live: select all / delete selected, lines (checkbox, photo, name, price, quantity,
 * delete), "Ваш заказ" (free-delivery progress, Товары (N), Итого, Перейти к оформлению, support bot),
 * empty state, "Рекомендуем". Totals count the selected lines, like live.
 */
const CartPage = observer(() => {
  const { t } = useTranslation()
  const lang = useLang()
  // Track what's *un*selected: everything (and anything added later) starts selected
  const [unselected, setUnselected] = useState<Set<string>>(() => new Set())
  const lines = mockCart.lines
  const selected = lines.filter((l) => !unselected.has(l.variation.guid))
  const total = selected.reduce((sum, l) => sum + l.qty * l.price, 0)
  const allOn = lines.length > 0 && selected.length === lines.length

  const toggle = (id: string) =>
    setUnselected((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const toggleAll = () => setUnselected(allOn ? new Set(lines.map((l) => l.variation.guid)) : new Set())

  return (
    <Stack gap={{ base: 6, md: 10 }} pb={{ base: lines.length ? '84px' : 0, md: 0 }}>
      <Stack gap="2">
        <Breadcrumbs items={[{ label: t('favourites.breadcrumb.home'), to: paths.home }, { label: t('cart.title') }]} />
        <Flex align="baseline" gap="3">
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700" color="fg.default">
            {t('cart.title')}
          </Heading>
          {lines.length > 0 && (
            <Text color="fg.muted">
              {lines.length} {t('cart.products')}
            </Text>
          )}
        </Flex>
      </Stack>

      {lines.length === 0 ? (
        <Flex direction="column" align="center" textAlign="center" gap="2" py={{ base: 12, md: 16 }} px="6" bg="bg.surface" borderRadius="modal">
          <Flex boxSize="80px" align="center" justify="center" borderRadius="full" bg="bg.muted" mb="4">
            <ShoppingCart size={32} />
          </Flex>
          <Text fontSize="lg" fontWeight="600" color="fg.default">
            {t('cart.empty_title')}
          </Text>
          <Text fontSize="sm" color="fg.muted" maxW="360px" mb="4">
            {t('cart.empty_description')}
          </Text>
          <Button asChild colorPalette="brand" borderRadius="control" h="48px" px="6">
            <RouterLink to={paths.home}>{t('cart.start_shopping')}</RouterLink>
          </Button>
        </Flex>
      ) : (
        <Grid templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 380px' }} gap="6" alignItems="start">
          <Box bg="bg.surface" borderRadius="card" borderWidth="1px" borderColor="border.subtle" px={{ base: 4, md: 6 }} py="2">
            <Flex align="center" gap="3" py="3">
              <Checkbox.Root checked={allOn ? true : selected.length ? 'indeterminate' : false} onCheckedChange={toggleAll} colorPalette="brand" cursor="pointer">
                <Checkbox.HiddenInput />
                <Checkbox.Control borderRadius="6px" />
                <Checkbox.Label fontSize="sm" fontWeight="500">
                  {allOn ? t('cart.unselect_all') : t('cart.select_all')}
                </Checkbox.Label>
              </Checkbox.Root>
              {selected.length > 0 && (
                <Button ms="auto" variant="ghost" size="sm" color="fg.muted" _hover={{ color: 'fg.error', bg: 'primary.50' }} onClick={() => mockCart.remove(selected.map((l) => l.variation.guid))}>
                  {t('cart.delete_selected')}
                </Button>
              )}
            </Flex>
            <Stack gap="0" separator={<Separator borderColor="border.subtle" />} borderTopWidth="1px" borderColor="border.subtle">
              {lines.map((l) => (
                <CartLineItem key={l.variation.guid} line={l} checked={!unselected.has(l.variation.guid)} onToggle={() => toggle(l.variation.guid)} />
              ))}
            </Stack>
          </Box>

          <Box pos={{ lg: 'sticky' }} top={{ lg: '128px' }}>
            <CartSummary count={selected.length} total={total} freeFrom={mockCart.delivery.free_from} />
          </Box>
        </Grid>
      )}

      <ProductShelf title={t('recommended_products')} products={shelves.recommended} />

      {/* Phone: total + checkout always in reach (above the tab bar) */}
      {lines.length > 0 && (
        <Flex hideFrom="md" pos="fixed" left="0" right="0" bottom="64px" zIndex="sticky" bg="bg.surface" borderTopWidth="1px" borderColor="border.subtle" px="4" py="2.5" gap="3" align="center" boxShadow="0 -4px 16px rgba(16, 24, 40, 0.06)">
          <Box flexShrink="0">
            <Text fontSize="xs" color="fg.muted">
              {t('cart.total')} ({selected.length})
            </Text>
            <Text fontWeight="800" color="fg.default">
              {formatPrice(total, lang)}
            </Text>
          </Box>
          <Button asChild flex="1" h="48px" colorPalette="brand" borderRadius="control" pointerEvents={selected.length ? undefined : 'none'} opacity={selected.length ? 1 : 0.5}>
            <RouterLink to={paths.checkout}>{t('cart.proceed_to_checkout')}</RouterLink>
          </Button>
        </Flex>
      )}
    </Stack>
  )
})

export default CartPage
