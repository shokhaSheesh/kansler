import { Box, Flex, HoverCard, Image, Portal, Separator, Stack, Text } from '@chakra-ui/react'
import { ShoppingCart } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { mockCart } from '@/mocks/cart.store'
import { useLang } from '@/shared/hooks/useLang'
import { formatPrice } from '@/shared/lib/format'

/**
 * Live header cart preview on hover ("Моя корзина"): count, lines (photo, "name (Nx)", price + old price),
 * empty message, "Итого". Desktop only; the icon itself still opens /cart.
 */
export const CartPreview = observer(({ children }: { children: ReactNode }) => {
  const { t } = useTranslation()
  const lang = useLang()
  const lines = mockCart.lines

  return (
    <HoverCard.Root openDelay={150} closeDelay={150} positioning={{ placement: 'bottom-end', offset: { mainAxis: 10 } }}>
      <HoverCard.Trigger asChild>
        <Box>{children}</Box>
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content w="400px" maxH="520px" p="0" borderRadius="modal" boxShadow="0 24px 48px rgba(16, 24, 40, 0.18)" overflow="hidden">
            <Stack gap="0" maxH="520px">
              <Box px="5" pt="4" pb="3">
                <Text fontSize="lg" fontWeight="600" color="fg.default">
                  {t('cart.cart_hover.title')}
                </Text>
                {lines.length > 0 && (
                  <Text fontSize="sm" color="fg.muted">
                    {lines.length} {t('cart.products')}
                  </Text>
                )}
              </Box>
              <Separator borderColor="border.subtle" />
              {lines.length === 0 ? (
                <Flex direction="column" align="center" textAlign="center" gap="1.5" py="8" px="6">
                  <Flex boxSize="48px" align="center" justify="center" borderRadius="full" bg="bg.muted" mb="2">
                    <ShoppingCart size={22} />
                  </Flex>
                  <Text fontWeight="600">{t('cart.empty_title')}</Text>
                  <Text fontSize="xs" color="fg.muted">
                    {t('cart.empty_description')}
                  </Text>
                </Flex>
              ) : (
                <>
                  <Stack gap="0" overflowY="auto" px="5" separator={<Separator borderColor="border.subtle" />}>
                    {lines.map((l) => (
                      <Flex key={l.variation.guid} gap="3" py="3" align="flex-start">
                        <Box boxSize="56px" flexShrink="0" bg="kgray.50" borderRadius="primary" overflow="hidden">
                          <Image src={l.variation.image[0]} alt="" w="full" h="full" fit="contain" p="1" mixBlendMode="multiply" />
                        </Box>
                        <Box minW="0" flex="1">
                          <Text fontSize="sm" color="fg.default" lineClamp="2">
                            {l.name}{' '}
                            <Text as="span" color="fg.muted">
                              ({l.qty}x)
                            </Text>
                          </Text>
                          <Flex gap="1.5" align="baseline">
                            <Text fontSize="sm" fontWeight="600">
                              {formatPrice(l.price, lang)}
                            </Text>
                            {l.variation.discount_percent ? (
                              <Text fontSize="xs" color="fg.subtle" textDecoration="line-through">
                                {formatPrice(l.variation.price, lang)}
                              </Text>
                            ) : null}
                          </Flex>
                        </Box>
                      </Flex>
                    ))}
                  </Stack>
                  <Separator borderColor="border.subtle" />
                  <Flex justify="space-between" px="5" py="4">
                    <Text color="fg.muted">{t('cart.total')}</Text>
                    <Text fontWeight="700">{formatPrice(mockCart.total, lang)}</Text>
                  </Flex>
                </>
              )}
            </Stack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  )
})
