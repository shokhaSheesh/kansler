import { Box, Grid, Image, Link, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import logo from '@/shared/assets/logo.png'
import { Container } from '@/shared/ui/Container'
import { paths } from '@/app/router/paths'

export const Footer = () => {
  const { t } = useTranslation()
  const links = [
    { label: t('footer.about_company'), to: paths.helpCenter },
    { label: t('footer.contacts'), to: paths.helpCenter },
    { label: t('footer.howcanorder'), to: paths.helpCenter },
    { label: t('footer.delivery_payment'), to: paths.helpCenter },
    { label: t('footer.privacy_policy'), to: paths.helpCenter },
  ]
  return (
    <Box as="footer" mt="16" pb={{ base: '80px', md: 0 }}>
      <Container>
        <Grid
          templateColumns={{ base: '1fr', md: '2fr 1fr' }}
          gap="8"
          bg="bg.inverted"
          color="white"
          borderTopRadius="card"
          p={{ base: 6, md: 10 }}
        >
          <Stack gap="4">
            <Image src={logo} alt="Kansler" h="32px" w="fit-content" filter="brightness(0) invert(1)" />
            <Text fontSize="sm" color="whiteAlpha.800">
              {t('footer.address')} {t('footer.address_building')}
            </Text>
            <Text fontSize="xs" color="whiteAlpha.600">
              {t('footer.copyright')}
            </Text>
          </Stack>
          <Stack gap="3" fontSize="sm">
            {links.map((l) => (
              <Link key={l.label} asChild color="whiteAlpha.900">
                <RouterLink to={l.to}>{l.label}</RouterLink>
              </Link>
            ))}
          </Stack>
        </Grid>
      </Container>
    </Box>
  )
}
