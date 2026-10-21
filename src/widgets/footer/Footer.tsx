import { Box, Flex, Grid, Image, Link, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import logo from '@/shared/assets/logo.png'
import { contacts } from '@/mocks'
import { Container } from '@/shared/ui/Container'
import { paths } from '@/app/router/paths'
import { FacebookIcon, InstagramIcon, LinkedinIcon, TelegramIcon } from './SocialIcons'

// Same targets as the live footer: pages of the help centre (/profile/info?infoIndex=N)
const info = (n: number) => `${paths.profile.info}?infoIndex=${n}`

/** Live footer: logo, address, social links (only those filled in the admin panel), copyright, info links. */
export const Footer = () => {
  const { t } = useTranslation()
  const links = [
    { label: t('footer.about_company'), to: info(2) },
    { label: t('footer.contacts'), to: info(5) },
    { label: t('footer.howcanorder'), to: info(3) },
    { label: t('footer.delivery_payment'), to: info(3) },
    { label: t('footer.security').trim(), to: info(4) },
  ]
  const socials = [
    { href: contacts.telegram, label: 'Telegram', icon: <TelegramIcon /> },
    { href: contacts.instagram, label: 'Instagram', icon: <InstagramIcon /> },
    { href: contacts.facebook, label: 'Facebook', icon: <FacebookIcon /> },
    { href: contacts.linkedin, label: 'LinkedIn', icon: <LinkedinIcon /> },
  ].filter((s) => s.href)

  return (
    <Box as="footer" mt="16" pb={{ base: '80px', md: 0 }}>
      <Container>
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap="8" bg="bg.inverted" color="white" borderTopRadius="card" p={{ base: 6, md: 10 }}>
          <Stack gap="4">
            <Image src={logo} alt="Kansler" h="32px" w="fit-content" filter="brightness(0) invert(1)" />
            <Text fontSize="sm" color="whiteAlpha.800">
              {t('footer.address')}
            </Text>
            {socials.length > 0 && (
              <Flex gap="2">
                {socials.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    boxSize="40px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    bg="whiteAlpha.100"
                    color="white"
                    transition="background .2s, transform .2s"
                    _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-2px)' }}
                  >
                    {s.icon}
                  </Link>
                ))}
              </Flex>
            )}
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
