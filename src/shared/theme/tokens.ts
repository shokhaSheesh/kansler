/**
 * Brand tokens taken 1:1 from the live kansler.uz bundle (Chakra theme + global CSS).
 * The redesign changes layout and UX only. Do NOT edit these values without design sign-off.
 */
export const palette = {
  // Navy is the dominant UI colour on the live site (header "Каталог" button, CTAs, modals)
  navy: {
    900: '#101828', // --bg-dark-color, headings
    800: '#1D2939', // gray.800 / blue.800 — body text
    700: '#1A2635', // primary buttons
    hover: '#131B27',
    active: '#0F1621',
    deep: '#011A35', // blue.main
  },
  // Accent green: the logo dot, "Новый год" badge
  green: { main: '#08E18A', success: '#26AB33' },
  // Theme "primary" scale: used for discounts, errors, destructive actions
  primary: {
    main: '#B42318',
    50: '#FCE8E8',
    100: '#F9B6B6',
    200: '#F28080',
    300: '#EC4B4B',
    400: '#E22222',
    500: '#B42318',
    600: '#901C12',
    700: '#6C140D',
    800: '#470C07',
    900: '#230604',
  },
  secondary: {
    main: '#303E49',
    50: '#F2F4F6',
    100: '#D9DEE3',
    200: '#BFC8CF',
    300: '#A3B3BA',
    400: '#879DAA',
    500: '#303E49',
    600: '#27313B',
    700: '#1D2530',
    800: '#141A23',
    900: '#0A0E14',
  },
  gray: {
    subText: '#686069',
    800: '#1D2939',
    700: '#344054',
    500: '#667085',
    400: '#98A2B3',
    300: '#D0D5DD',
    200: '#E4E7EC',
    150: '#EAECF0',
    100: '#F2F4F7',
    50: '#F9FAFB',
    25: '#FCFCFD',
  },
  blue: { main: '#1570EF', link: '#0E73F6', hover: '#0D57BF', active: '#0A418F' },
  red: { main: '#F04438' },
  badge: '#696CFF',
  tabs: '#8A92A6',
  text: '#6E8BB7',
  rowHover: '#F5F6F7',
  border: '#F0EEF0',
  appBackground: '#F7F9FA',
  pageBackground: '#F8F8FA',
  white: '#FFFFFF',
  black: '#0D0C0D',
} as const

export const fonts = {
  body: '"Inter Variable", "Inter", sans-serif',
  // Live site: h2 { font-family: Oddval } (file not shipped in the bundle, so it falls back to Inter)
  heading: '"Oddval", "Inter Variable", "Inter", sans-serif',
} as const

export const radii = {
  primary: '10px', // --radius-primary
  control: '12px', // buttons/inputs in modals
  card: '16px',
  modal: '20px',
  any: '30px', // --radius-any
} as const

export const fontSizes = {
  primary: '14px',
  small: '16px',
  any: '18px',
  secondary: '24px',
  medium: '28px',
} as const
