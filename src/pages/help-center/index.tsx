import { Accordion, Box, Button, Flex, Grid, Heading, Skeleton, Stack, Text } from '@chakra-ui/react'
import { MessageCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { faqs } from '@/mocks/product-details'
import { useLang } from '@/shared/hooks/useLang'
import { localized } from '@/shared/lib/format'
import { sanitizeHtml } from '@/shared/lib/sanitize'
import { panel } from '@/shared/ui/surface'
import { ProfileHeader } from '@/widgets/profile/ProfileUi'
import { SUPPORT_BOT } from '@/widgets/cart/CartSummary'

interface Section {
  display_order: number
  title_ru: string
  title_uz: string
  description_ru: string
  description_uz: string
}

// Live: /main-page/help-center/list (pages written in the admin panel). Snapshot, loaded on demand.
const loadSections = () => import('@/mocks/fixtures/help-center.json').then((m) => m.default as Section[])

const QUESTIONS = 'questions'

// Typography for the admin-panel HTML
const prose = {
  fontSize: 'sm',
  color: 'fg.body',
  lineHeight: '1.7',
  '& p': { mb: '2.5' },
  '& strong, & b': { color: 'fg.default', fontWeight: '700' },
  '& ul, & ol': { ps: '5', mb: '3' },
  '& li': { mb: '1.5' },
  '& a': { color: 'fg.link', textDecoration: 'underline' },
  '& img': { borderRadius: 'card', my: '3', maxW: 'full', h: 'auto' },
} as const

/**
 * /profile/info — live "Справочный центр": the help pages from the admin panel (Главная, О компании,
 * Условия доставки, оплаты и возврата, Политика конфиденциальности, Контакты), "Вопросы – ответы" (FAQ)
 * and "Поддержка" (support bot). `?infoIndex=N` opens a page, as the live footer links do.
 */
export default function HelpCenterPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const [params, setParams] = useSearchParams()
  const [sections, setSections] = useState<Section[] | null>(null)
  const current = params.get('infoIndex') ?? '1'

  useEffect(() => {
    void loadSections().then(setSections)
  }, [])

  const tabs = useMemo(
    () => [...(sections ?? []).map((s) => ({ id: String(s.display_order), label: localized(s, 'title', lang) })), { id: QUESTIONS, label: t('profile.info.quesanswers') }],
    [sections, lang, t],
  )
  const section = sections?.find((s) => String(s.display_order) === current)
  const html = useMemo(() => sanitizeHtml(section ? localized(section, 'description', lang) : '', { images: true }), [section, lang])

  const open = (id: string) => {
    setParams(id === '1' ? {} : { infoIndex: id })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const support = (
    <Button asChild h="44px" colorPalette="brand" borderRadius="control" gap="2" w="full">
      <a href={SUPPORT_BOT} target="_blank" rel="noreferrer">
        <MessageCircle size={17} />
        {t('profile.info.contact')}
      </a>
    </Button>
  )

  return (
    <Stack gap={{ base: 4, md: 5 }}>
      <ProfileHeader title={t('profile.help_center')} />
      <Grid templateColumns={{ base: 'minmax(0, 1fr)', xl: '240px minmax(0, 1fr)' }} gap={{ base: 4, xl: 6 }} alignItems="start">
        {/* Pages: a list on wide screens, a sideways row of chips otherwise */}
        <Stack gap="3" pos={{ xl: 'sticky' }} top={{ xl: '128px' }}>
          <Flex direction={{ base: 'row', xl: 'column' }} gap="1" overflowX={{ base: 'auto', xl: 'visible' }} mx={{ base: -4, md: 0 }} px={{ base: 4, md: 0 }} css={{ scrollbarWidth: 'none' }}>
            {sections
              ? tabs.map((tab) => {
                  const on = tab.id === current
                  return (
                    <Box
                      key={tab.id}
                      as="button"
                      flexShrink="0"
                      textAlign="start"
                      px={{ base: 4, xl: 3 }}
                      py={{ base: 2, xl: 2.5 }}
                      borderRadius={{ base: 'full', xl: 'primary' }}
                      fontSize="sm"
                      fontWeight={on ? '600' : '500'}
                      whiteSpace={{ base: 'nowrap', xl: 'normal' }}
                      bg={on ? { base: 'navy.900', xl: 'bg.tint' } : { base: 'bg.tile', xl: 'transparent' }}
                      color={on ? { base: 'white', xl: 'fg.default' } : 'fg.body'}
                      borderInlineStartWidth={{ xl: '3px' }}
                      borderColor={on ? 'navy.900' : 'transparent'}
                      _hover={{ bg: on ? undefined : { base: 'kgray.150', xl: 'bg.tint' } }}
                      onClick={() => open(tab.id)}
                    >
                      {tab.label}
                    </Box>
                  )
                })
              : Array.from({ length: 5 }, (_, i) => <Skeleton key={i} h="36px" w={{ base: '120px', xl: 'full' }} borderRadius="primary" flexShrink="0" />)}
          </Flex>
          <Box hideBelow="xl">{support}</Box>
        </Stack>

        <Box {...panel} p={{ base: 5, md: 8 }} minH="320px">
          {current === QUESTIONS ? (
            <>
              <Heading as="h2" fontSize="xl" fontWeight="700" mb="3">
                {t('profile.info.quesanswers')}
              </Heading>
              <Accordion.Root collapsible variant="plain">
                {faqs.map((f) => (
                  <Accordion.Item key={f.guid} value={f.guid} borderBottomWidth="1px" borderColor="border.subtle">
                    <Accordion.ItemTrigger py="4" cursor="pointer" fontWeight="600" fontSize="md">
                      <Box flex="1" textAlign="start" dangerouslySetInnerHTML={{ __html: sanitizeHtml(localized(f, 'question', lang)) }} />
                      <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Accordion.ItemBody pt="0" pb="4" css={prose} dangerouslySetInnerHTML={{ __html: sanitizeHtml(localized(f, 'answer', lang)) }} />
                    </Accordion.ItemContent>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </>
          ) : !sections ? (
            <Stack gap="3">
              <Skeleton h="24px" w="40%" />
              <Skeleton h="14px" />
              <Skeleton h="14px" w="90%" />
              <Skeleton h="14px" w="70%" />
            </Stack>
          ) : section ? (
            <>
              {/* "Главная" is the centre's front page: the page title already says "Справочный центр" */}
              {section.display_order !== 1 && (
                <Heading as="h2" fontSize="xl" fontWeight="700" mb="4">
                  {localized(section, 'title', lang)}
                </Heading>
              )}
              <Box css={prose} dangerouslySetInnerHTML={{ __html: html }} />
            </>
          ) : (
            <Text color="fg.muted">{t('order.list.empty')}</Text>
          )}
        </Box>
        <Box hideFrom="xl">{support}</Box>
      </Grid>
    </Stack>
  )
}
