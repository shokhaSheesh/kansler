import { Accordion, Box, Button, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProductDetails, VariationDetails } from '@/entities/product/types'
import { faqs } from '@/mocks/product-details'
import { useLang } from '@/shared/hooks/useLang'
import { htmlToText, sanitizeHtml } from '@/shared/lib/sanitize'

const card = {
  bg: 'bg.surface',
  borderRadius: 'card',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  p: { base: 4, md: 6 },
} as const

/** "Категория" in the attributes holds promo labels like "35 %"; the breadcrumbs already show the real category. */
const HIDDEN_ATTRS = /^категория$/i

/** О товаре · Описание товара · Часто задаваемые вопросы */
export const ProductInfo = ({ product, variation }: { product: ProductDetails; variation: VariationDetails }) => {
  const { t } = useTranslation()
  const lang = useLang()
  const [expanded, setExpanded] = useState(false)

  // Same attribute name can repeat (one per variant): merge into "240 г/кв.м, 280 г/кв.м"
  const specs = new Map<string, string[]>()
  ;[...product.attributes]
    .sort((a, b) => a.display_order - b.display_order)
    .filter((a) => !HIDDEN_ATTRS.test(a.name_ru))
    .forEach((a) => {
      const k = (lang === 'uz' ? a.name_uz : a.name_ru) || a.name_ru
      const v = ((lang === 'uz' ? a.value_uz : a.value_ru) || a.value_ru).trim()
      if (!v) return
      specs.set(k, [...new Set([...(specs.get(k) ?? []), v])])
    })

  // uz descriptions are often an empty "<p> </p>": fall back to ru
  const raw = lang === 'uz' && htmlToText(variation.description_uz) ? variation.description_uz : variation.description_ru
  const description = sanitizeHtml(raw)
  const long = htmlToText(raw).length > 420

  return (
    <Stack gap="4">
      {specs.size > 0 && (
        <Box {...card}>
          <Heading as="h2" fontSize="lg" fontWeight="700" mb="4">
            {t('product_detail.about_product')}
          </Heading>
          <Grid templateColumns={{ base: '1fr', sm: 'minmax(120px, 200px) 1fr' }} columnGap="6" rowGap={{ base: 1, sm: 0 }}>
            {[...specs].map(([k, values]) => (
              <Box key={k} display="contents">
                <Text fontSize="sm" color="fg.muted" py={{ sm: 2.5 }} pt={{ base: 2 }} borderTopWidth={{ sm: '1px' }} borderColor="border.subtle">
                  {k}
                </Text>
                <Text fontSize="sm" color="fg.default" py={{ sm: 2.5 }} pb={{ base: 2 }} borderTopWidth={{ sm: '1px' }} borderBottomWidth={{ base: '1px', sm: 0 }} borderColor="border.subtle">
                  {values.join(', ')}
                </Text>
              </Box>
            ))}
          </Grid>
        </Box>
      )}

      {description && htmlToText(raw) && (
        <Box {...card}>
          <Heading as="h2" fontSize="lg" fontWeight="700" mb="3">
            {t('product_detail.description')}
          </Heading>
          <Box pos="relative" maxH={long && !expanded ? '168px' : 'none'} overflow="hidden">
            <Box
              fontSize="sm"
              color="fg.body"
              lineHeight="1.7"
              css={{ '& p': { mb: 2 }, '& ul, & ol': { ps: 5, mb: 2 }, '& li': { mb: 1 }, '& a': { color: 'fg.link' } }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
            {long && !expanded && (
              <Box pos="absolute" bottom="0" left="0" right="0" h="64px" bgGradient="to-t" gradientFrom="bg.surface" gradientTo="transparent" />
            )}
          </Box>
          {long && (
            <Button variant="plain" px="0" mt="2" color="fg.link" size="sm" onClick={() => setExpanded((e) => !e)}>
              {expanded ? t('product_detail.read_less') : t('product_detail.read_more')}
            </Button>
          )}
        </Box>
      )}

      {faqs.length > 0 && (
        <Box {...card}>
          <Heading as="h2" fontSize="lg" fontWeight="700" mb="2">
            {t('product_detail.faq_title')}
          </Heading>
          <Accordion.Root collapsible variant="plain">
            {faqs.map((f, i) => (
              <Accordion.Item key={f.guid} value={f.guid} borderTopWidth={i ? '1px' : 0} borderColor="border.subtle">
                <Accordion.ItemTrigger py="3" cursor="pointer" fontWeight="500" fontSize="sm">
                  <Text flex="1" textAlign="start">
                    {htmlToText(lang === 'uz' ? f.question_uz : f.question_ru)}
                  </Text>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody
                    pt="0"
                    pb="4"
                    fontSize="sm"
                    color="fg.muted"
                    lineHeight="1.7"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(lang === 'uz' ? f.answer_uz : f.answer_ru) }}
                  />
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Box>
      )}
    </Stack>
  )
}
