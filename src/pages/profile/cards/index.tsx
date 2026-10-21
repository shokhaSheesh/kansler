import { Flex, IconButton, Stack } from '@chakra-ui/react'
import { Plus, Trash2 } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { mockProfile, type Card } from '@/mocks/profile.store'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { OtpDialog } from '@/shared/ui/OtpDialog'
import { toaster } from '@/shared/ui/toaster'
import { AddCardDialog } from '@/widgets/checkout/AddCardDialog'
import { BankCard, CARD_SIZE } from '@/widgets/checkout/BankCard'
import { ProfileHeader } from '@/widgets/profile/ProfileUi'

/**
 * /profile/cards — live "Карта": saved corporate cards with delete (confirmation), "Добавить карту" →
 * card number + ММ/ГГ → SMS code. Same cards as in checkout. `?new=1` opens the form.
 */
const CardsPage = observer(() => {
  const { t } = useTranslation()
  const p = mockProfile
  const k = 'profile.cards_page'
  const [params, setParams] = useSearchParams()
  const [addOpen, setAddOpen] = useState(false)
  const [otpFor, setOtpFor] = useState<string | null>(null)
  const [removing, setRemoving] = useState<Card | null>(null)

  useEffect(() => {
    if (params.get('new')) {
      setAddOpen(true)
      setParams({}, { replace: true })
    }
  }, [params, setParams])

  return (
    <Stack gap={{ base: 4, md: 5 }}>
      <ProfileHeader title={t(`${k}.title`)} />
      <Flex gap="4" wrap="wrap">
        {p.cards.map((c) => (
          <BankCard
            key={c.guid}
            card={c}
            corner={
              <IconButton
                aria-label={t('cart.delete')}
                title={t('cart.delete')}
                size="xs"
                variant="ghost"
                color="whiteAlpha.800"
                borderRadius="full"
                _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
                onClick={() => setRemoving(c)}
              >
                <Trash2 size={15} />
              </IconButton>
            }
          />
        ))}
        <Flex
          as="button"
          direction="column"
          align="center"
          justify="center"
          gap="2.5"
          {...CARD_SIZE}
          borderRadius="14px"
          borderWidth="1.5px"
          borderStyle="dashed"
          borderColor="kgray.300"
          bg="bg.tint"
          color="fg.muted"
          fontSize="sm"
          fontWeight="600"
          transition="border-color .2s, color .2s"
          _hover={{ borderColor: 'navy.900', color: 'fg.default' }}
          onClick={() => setAddOpen(true)}
        >
          <Flex boxSize="36px" align="center" justify="center" bg="bg.surface" borderRadius="full" boxShadow="panel">
            <Plus size={18} />
          </Flex>
          {t(`${k}.add_button`)}
        </Flex>
      </Flex>

      <AddCardDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={(pan) => {
          setAddOpen(false)
          setOtpFor(pan.slice(-4))
        }}
      />
      <OtpDialog
        open={otpFor !== null}
        onOpenChange={(o) => !o && setOtpFor(null)}
        phone={p.user.phone}
        onConfirm={async (code) => {
          await new Promise((r) => setTimeout(r, 500))
          if (code === '000000') return false
          p.addCard(otpFor!)
          setOtpFor(null)
          toaster.create({ type: 'success', title: t('order.otp.success'), duration: 2500 })
          return true
        }}
      />
      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(o) => !o && setRemoving(null)}
        title={t(`${k}.confirm_delete_title`)}
        description={t(`${k}.confirm_delete_description`)}
        cancelText={t(`${k}.confirm_delete_cancel`)}
        confirmText={t(`${k}.confirm_delete_confirm`)}
        onConfirm={() => removing && p.removeCard(removing.guid)}
      />
    </Stack>
  )
})

export default CardsPage
