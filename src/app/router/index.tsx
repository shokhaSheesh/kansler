import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'
import { MainLayout } from '@/layouts/MainLayout'
import { ProfileLayout } from '@/layouts/ProfileLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { PageLoader } from '@/shared/ui/PageLoader'
import { RequireAuth } from './RequireAuth'
import { paths } from './paths'

const page = (Component: LazyExoticComponent<ComponentType>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

const P = {
  Home: lazy(() => import('@/pages/home')),
  Catalog: lazy(() => import('@/pages/catalog')),
  Products: lazy(() => import('@/pages/products')),
  Product: lazy(() => import('@/pages/product')),
  Search: lazy(() => import('@/pages/search')),
  Favourites: lazy(() => import('@/pages/favourites')),
  Cart: lazy(() => import('@/pages/cart')),
  Checkout: lazy(() => import('@/pages/checkout')),
  Orders: lazy(() => import('@/pages/orders')),
  Order: lazy(() => import('@/pages/order')),
  Notifications: lazy(() => import('@/pages/notifications')),
  HelpCenter: lazy(() => import('@/pages/help-center')),
  Map: lazy(() => import('@/pages/map')),
  NotFound: lazy(() => import('@/pages/not-found')),

  ProfileUser: lazy(() => import('@/pages/profile/user')),
  ProfileInfo: lazy(() => import('@/pages/profile/info')),
  Address: lazy(() => import('@/pages/profile/address')),
  AddressForm: lazy(() => import('@/pages/profile/address-form')),
  BusinessAccount: lazy(() => import('@/pages/profile/business-account')),
  BusinessAccountForm: lazy(() => import('@/pages/profile/business-account-form')),
  Cards: lazy(() => import('@/pages/profile/cards')),
  CardForm: lazy(() => import('@/pages/profile/card-form')),
  Recipient: lazy(() => import('@/pages/profile/recipient')),
  RecipientForm: lazy(() => import('@/pages/profile/recipient-form')),
  Comments: lazy(() => import('@/pages/profile/comments')),
  CommentForm: lazy(() => import('@/pages/profile/comment-form')),
  Promocode: lazy(() => import('@/pages/profile/promocode')),
  Settings: lazy(() => import('@/pages/profile/settings')),

  Login: lazy(() => import('@/pages/auth/login')),
  RegisterCheck: lazy(() => import('@/pages/auth/register-check')),
  RegisterVerifyOtp: lazy(() => import('@/pages/auth/register-verify-otp')),
  RegisterForm: lazy(() => import('@/pages/auth/register-form')),
  RegisterCompanyForm: lazy(() => import('@/pages/auth/register-company-form')),
  RegisterPassword: lazy(() => import('@/pages/auth/register-password')),
  RegisterCheckResult: lazy(() => import('@/pages/auth/register-check-result')),
  RegisterNotFound: lazy(() => import('@/pages/auth/register-not-found')),
  ResetPassword: lazy(() => import('@/pages/auth/reset-password')),
  ResetVerifyOtp: lazy(() => import('@/pages/auth/reset-verify-otp')),
  ResetNewPassword: lazy(() => import('@/pages/auth/reset-new-password')),
}

const strip = (p: string, base: string) => p.replace(`${base}/`, '')

const routes: RouteObject[] = [
  { path: paths.root, element: <Navigate to={paths.home} replace /> },
  {
    element: <MainLayout />,
    children: [
      { path: paths.home, element: page(P.Home) },
      { path: paths.catalog, element: page(P.Catalog) },
      { path: paths.category(), element: page(P.Products) },
      { path: paths.products, element: page(P.Products) },
      { path: paths.product(), element: page(P.Product) },
      { path: paths.search(), element: page(P.Search) },
      { path: paths.helpCenter, element: page(P.HelpCenter) },
      { path: paths.cart, element: page(P.Cart) }, // guest cart view prompts login on checkout
      {
        element: <RequireAuth />,
        children: [
          { path: paths.favourites, element: page(P.Favourites) },
          { path: paths.checkout(), element: page(P.Checkout) },
          { path: '/checkout', element: <Navigate to={paths.cart} replace /> },
          // Order details and the map are full pages under /profile (outside the profile side nav), like live
          { path: paths.order(), element: page(P.Order) },
          { path: paths.map, element: page(P.Map) },
          {
            path: paths.profile.root,
            element: <ProfileLayout />,
            children: (() => {
              const b = paths.profile.root
              const r = paths.profile
              return [
                { index: true, element: <Navigate to={r.user} replace /> },
                { path: strip(paths.orders, b), element: page(P.Orders) },
                { path: strip(paths.notifications, b), element: page(P.Notifications) },
                { path: strip(r.user, b), element: page(P.ProfileUser) },
                // Live: /profile/details is the company data, /profile/info is the help centre
                { path: strip(r.details, b), element: page(P.ProfileInfo) },
                { path: strip(r.info, b), element: page(P.HelpCenter) },
                { path: strip(r.address, b), element: page(P.Address) },
                { path: strip(r.addressForm, b), element: page(P.AddressForm) },
                { path: strip(r.businessAccount, b), element: page(P.BusinessAccount) },
                { path: strip(r.businessAccountForm, b), element: page(P.BusinessAccountForm) },
                { path: strip(r.cards, b), element: page(P.Cards) },
                { path: strip(r.cardForm, b), element: page(P.CardForm) },
                { path: strip(r.recipient, b), element: page(P.Recipient) },
                { path: strip(r.recipientForm, b), element: page(P.RecipientForm) },
                { path: strip(r.comments, b), element: page(P.Comments) },
                { path: strip(r.commentForm, b), element: page(P.CommentForm) },
                { path: strip(r.promocode, b), element: page(P.Promocode) },
                { path: strip(r.settings, b), element: page(P.Settings) },
              ]
            })(),
          },
        ],
      },
      { path: '*', element: page(P.NotFound) },
    ],
  },
  {
    path: paths.auth.root,
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to={paths.auth.login} replace /> },
      { path: 'login', element: page(P.Login) },
      { path: 'register', element: <Navigate to={paths.auth.register.check} replace /> },
      { path: 'register/check', element: page(P.RegisterCheck) },
      { path: 'register/verify-otp', element: page(P.RegisterVerifyOtp) },
      { path: 'register/form', element: page(P.RegisterForm) },
      { path: 'register/company-form', element: page(P.RegisterCompanyForm) },
      { path: 'register/password', element: page(P.RegisterPassword) },
      { path: 'register/check-result', element: page(P.RegisterCheckResult) },
      { path: 'register/not-found', element: page(P.RegisterNotFound) },
      { path: 'reset-password', element: page(P.ResetPassword) },
      { path: 'reset-password/verify-otp', element: page(P.ResetVerifyOtp) },
      { path: 'reset-password/password', element: page(P.ResetNewPassword) },
    ],
  },
]

export const router = createBrowserRouter(routes)
