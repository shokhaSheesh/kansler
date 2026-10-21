import { Button, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useLang } from '@/shared/hooks/useLang'
import type { Lang } from '@/shared/types/api'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'uz', label: 'UZ' },
  { code: 'ru', label: 'RU' },
]

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const lang = useLang()
  return (
    <HStack gap="0" bg="bg.muted" borderRadius="full" p="0.5">
      {LANGS.map(({ code, label }) => (
        <Button
          key={code}
          size="2xs"
          borderRadius="full"
          px="3"
          variant={lang === code ? 'solid' : 'ghost'}
          colorPalette="brand"
          onClick={() => i18n.changeLanguage(code)}
        >
          {label}
        </Button>
      ))}
    </HStack>
  )
}
