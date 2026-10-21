import { Flex, Heading, Link } from '@chakra-ui/react'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'

export const SectionHeader = ({ title, to }: { title: string; to?: string }) => {
  const { t } = useTranslation()
  return (
    <Flex align="center" justify="space-between" mb={{ base: 3, md: 4 }} gap="4">
      <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="700" color="fg.default" letterSpacing="-0.01em">
        {title}
      </Heading>
      {to && (
        <Link asChild fontSize="sm" fontWeight="600" color="fg.body" _hover={{ color: 'fg.default' }}>
          <RouterLink to={to}>
            {t('view_all')}
            <ChevronRight size={16} />
          </RouterLink>
        </Link>
      )}
    </Flex>
  )
}
