import { Box, Button, CloseButton, Dialog, Flex, Portal, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
import { Check, Plus } from 'lucide-react'
import type { ReactNode } from 'react'

interface PickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  items: Array<{ id: string; title: ReactNode; sub?: ReactNode }>
  selectedId: string | null
  onSelect: (id: string) => void
  addLabel: string
  /** Opens the add form (address window, recipient window) on top of checkout. */
  onAdd: () => void
}

/** Live "Ваши адреса" / "Получатели" pickers: tap one to choose; "Добавить…" opens the add form. */
export const PickerDialog = ({ open, onOpenChange, title, items, selectedId, onSelect, addLabel, onAdd }: PickerDialogProps) => {
  const sheet = useBreakpointValue({ base: true, md: false })
  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} placement={sheet ? 'bottom' : 'center'} motionPreset={sheet ? 'slide-in-bottom' : 'scale'} size={sheet ? 'full' : 'md'}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius={sheet ? '20px 20px 0 0' : 'modal'} h={sheet ? 'auto' : undefined} mt={sheet ? 'auto' : undefined} mb={sheet ? 0 : undefined}>
            <Dialog.Header borderBottomWidth="1px" borderColor="border.subtle" py="4">
              <Dialog.Title fontSize="lg" fontWeight="700">
                {title}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Dialog.Body px="4" py="3">
              <Stack gap="2">
                {items.map((it) => {
                  const on = it.id === selectedId
                  return (
                    <Flex
                      key={it.id}
                      as="button"
                      textAlign="start"
                      align="center"
                      gap="3"
                      p="3.5"
                      borderRadius="control"
                      borderWidth="2px"
                      borderColor={on ? 'navy.900' : 'border.subtle'}
                      bg="bg.surface"
                      _hover={{ borderColor: on ? 'navy.900' : 'kgray.300' }}
                      onClick={() => {
                        onSelect(it.id)
                        onOpenChange(false)
                      }}
                    >
                      <Box flex="1" minW="0">
                        <Text fontSize="sm" fontWeight="600" color="fg.default">
                          {it.title}
                        </Text>
                        {it.sub && (
                          <Text fontSize="xs" color="fg.muted" mt="0.5">
                            {it.sub}
                          </Text>
                        )}
                      </Box>
                      <Flex boxSize="22px" flexShrink="0" align="center" justify="center" borderRadius="full" borderWidth="2px" borderColor={on ? 'navy.900' : 'kgray.300'} bg={on ? 'navy.900' : 'transparent'} color="white">
                        {on && <Check size={14} strokeWidth={3} />}
                      </Flex>
                    </Flex>
                  )
                })}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer px="4" pb={sheet ? 'calc(16px + env(safe-area-inset-bottom))' : '4'}>
              <Button w="full" h="48px" variant="outline" borderRadius="control" borderStyle="dashed" gap="2" onClick={onAdd}>
                <Plus size={18} />
                {addLabel}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
