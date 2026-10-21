import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { fonts, palette, radii } from './tokens'

type Scale = Record<string, string>
const toTokens = (scale: Scale) =>
  Object.fromEntries(Object.entries(scale).map(([k, v]) => [k, { value: v }]))

const config = defineConfig({
  globalCss: {
    'html, body': {
      bg: 'bg.app',
      color: 'fg.default',
      fontFamily: 'body',
    },
  },
  theme: {
    tokens: {
      colors: {
        navy: toTokens(palette.navy),
        accent: toTokens(palette.green),
        primary: toTokens(palette.primary),
        secondary: toTokens(palette.secondary),
        kgray: toTokens(palette.gray),
        kblue: toTokens(palette.blue),
      },
      fonts: {
        body: { value: fonts.body },
        heading: { value: fonts.heading },
      },
      radii: toTokens(radii),
    },
    semanticTokens: {
      // Chakra v3 needs nested objects here; flat "a.b" keys are silently ignored.
      colors: {
        bg: {
          app: { value: palette.appBackground },
          page: { value: palette.pageBackground },
          surface: { value: palette.white },
          muted: { value: palette.gray[100] },
          inverted: { value: palette.navy[900] },
        },
        fg: {
          default: { value: palette.navy[900] },
          body: { value: palette.navy[800] },
          muted: { value: palette.gray[500] },
          subtle: { value: palette.gray[400] },
          link: { value: palette.blue.link },
          discount: { value: palette.primary.main },
          error: { value: palette.red.main },
        },
        border: {
          default: { value: palette.gray[200] },
          subtle: { value: palette.gray[100] },
        },
        // colorPalette="brand" -> navy CTA buttons, as on the live site
        brand: {
          solid: { value: palette.navy[700] },
          contrast: { value: palette.white },
          fg: { value: palette.navy[900] },
          muted: { value: palette.gray[100] },
          subtle: { value: palette.gray[50] },
          emphasized: { value: palette.navy.hover },
          focusRing: { value: palette.blue.main },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
