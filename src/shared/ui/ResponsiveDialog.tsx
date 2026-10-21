import { CloseButton, Dialog, Portal, useBreakpointValue } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface ResponsiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  children: ReactNode
  /** Footer (buttons), pinned under the content. */
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

/** Centred window on computers, panel from the bottom on phones. Used by every profile form. */
export const ResponsiveDialog = ({ open, onOpenChange, title, children, footer, size = 'md' }: ResponsiveDialogProps) => {
  const sheet = useBreakpointValue({ base: true, md: false })
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      placement={sheet ? 'bottom' : 'center'}
      motionPreset={sheet ? 'slide-in-bottom' : 'scale'}
      size={sheet ? 'full' : size}
      scrollBehavior="inside"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius={sheet ? '20px 20px 0 0' : 'modal'} h={sheet ? 'auto' : undefined} maxH={sheet ? '92dvh' : undefined} mt={sheet ? 'auto' : undefined} mb={sheet ? 0 : undefined}>
            <Dialog.Header pb="2" pt="5" px={{ base: 4, md: 6 }}>
              <Dialog.Title fontSize="xl" fontWeight="700" pe="8">
                {title}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild top="4" insetEnd="4">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Dialog.Body px={{ base: 4, md: 6 }} pb={footer ? 2 : 6}>
              {children}
            </Dialog.Body>
            {footer && (
              <Dialog.Footer px={{ base: 4, md: 6 }} pb={{ base: 5, md: 6 }} pt="3">
                {footer}
              </Dialog.Footer>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
