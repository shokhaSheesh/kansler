import { Box, Button, Flex, IconButton, Input, Stack, Text } from '@chakra-ui/react'
import { Crown, Pencil } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { mockProfile } from '@/mocks/profile.store'
import { fullPhone, localDigits } from '@/shared/lib/phone'
import { OtpDialog } from '@/shared/ui/OtpDialog'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { ResponsiveDialog } from '@/shared/ui/ResponsiveDialog'
import { panel } from '@/shared/ui/surface'
import { toaster } from '@/shared/ui/toaster'
import { ProfileHeader } from '@/widgets/profile/ProfileUi'

const Field = ({ label, value, onEdit, editLabel }: { label: string; value: ReactNode; onEdit: () => void; editLabel: string }) => (
  <Flex align="center" gap="3" py="4" px={{ base: 4, md: 5 }}>
    <Box flex="1" minW="0">
      <Text fontSize="xs" color="fg.muted">
        {label}
      </Text>
      <Text fontSize="md" fontWeight="600" mt="0.5" fontVariantNumeric="tabular-nums">
        {value}
      </Text>
    </Box>
    <IconButton aria-label={editLabel} title={editLabel} variant="ghost" size="sm" color="fg.muted" onClick={onEdit}>
      <Pencil size={16} />
    </IconButton>
  </Flex>
)

/**
 * /profile/user — live "Личная Информация": VIP banner (for VIP clients), ФИО and phone with edit buttons.
 * Name: "Редактировать" window. Phone: new number, then the SMS code sent to it.
 */
const ProfileUserPage = observer(() => {
  const { t } = useTranslation()
  const p = mockProfile
  const k = 'profile.personal_info'
  const [nameOpen, setNameOpen] = useState(false)
  const [name, setName] = useState('')
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [otpOpen, setOtpOpen] = useState(false)

  const saved = () => toaster.create({ type: 'success', title: t(`${k}.update_success`), duration: 2500 })

  return (
    <Stack gap={{ base: 4, md: 5 }}>
      <ProfileHeader title={t('profile.personal_info_title')} />

      {p.user.vip && (
        <Flex
          pos="relative"
          overflow="hidden"
          gap="4"
          align="center"
          p={{ base: 4, md: 6 }}
          borderRadius="card"
          color="white"
          // Live banner gradient (greens of the logo dot)
          bgImage="linear-gradient(100deg, #094827 0%, #046E36 55%, #08E18A 130%)"
        >
          <Flex boxSize="48px" flexShrink="0" align="center" justify="center" borderRadius="full" bg="whiteAlpha.200">
            <Crown size={24} />
          </Flex>
          <Box>
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="700">
              {t('profile.vip_client.title')}
            </Text>
            <Text fontSize="sm" opacity="0.85">
              {t('profile.vip_client.description')}
            </Text>
          </Box>
          <Box pos="absolute" right="-40px" top="-60px" boxSize="180px" borderRadius="full" bg="whiteAlpha.100" pointerEvents="none" />
        </Flex>
      )}

      <Stack {...panel} gap="0" separator={<Box borderTopWidth="1px" borderColor="border.subtle" />}>
        <Field
          label={t('profile.detail.full_name')}
          value={p.user.fullname || t('profile.default_name')}
          editLabel={t(`${k}.edit_title`)}
          onEdit={() => {
            setName(p.user.fullname)
            setNameOpen(true)
          }}
        />
        <Field
          label={t('profile.detail.phone_number')}
          value={p.user.phone}
          editLabel={t('profile.detail.edit_phone.title')}
          onEdit={() => {
            setPhone(localDigits(p.user.phone))
            setPhoneOpen(true)
          }}
        />
      </Stack>

      <ResponsiveDialog
        open={nameOpen}
        onOpenChange={setNameOpen}
        title={t(`${k}.edit_title`)}
        size="sm"
        footer={
          <Button
            w="full"
            h="48px"
            colorPalette="brand"
            borderRadius="control"
            disabled={!name.trim() || name.trim() === p.user.fullname}
            onClick={() => {
              p.setFullname(name.trim())
              setNameOpen(false)
              saved()
            }}
          >
            {t(`${k}.save_button`)}
          </Button>
        }
      >
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t(`${k}.fullname_placeholder`)} h="48px" borderRadius="control" fontSize="md" autoFocus />
      </ResponsiveDialog>

      <ResponsiveDialog
        open={phoneOpen}
        onOpenChange={setPhoneOpen}
        title={t('profile.detail.edit_phone.title')}
        size="sm"
        footer={
          <Button
            w="full"
            h="48px"
            colorPalette="brand"
            borderRadius="control"
            disabled={phone.length !== 9 || fullPhone(phone) === p.user.phone}
            onClick={() => {
              setPhoneOpen(false)
              setOtpOpen(true)
            }}
          >
            {t(`${k}.save_button`)}
          </Button>
        }
      >
        <PhoneInput value={phone} onChange={setPhone} placeholder={t('profile.detail.edit_phone.phone_placeholder')} />
      </ResponsiveDialog>

      <OtpDialog
        open={otpOpen}
        onOpenChange={setOtpOpen}
        phone={fullPhone(phone)}
        texts={{
          title: t(`${k}.otp.title`),
          description: t(`${k}.otp.description`),
          error: t(`${k}.otp.error`),
          resendQuestion: t(`${k}.otp.resend_question`),
          resendAction: t(`${k}.otp.resend_action`),
        }}
        onConfirm={async (code) => {
          // Design phase: any 6 digits except 000000
          await new Promise((r) => setTimeout(r, 500))
          if (code === '000000') return false
          p.setPhone(fullPhone(phone))
          setOtpOpen(false)
          saved()
          return true
        }}
      />
    </Stack>
  )
})

export default ProfileUserPage
