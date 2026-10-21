import { Box, Button, Field, Flex, Grid, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import { MapPin } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { mockProfile, SAMPLE_MAP_ADDRESSES, type Address } from '@/mocks/profile.store'
import { ResponsiveDialog } from '@/shared/ui/ResponsiveDialog'

type Draft = Omit<Address, 'guid' | 'is_default'>
const EMPTY: Draft = { address: '', apartment: '', floor: '', comment: '' }

/** Live rule: every word of the comment is at most 20 letters (the error text says something else, see CHANGES). */
const commentOk = (c = '') =>
  c
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => w.length <= 20)

/**
 * Design stand-in for the live Yandex map: streets drawn in CSS, tap anywhere to "pick" a point.
 * Wiring: Yandex Maps (same as live), limited to Tashkent ("Вы можете выбрать только в пределах города Ташкента").
 */
const MapStandIn = ({ onPick, picked }: { onPick: (pos: { x: number; y: number }) => void; picked: { x: number; y: number } | null }) => (
  <Box
    pos="relative"
    h="full"
    minH={{ base: '200px', md: '100%' }}
    borderRadius={{ base: 'card', md: 0 }}
    overflow="hidden"
    cursor="crosshair"
    bg="#EEF1F4"
    bgImage={[
      'radial-gradient(circle at 72% 28%, #D7EBD3 0 46px, transparent 47px)',
      'radial-gradient(circle at 18% 78%, #D7EBD3 0 34px, transparent 35px)',
      'linear-gradient(32deg, transparent 47%, #FBE3A6 47%, #FBE3A6 51%, transparent 51%)',
      'linear-gradient(#fff 7px, transparent 7px)',
      'linear-gradient(90deg, #fff 7px, transparent 7px)',
    ].join(',')}
    bgSize="100% 100%, 100% 100%, 100% 100%, 100% 84px, 112px 100%"
    onClick={(e) => {
      const r = e.currentTarget.getBoundingClientRect()
      onPick({
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      })
    }}
  >
    <Box
      pos="absolute"
      left={`${picked?.x ?? 50}%`}
      top={`${picked?.y ?? 50}%`}
      transform="translate(-50%, -100%)"
      color="navy.900"
      transition="left .25s, top .25s"
      filter="drop-shadow(0 4px 6px rgba(16,24,40,.3))"
      pointerEvents="none"
    >
      <MapPin size={40} fill="var(--chakra-colors-accent-main)" strokeWidth={1.6} />
    </Box>
  </Box>
)

/** Live "Куда привезти заказ?": map + Город, улица, дом · Квартира / Офис · Этаж · Комментарий для курьера · "Привезти сюда". */
export const AddressDialog = ({ open, onOpenChange, edit, onSaved }: { open: boolean; onOpenChange: (o: boolean) => void; edit?: Address | null; onSaved?: (guid: string) => void }) => {
  const { t } = useTranslation()
  const k = 'order.add_location'
  const [d, setD] = useState<Draft>(EMPTY)
  const [picked, setPicked] = useState<{ x: number; y: number } | null>(null)
  const [tried, setTried] = useState(false)

  // Fresh form every time the window opens (reset during render, React's pattern for this)
  const [wasOpen, setWasOpen] = useState(false)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setD(
        edit
          ? {
              address: edit.address,
              apartment: edit.apartment,
              floor: edit.floor,
              comment: edit.comment ?? '',
            }
          : EMPTY,
      )
      setPicked(null)
      setTried(false)
    }
  }

  const set = (patch: Partial<Draft>) => setD((x) => ({ ...x, ...patch }))
  const valid = d.address.trim() && d.apartment.trim() && d.floor.trim() && commentOk(d.comment)

  const save = () => {
    setTried(true)
    if (!valid) return
    const guid = mockProfile.saveAddress({ ...d, address: d.address.trim(), comment: d.comment?.trim() }, edit?.guid)
    onOpenChange(false)
    onSaved?.(guid)
  }

  const err = (v: string) => tried && !v.trim()

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange} title={t(`${k}.title`)} size="xl">
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={{ base: 4, md: 0 }} mx={{ md: -6 }} mb={{ md: -6 }} minH={{ md: '440px' }}>
        <Stack gap="3" px={{ md: 6 }} pb={{ md: 6 }} order={{ base: 2, md: 1 }}>
          <Text fontSize="sm" color="fg.muted" mt="-1">
            {t(`${k}.subtitle`)}
          </Text>
          <Field.Root invalid={err(d.address)}>
            <Input value={d.address} onChange={(e) => set({ address: e.target.value })} placeholder={t(`${k}.address`)} h="48px" borderRadius="control" />
          </Field.Root>
          <Flex gap="3">
            <Field.Root invalid={err(d.apartment)}>
              <Input value={d.apartment} maxLength={5} onChange={(e) => set({ apartment: e.target.value })} placeholder={t(`${k}.apartment`)} h="48px" borderRadius="control" />
            </Field.Root>
            <Field.Root invalid={err(d.floor)}>
              <Input value={d.floor} maxLength={3} inputMode="numeric" onChange={(e) => set({ floor: e.target.value })} placeholder={t(`${k}.floor`)} h="48px" borderRadius="control" />
            </Field.Root>
          </Flex>
          <Field.Root invalid={!commentOk(d.comment)}>
            <Textarea value={d.comment} maxLength={220} rows={4} resize="none" onChange={(e) => set({ comment: e.target.value })} placeholder={t(`${k}.comment`)} borderRadius="control" />
            <Flex w="full" justify="space-between" gap="3" fontSize="xs">
              <Field.ErrorText>{t(`${k}.comment_error`)}</Field.ErrorText>
              <Text color="fg.subtle" ms="auto">
                {d.comment?.length ?? 0}/220
              </Text>
            </Flex>
          </Field.Root>
          <Box flex="1" />
          <Button h="48px" colorPalette="brand" borderRadius="control" onClick={save}>
            {t(`${k}.deliver`)}
          </Button>
        </Stack>
        <Box order={{ base: 1, md: 2 }} borderEndRadius={{ md: 'modal' }} overflow="hidden">
          <MapStandIn
            picked={picked}
            onPick={(pos) => {
              setPicked(pos)
              // Design phase: the tapped point becomes one of the sample Tashkent addresses
              const i = (SAMPLE_MAP_ADDRESSES.indexOf(d.address) + 1) % SAMPLE_MAP_ADDRESSES.length
              set({ address: SAMPLE_MAP_ADDRESSES[i] })
            }}
          />
        </Box>
      </Grid>
    </ResponsiveDialog>
  )
}
