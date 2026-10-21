import { Flex, Heading, HStack, IconButton, Link } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'

interface SectionHeaderProps {
  title: string
  to?: string
  onPrev?: () => void
  onNext?: () => void
}

export const SectionHeader = ({ title, to, onPrev, onNext }: SectionHeaderProps) => {
  const { t } = useTranslation()
  return (
    <Flex align="center" justify="space-between" mb={{ base: 3, md: 4 }} gap="4">
      <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="700" color="fg.default" letterSpacing="-0.01em">
        {title}
      </Heading>
      <HStack gap="2">
        {to && (
          <Link asChild fontSize="sm" fontWeight="600" color="fg.body" _hover={{ color: 'fg.default' }}>
            <RouterLink to={to}>
              {t('view_all')}
              <ChevronRight size={16} />
            </RouterLink>
          </Link>
        )}
        {onPrev && onNext && (
          <HStack gap="1" hideBelow="md" ml="2">
            <IconButton aria-label="prev" size="sm" variant="outline" borderRadius="full" bg="bg.surface" onClick={onPrev}>
              <ChevronLeft size={18} />
            </IconButton>
            <IconButton aria-label="next" size="sm" variant="outline" borderRadius="full" bg="bg.surface" onClick={onNext}>
              <ChevronRight size={18} />
            </IconButton>
          </HStack>
        )}
      </HStack>
    </Flex>
  )
}
