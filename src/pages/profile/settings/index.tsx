import { Box, Flex, Stack, Switch, Text } from '@chakra-ui/react'
import { MessageSquareText, Bell } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { mockProfile } from '@/mocks/profile.store'
import { panel } from '@/shared/ui/surface'
import { ProfileHeader } from '@/widgets/profile/ProfileUi'

type Key = keyof typeof mockProfile.settings

const Toggle = ({ k, label, icon }: { k: Key; label: string; icon: React.ReactNode }) => (
  <Switch.Root
    checked={mockProfile.settings[k]}
    onCheckedChange={() => mockProfile.toggleSetting(k)}
    colorPalette="brand"
    w="full"
    display="flex"
    justifyContent="space-between"
    py="3"
    cursor="pointer"
  >
    <Switch.HiddenInput />
    <Switch.Label display="flex" alignItems="center" gap="3" fontSize="sm" fontWeight="500">
      <Box color="fg.muted">{icon}</Box>
      {label}
    </Switch.Label>
    <Switch.Control>
      <Switch.Thumb />
    </Switch.Control>
  </Switch.Root>
)

/**
 * /profile/settings — live "Настройки": "Статус заказа" and "Рекламные предложения", each with
 * Push ("Уведомления") and SMS switches (Push on, SMS off by default). The current site doesn't save them.
 */
const SettingsPage = observer(() => {
  const { t } = useTranslation()
  const k = 'profile.settings_page'
  const groups: Array<{ title: string; desc: string; push: Key; sms: Key }> = [
    { title: t(`${k}.order_status_title`), desc: t(`${k}.order_status_desc`), push: 'orderPush', sms: 'orderSms' },
    { title: t(`${k}.promotions_title`), desc: t(`${k}.promotions_desc`), push: 'promoPush', sms: 'promoSms' },
  ]
  return (
    <Stack gap={{ base: 4, md: 5 }}>
      {/* Live computer version titles this page "Уведомления" (settings_page.title); the menu and phones say "Настройки" */}
      <ProfileHeader title={t('profile.settings')} />
      <Stack {...panel} gap="0" separator={<Box borderTopWidth="1px" borderColor="border.subtle" />}>
        {groups.map((g) => (
          <Flex key={g.push} direction={{ base: 'column', md: 'row' }} gap={{ base: 2, md: 8 }} px={{ base: 4, md: 6 }} py="5">
            <Box flex="1">
              <Text fontWeight="700">{g.title}</Text>
              <Text fontSize="sm" color="fg.muted" mt="1">
                {g.desc}
              </Text>
            </Box>
            <Stack gap="0" w={{ base: 'full', md: '260px' }} flexShrink="0" separator={<Box borderTopWidth="1px" borderColor="border.subtle" />}>
              <Toggle k={g.push} label={t(`${k}.push`)} icon={<Bell size={17} />} />
              <Toggle k={g.sms} label={t(`${k}.sms`)} icon={<MessageSquareText size={17} />} />
            </Stack>
          </Flex>
        ))}
      </Stack>
    </Stack>
  )
})

export default SettingsPage
