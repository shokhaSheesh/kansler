import { Box, Toaster as ChakraToaster, Image, Portal, Spinner, Stack, Toast, createToaster } from '@chakra-ui/react'

/** Top-centre, over the header: high-contrast navy so it's seen without covering the products being browsed. */
export const toaster = createToaster({
  placement: 'top',
  pauseOnPageIdle: true,
  max: 3,
  offsets: { top: '12px', right: '16px', bottom: '16px', left: '16px' },
})

const indicatorColor: Record<string, string> = {
  success: 'accent.main',
  error: 'red.300',
  warning: 'orange.300',
  info: 'kblue.main',
}

/** Brand snackbar: navy card, product thumbnail (meta.image) or status icon, white action button. */
export const Toaster = () => (
  <Portal>
    <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
      {(toast) => {
        const image = (toast.meta as { image?: string } | undefined)?.image
        return (
          <Toast.Root
            width={{ base: 'full', md: '440px' }}
            bg="navy.900"
            color="white"
            borderRadius="control"
            boxShadow="0 16px 40px rgba(16, 24, 40, 0.32)"
            alignItems="center"
            gap="3"
            py="3"
            ps="3"
          >
            {toast.type === 'loading' ? (
              <Spinner size="sm" color="white" />
            ) : image ? (
              <Box pos="relative" flexShrink="0">
                <Image src={image} alt="" boxSize="44px" bg="white" borderRadius="primary" fit="contain" p="1" />
                <Toast.Indicator
                  pos="absolute"
                  bottom="-1"
                  right="-1"
                  boxSize="18px"
                  bg="navy.900"
                  borderRadius="full"
                  color={indicatorColor[toast.type ?? 'info']}
                />
              </Box>
            ) : (
              <Toast.Indicator color={indicatorColor[toast.type ?? 'info'] ?? 'white'} />
            )}
            <Stack gap="0.5" flex="1" minW="0">
              {toast.title && (
                <Toast.Title fontWeight="600" color="white" fontSize={{ base: 'sm', md: 'md' }} lineClamp="2">
                  {toast.title}
                </Toast.Title>
              )}
              {toast.description && (
                <Toast.Description color="whiteAlpha.700" fontSize="sm" lineClamp="1">
                  {toast.description}
                </Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger
                bg="white"
                color="navy.900"
                borderWidth="0"
                borderRadius="primary"
                px="3"
                h="34px"
                fontSize="xs"
                fontWeight="700"
                whiteSpace="nowrap"
                _hover={{ bg: 'kgray.100' }}
              >
                {toast.action.label}
              </Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger color="whiteAlpha.700" />}
          </Toast.Root>
        )
      }}
    </ChakraToaster>
  </Portal>
)
