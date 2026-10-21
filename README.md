# Kansler (redesign)

B2B office-supplies e-commerce for kansler.uz. This is a new UI/UX on the same backend, logic, fonts and colours.
Research, Mobbin references and the build plan are in [docs/REDESIGN.md](docs/REDESIGN.md).
**What changed, screen by screen (for the client):** [docs/CHANGES.md](docs/CHANGES.md).

> Design phase: `VITE_DESIGN_MODE=true` opens login-protected pages without an account, and data comes from `src/mocks`. Turn design mode off before wiring the real API.

## Stack

React 19 · TypeScript · Vite · Chakra UI v3 · TanStack Query v5 · MobX · react-router v7 · i18next (uz/ru) · react-hook-form + yup · Swiper · lucide-react

## Getting started

```bash
cp .env.example .env
npm install
npm run dev       # Vite picks a free port
npm run build     # tsc -b && vite build
npm run lint      # oxlint
```

## Structure

```
src/
├── app/                 # bootstrapping
│   ├── App.tsx
│   ├── providers/       # Chakra, React Query, Toaster
│   └── router/          # routes, paths map, RequireAuth guard
├── layouts/             # MainLayout, ProfileLayout, AuthLayout
├── widgets/             # big composed blocks: header, footer, mobile tab bar
├── features/            # user actions spanning entities (add-to-cart, search box, filters…)
├── entities/            # domain modules: <name>/{types,api,queries}.ts
│   ├── auth  cart  category  main-page  notification
│   └── order  payment  product  search  user
├── pages/               # one folder per route, lazy-loaded
├── stores/              # MobX: auth.store, order.store (persisted to localStorage)
└── shared/
    ├── api/             # axios client (token + refresh queue), endpoints map, query client
    ├── assets/          # logo
    ├── config/          # env
    ├── hooks/
    ├── i18n/            # i18next setup + uz/ru locales (copied from production)
    ├── lib/             # formatPrice, formatPhone, localized()
    ├── theme/           # brand tokens + Chakra system
    ├── types/           # API envelope types
    └── ui/              # design-system primitives
```

### Rules
- **Imports flow down only:** `pages → widgets → features → entities → shared`. `shared` imports nothing from above.
- **No raw colours in components.** Use semantic tokens (`bg.surface`, `fg.muted`, `border.subtle`, `colorPalette="brand"`). Brand values live only in `shared/theme/tokens.ts`.
- **No hardcoded URLs.** Use `paths` from `app/router/paths.ts`.
- **Server data goes through the entity `queries.ts` hooks**, never `http` directly from a component.
- **Bilingual content:** use `localized(entity, 'name', lang)` for `name_ru` / `name_uz` fields, and add UI copy to both locale files.

## Deploying to Vercel

`vercel.json` is already set up: Vite build into `dist/`, every page address falls back to `index.html`
(so refreshing or opening a link like `/profile/orders` doesn't 404), and long-term caching for `/assets/*`.

`.env` is not in git, so add these in **Vercel → Project → Settings → Environment Variables** (then redeploy):

| Name | Value |
|---|---|
| `VITE_API_URL` | `https://api.admin.u-code.io/v2/invoke_function/kansler-function-gateway-knative` |
| `VITE_ENVIRONMENT_ID` | `ca6ac079-6003-462a-9787-80e1b286079d` |
| `VITE_PROJECT_ID` | `b24d8fb3-0532-4cd9-ae84-db84f993e93d` |
| `VITE_DESIGN_MODE` | `true` (design review only: opens login-protected pages without an account; remove for production) |
