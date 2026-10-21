import { Box, Button, IconButton, Stack, Text } from '@chakra-ui/react'
import { Send, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/** Live site: floating Telegram support widget with a greeting. Kept, restyled. */
export const TelegramButton = ({ href }: { href?: string }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  if (!href) return null

  return (
    <Box pos="fixed" right={{ base: 4, md: 6 }} bottom={{ base: '80px', md: 6 }} zIndex="docked">
      {open && (
        <Stack
          pos="absolute"
          right="0"
          bottom="68px"
          w="280px"
          bg="bg.surface"
          borderRadius="card"
          boxShadow="0 12px 32px rgba(16, 24, 40, 0.16)"
          p="5"
          gap="1"
        >
          <Text fontWeight="700" color="fg.default">
            {t('telegram_widget.greeting_title')}
          </Text>
          <Text fontSize="sm" color="fg.muted">
            {t('telegram_widget.greeting_subtitle')}
          </Text>
          <Text fontSize="sm" color="fg.muted" mb="3">
            {t('telegram_widget.greeting_question')}
          </Text>
          <Button asChild colorPalette="brand" borderRadius="primary" gap="2">
            <a href={href} target="_blank" rel="noreferrer">
              <Send size={16} /> Telegram
            </a>
          </Button>
        </Stack>
      )}
      <IconButton
        aria-label="Telegram"
        size="xl"
        borderRadius="full"
        bg="navy.900"
        color="white"
        boxShadow="0 8px 24px rgba(16, 24, 40, 0.24)"
        _hover={{ bg: 'navy.hover' }}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={22} /> : <Send size={22} />}
      </IconButton>
    </Box>
  )
}
