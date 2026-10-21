import { Box, Grid, Image } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { SectionHeader } from '@/shared/ui/SectionHeader'

export const PartnersStrip = ({ partners }: { partners: Array<{ guid: string; image: string }> }) => {
  const { t } = useTranslation()
  if (!partners.length) return null
  return (
    <Box as="section">
      <SectionHeader title={t('trusted_brands')} />
      {/* Mobile: 2-row swipeable strip instead of a screen-long grid */}
      <Grid
        templateColumns={{ base: 'none', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' }}
        templateRows={{ base: 'repeat(2, 64px)', md: 'none' }}
        gridAutoFlow={{ base: 'column', md: 'row' }}
        gridAutoColumns={{ base: '120px', md: 'auto' }}
        overflowX={{ base: 'auto', md: 'visible' }}
        mx={{ base: -4, md: 0 }}
        px={{ base: 4, md: 0 }}
        css={{ scrollbarWidth: 'none' }}
        gap={{ base: 2, md: 3 }}
      >
        {partners.map((p) => (
          <Box
            key={p.guid}
            bg="bg.panel"
            borderRadius="card"
            h={{ base: '64px', md: '88px' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={{ base: 3, md: 6 }}
          >
            <Image
              src={p.image}
              alt=""
              loading="lazy"
              maxH={{ base: '32px', md: '44px' }}
              maxW="full"
              fit="contain"
              mixBlendMode="multiply"
              filter="grayscale(1)"
              opacity="0.7"
              transition="filter .2s, opacity .2s"
              _hover={{ filter: 'none', opacity: 1 }}
            />
          </Box>
        ))}
      </Grid>
    </Box>
  )
}
