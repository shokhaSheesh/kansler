import { Button, Dialog, Portal, Stack, Text } from '@chakra-ui/react'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  cancelText: string
  confirmText: string
  onConfirm: () => void
}

/** Live delete confirmation ("…confirm_delete_*" texts): title, description, Отмена / Да. */
export const ConfirmDialog = ({ open, onOpenChange, title, description, cancelText, confirmText, onConfirm }: ConfirmDialogProps) => (
  <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} placement="center" size="xs" role="alertdialog">
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner px="4">
        <Dialog.Content borderRadius="modal" p="6">
          <Stack gap="2" textAlign="center">
            <Dialog.Title fontSize="lg" fontWeight="700">
              {title}
            </Dialog.Title>
            {description && (
              <Text fontSize="sm" color="fg.muted">
                {description}
              </Text>
            )}
          </Stack>
          <Stack direction="row" gap="2" mt="6">
            <Button flex="1" variant="outline" h="44px" borderRadius="control" onClick={() => onOpenChange(false)}>
              {cancelText}
            </Button>
            <Button
              flex="1"
              h="44px"
              borderRadius="control"
              bg="primary.main"
              color="white"
              _hover={{ bg: 'primary.600' }}
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
            >
              {confirmText}
            </Button>
          </Stack>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
)
