/**
 * Route map, preserved from the live site so existing links, bookmarks and SEO keep working.
 * Mobile-only routes of the old app (`/mobile`, `/mobile-filter`, `/categories-mobile`, `/otp-mobile`)
 * are dropped: the redesign is responsive, and those become drawers / bottom sheets on the same page.
 */
export const paths = {
  root: '/',
  home: '/home',
  catalog: '/categories',
  /** Uses the category slug, like the live site (/categories/ofis-qogozi). */
  category: (slug = ':id') => `/categories/${slug}`,
  products: '/products',
  product: (id = ':id') => `/products/${id}`,
  search: (query = ':query') => `/search/${query}`,
  favourites: '/favourites',
  cart: '/cart',
  /** Live: the cart creates the order, then opens /checkout/:orderId */
  checkout: (orderId = ':id') => `/checkout/${orderId}`,
  /** Live URLs: orders, notifications and the address map live under /profile */
  orders: '/profile/orders',
  order: (id = ':id') => `/profile/orders/${id}`,
  notifications: '/profile/notifications',
  helpCenter: '/help-center',
  map: '/profile/map',

  profile: {
    root: '/profile',
    user: '/profile/user',
    details: '/profile/details',
    info: '/profile/info',
    address: '/profile/address',
    addressForm: '/profile/address-form',
    businessAccount: '/profile/business-account',
    businessAccountForm: '/profile/business-account/form',
    cards: '/profile/cards',
    cardForm: '/profile/cards/form',
    recipient: '/profile/recipient',
    recipientForm: '/profile/recipient/form',
    comments: '/profile/comments',
    commentForm: '/profile/comments/form',
    promocode: '/profile/promocode',
    settings: '/profile/settings',
  },

  auth: {
    root: '/auth',
    login: '/auth/login',
    register: {
      check: '/auth/register/check',
      verifyOtp: '/auth/register/verify-otp',
      form: '/auth/register/form',
      companyForm: '/auth/register/company-form',
      password: '/auth/register/password',
      checkResult: '/auth/register/check-result',
      notFound: '/auth/register/not-found',
    },
    reset: {
      root: '/auth/reset-password',
      verifyOtp: '/auth/reset-password/verify-otp',
      password: '/auth/reset-password/password',
    },
  },
} as const
