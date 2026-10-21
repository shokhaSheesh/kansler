import { Toaster as ChakraToaster, Portal, Spinner, Stack, Toast, createToaster } from '@chakra-ui/react'

export const toaster = createToaster({ placement: 'top-end', pauseOnPageIdle: true, max: 3 })

const indicatorColor: Record<string, string> = {
  success: 'accent.success',
  error: 'fg.error',
  warning: 'orange.500',
  info: 'kblue.main',
}

/** Brand toast: white card, coloured status icon, navy text and action (instead of Chakra's solid fills). */
export const Toaster = () => (
  <Portal>
    <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
      {(toast) => (
        <Toast.Root
          width={{ md: 'sm' }}
          bg="bg.surface"
          color="fg.default"
          borderRadius="control"
          borderWidth="1px"
          borderColor="border.subtle"
          boxShadow="0 12px 32px rgba(16, 24, 40, 0.14)"
          alignItems="center"
        >
          {toast.type === 'loading' ? (
            <Spinner size="sm" color="navy.900" />
          ) : (
            <Toast.Indicator color={indicatorColor[toast.type ?? 'info'] ?? 'fg.muted'} />
          )}
          <Stack gap="0.5" flex="1" minW="0">
            {toast.title && (
              <Toast.Title fontWeight="600" color="fg.default">
                {toast.title}
              </Toast.Title>
            )}
            {toast.description && (
              <Toast.Description color="fg.muted" fontSize="sm" lineClamp="1">
                {toast.description}
              </Toast.Description>
            )}
          </Stack>
          {toast.action && (
            <Toast.ActionTrigger
              bg="brand.solid"
              color="white"
              borderWidth="0"
              borderRadius="primary"
              px="3"
              h="32px"
              fontSize="xs"
              fontWeight="600"
              whiteSpace="nowrap"
              _hover={{ bg: 'navy.hover' }}
            >
              {toast.action.label}
            </Toast.ActionTrigger>
          )}
          {toast.closable && <Toast.CloseTrigger />}
        </Toast.Root>
      )}
    </ChakraToaster>
  </Portal>
)
