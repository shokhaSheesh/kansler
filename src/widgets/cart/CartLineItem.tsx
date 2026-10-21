import { Box, Checkbox, Flex, IconButton, Image, Stack, Text } from '@chakra-ui/react'
import { Trash2 } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { mockCart, type CartLine } from '@/mocks/cart.store'
import { useLang } from '@/shared/hooks/useLang'
import { formatPrice } from '@/shared/lib/format'
import { Price } from '@/shared/ui/Price'
import { QuantityStepper } from '@/shared/ui/QuantityStepper'

/** Live cart line: checkbox, photo, name (→ product), price + old price, quantity (max = stock), delete. */
export const CartLineItem = observer(({ line, checked, onToggle }: { line: CartLine; checked: boolean; onToggle: () => void }) => {
  const { t } = useTranslation()
  const lang = useLang()
  const v = line.variation
  const href = paths.product(v.product_group_id)
  const discount = v.discount_percent ?? 0
  const setQty = (n: number) => mockCart.set(v, n, line.price, line.name)

  return (
    <Flex gap={{ base: 3, md: 4 }} py="4" align={{ base: 'flex-start', md: 'center' }}>
      <Checkbox.Root checked={checked} onCheckedChange={onToggle} colorPalette="brand" mt={{ base: 6, md: 0 }} aria-label={line.name}>
        <Checkbox.HiddenInput />
        <Checkbox.Control borderRadius="6px" />
      </Checkbox.Root>

      <RouterLink to={href}>
        <Box boxSize={{ base: '72px', md: '80px' }} flexShrink="0" bg="kgray.50" borderRadius="control" overflow="hidden">
          <Image src={v.image[0]} alt={line.name} w="full" h="full" fit="contain" p="1.5" mixBlendMode="multiply" />
        </Box>
      </RouterLink>

      <Flex flex="1" minW="0" gap={{ base: 2, md: 4 }} direction={{ base: 'column', md: 'row' }} align={{ base: 'stretch', md: 'center' }}>
        <Stack flex="1" minW="0" gap="1">
          <RouterLink to={href}>
            <Text fontSize="sm" fontWeight="500" color="fg.default" lineClamp="2" _hover={{ color: 'fg.link' }}>
              {line.name}
            </Text>
          </RouterLink>
          <Price value={line.price} oldValue={discount ? v.price : null} size="sm" />
          {line.qty > 1 && (
            <Text hideFrom="md" fontSize="xs" color="fg.muted">
              × {line.qty} = <b>{formatPrice(line.price * line.qty, lang)}</b>
            </Text>
          )}
        </Stack>

        <Flex align="center" gap="3" justify={{ base: 'space-between', md: 'flex-end' }}>
          <Box w="132px" flexShrink="0">
            <QuantityStepper value={line.qty} max={v.in_stock} onChange={setQty} />
          </Box>
          <Text hideBelow="md" w="140px" textAlign="end" fontWeight="700" color="fg.default" whiteSpace="nowrap">
            {formatPrice(line.price * line.qty, lang)}
          </Text>
          <IconButton aria-label={t('cart.delete')} title={t('cart.delete')} variant="ghost" size="sm" color="fg.subtle" _hover={{ color: 'fg.error', bg: 'primary.50' }} onClick={() => setQty(0)}>
            <Trash2 size={18} />
          </IconButton>
        </Flex>
      </Flex>
    </Flex>
  )
})
