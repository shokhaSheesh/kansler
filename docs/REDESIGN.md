# Kansler redesign: plan

**What we're doing:** redesigning the existing kansler.uz screens (layout, hierarchy, states, responsiveness).
**What we're not doing:** wiring the API, or adding features the backend doesn't have.
**Fixed:** fonts (Inter), brand colours (`src/shared/theme/tokens.ts`), copy (uz/ru locale files from production), URLs.

Pages are built against **mock data** shaped like the real API types (`src/entities/*/types.ts`). The API layer in `src/entities/*/api.ts` / `queries.ts` stays in the repo for the wiring phase.

## How the scope was set

Every item below is backed by both:
1. **UI copy in production.** The live site ships 867 uz/ru strings, which make a feature inventory.
2. **A real gateway endpoint.** 52 of them, in `src/shared/api/endpoints.ts`.

### Out of scope: copy exists, but no backend
These strings ship in the production bundle, but no endpoint serves them. Some are leftovers from another project ("Добро пожаловать в Azia Stroy!"). **Do not design them.**
- Bonus points, points exchange, balance, transactions history
- Avatar photo upload / crop
- Delete account
- Push / SMS notification preferences
- "Мастер" user type
- Azia Stroy welcome screen

### To confirm on a logged-in account before designing
- Pickup from a branch as a delivery option (copy exists; no branch endpoint, but `/main-page/get-contacts` may return branches)
- "Отменить заказ" on order details (copy exists, no cancel endpoint)
- What the profile "Settings" page actually contains

## Step-by-step plan

### Step 0: Foundation components
Shared pieces every page uses. Designed first so later pages compose from them.
- Button, Input, PhoneInput (+998), PasswordInput, OTP input (6 digits)
- **ProductCard:** image, name, price, old price + discount %, heart (favourite), add to cart that turns into a stepper ("В корзине"), out-of-stock state, "N шт в коробке"
- QuantityStepper (debounced, clamped to stock), Price, status Badge
- Skeletons for every list (fixes the blank-loading problem), EmptyState, confirm Modal, mobile BottomSheet, Toast
- Pagination (the live site paginates; keep it)

### Step 1: Header, navigation, footer
**Now:** catalog button, search, 4 icon links, a row of 4 category shortcuts, phone, language. Separate `/mobile*` routes.
**Redesign:** the "Каталог" button opens a mega-menu of the existing category tree. Same icons, with counters (cart, favourites). Responsive bottom tab bar on mobile replaces the `/mobile*` routes. The footer keeps the same links.
**Mobbin:** [Faire: header + category menu](https://mobbin.com/screens/eec80858-a07b-4aaa-8813-cb168b555f53) · [Walmart: departments menu](https://mobbin.com/screens/19a955d7-cd97-4694-975a-67e9547555c2)

### Step 2: Search
**Now:** search field, search history (with clear), popular queries, as-you-type suggestions, results page.
**Redesign:** one dropdown with three states: empty (history + popular), typing (suggestions), and results. The results page reuses the product-list layout.
**Mobbin:** [Faire: trending searches](https://mobbin.com/screens/dc2e1832-4d36-4a34-a263-3e7ba4aaaf5c) · [Urban Outfitters: suggestions + products](https://mobbin.com/screens/ddd3f725-cd68-4bc5-a4f2-e65e536e5942) · [Etsy: suggestions + top searches](https://mobbin.com/screens/0524e711-5a17-4fd6-9f31-492dc4fc0ae5)

### Step 3: Home
**Now:** banner carousel (next slide crops text), category icon rail, shelves "Новая коллекция" / "Рекомендуем" / "Выгодная выгода" that load blank, "Нам доверяют" partner logos, floating Telegram widget.
**Redesign:** a clean full-width banner with per-device images (web/tablet/mobile already exist in the data), category rail, shelves with skeletons + "Все" links, partners strip, Telegram button.
**Mobbin:** [Instacart: banner + rails + shelves](https://mobbin.com/screens/39503f96-db79-41c0-a250-a255ecbfc3a4) · [Apple Store: category rail](https://mobbin.com/screens/3bed3d27-98a5-4c72-baa0-ca8a1507f853)

### Step 4: Catalog & product list (category / all products)
**Now:** filters for categories (multi-select with search), price from/to, colour (more/less), product type (all / super discounts / best selling / hit), sort (popular / price ↓ / price ↑), grid/list view, pagination.
**Redesign:** a left filter sidebar on desktop and a bottom-sheet filter on mobile. Active filters show as removable chips. Count + sort on top. Breadcrumbs.
**Mobbin:** [Klarna: filter sidebar + chips](https://mobbin.com/screens/2ff7fdaf-9702-4d37-9d3a-72eb63cf463c) · [Faire: B2B grid](https://mobbin.com/screens/fd230435-b822-4dc0-938a-0c7103e6b119) · [adidas: mobile filter sheet](https://mobbin.com/screens/99c64731-5bfd-4f31-89a1-72b074568f78)

### Step 5: Product detail
**Now:** gallery, variant picker, price/discount, quantity, add to cart, "купили" count, brand, share (copy link), ask a question (Telegram), description with read more/less, delivery terms (courier, free, warehouse address), payment terms, FAQ, similar products, out-of-stock state.
**Redesign:** gallery on the left and a sticky buy box on the right (price, variant, stepper, CTA, delivery info). Description, FAQ and terms go in accordions below, then similar products.
**Mobbin:** [Faire: PDP + added-to-cart popover](https://mobbin.com/screens/df14d5be-5a4c-4355-9f96-29c79f3a5dd3) · [Instacart: buy box + accordions](https://mobbin.com/screens/901dde1b-7327-4740-bfaf-ec66b68430a5)

### Step 6: Favourites
**Now:** grid with tabs (all / discounted / recommended / new), empty state.
**Redesign:** same tabs as segmented control, product-card grid, a friendlier empty state.
**Mobbin:** reuses the step 4 grid ([Faire](https://mobbin.com/screens/fd230435-b822-4dc0-938a-0c7103e6b119))

### Step 7: Cart
**Now:** select all / unselect, delete selected (confirm), per-item stepper, stock warning, "до бесплатной доставки" threshold, "only for company employees" notice, order summary, empty state.
**Redesign:** line items on the left, a sticky summary on the right with a free-delivery progress bar, bulk-select toolbar, inline stock warnings.
**Mobbin:** [Urban Outfitters: items + summary](https://mobbin.com/screens/cb93b1d1-2b2a-41bb-ba87-12bdc66e6f55) · [adidas: summary + promo](https://mobbin.com/screens/06d26ca8-ad7d-4708-9570-a468c1df6e77) · [Selfridges](https://mobbin.com/screens/87d59b0f-8b0e-4b4e-be4d-6f74d0247fd5)

### Step 8: Checkout & payment
**Now:**
- Delivery address: select, or add on a map limited to Tashkent, with apartment/entrance/floor/intercom/comment fields
- Recipient: select or add
- Payment type: corporate card, or bank transfer ("Скачать КП", "Выставить в Didox")
- Promo code with error states, order comment, minimum order of 50 000 sum
- Summary with VIP and category discounts, terms consent
- Card OTP, then a payment success screen

**Redesign:** a single page with numbered sections (address → recipient → payment) and a sticky summary. Addresses and recipients are selectable cards. The map picker opens in a modal.

**Mobbin:** [Shop: checkout + summary](https://mobbin.com/screens/f07068b4-4c56-4627-a618-98bf0cb7add0) · [Uvodo: step sections](https://mobbin.com/screens/09b19774-b35e-4a65-9fa9-beba530fb5c2) · [HelloFresh: address cards](https://mobbin.com/screens/cc426ff0-9ad4-4d3e-9e78-8f57e97c4e99) · map: [Uber Eats: address info](https://mobbin.com/screens/4056d14a-1c65-4c5f-b960-8097ccc2b1a3), [DoorDash: adjust pin](https://mobbin.com/screens/014af8b3-b4ed-4a3a-858b-d597cf5840c6) · OTP: [Coinbase](https://mobbin.com/screens/cfdf8235-6a71-4857-ac58-5dace902f6d3)

### Step 9: Orders list
**Now:** tabs (all / in progress / delivered / cancelled), statuses (awaiting payment, paid, assembling, shipping, delivered, cancelled), contract number, item count, details, repeat order, continue (pay), empty state.
**Redesign:** order cards with a status badge, key facts in one row (ID, date, total, items), and actions on the right.
**Mobbin:** [Faire: orders](https://mobbin.com/screens/ab5baf37-7bdc-4fd0-a998-c1681fff4b5c) · [Walmart: purchase history](https://mobbin.com/screens/a173684d-9557-419b-8db8-d34d494b3819)

### Step 10: Order details
**Now:** status steps (собирается → в пути → доставлен), items, delivery info + recipient, summary (items, delivery, discount, promo, total), paid with card / by invoice (Didox), download receipt, repeat order, proceed to payment, rate the order.
**Redesign:** a progress tracker on top, then items, with a right column for delivery, payment and summary. The review sits in a card at the bottom.
**Mobbin:** [Walmart: order details + tracker](https://mobbin.com/screens/c75ab520-4707-4e7b-9d65-7e5d7c888111) · [adidas: tracker + order panel](https://mobbin.com/screens/fcff9285-bb90-4bee-aae9-547cbcf6b26d)

### Step 11: Profile / company account
**Now:**
- Counts (favourites / orders / reviews) and a VIP client banner
- Personal info: name, change phone (OTP), change password
- Company data (INN, legal form, director, OKED, VAT…)
- Addresses, recipients (add/edit/delete), bank accounts (approved / pending / rejected), cards (primary/secondary, add + OTP)
- Reviews, help center, language, logout

**Redesign:** side nav on desktop and a menu list on mobile. Each section is a card with view → edit modal.

**Mobbin:** [Contra: settings side nav](https://mobbin.com/screens/d55aa978-57bc-4dc3-975d-f4e6c7d54c6c) · [Mercury: profile rows](https://mobbin.com/screens/24c8e112-64a4-4d17-a3c4-6cf8ec67f08c) · [Airwallex: company profile](https://mobbin.com/screens/fd0515db-006c-4d7a-913d-1f80e6b34efb) · [Render: payment cards](https://mobbin.com/screens/abd56f1c-0b2a-4ff4-a165-3039b8a78bce)

### Step 12: Notifications
**Now:** list with unread state, "N new" count, order status messages, empty and error states.
**Redesign:** a grouped list with unread dots. No reference needed.

### Step 13: Auth
**Now:**
- Login: phone + password
- Forgot password: phone → OTP → new password with a criteria checklist
- Register:
  1. Search company by INN (legal entity) or PINFL (IP)
  2. Result card, or "not found" → manual entry
  3. Company form
  4. Personal form (name, phone, department)
  5. OTP
  6. Password

**Redesign:** a focused full-page layout with a step indicator for register. The company result shows as a confirm card.

**Mobbin:** [Nextdoor: login + error](https://mobbin.com/screens/9979ec9c-d055-4b64-958c-eadce43fe2c6) · [Coinbase: OTP](https://mobbin.com/screens/cfdf8235-6a71-4857-ac58-5dace902f6d3) · [Revolut Business: tax ID step](https://mobbin.com/screens/57a7c8a0-d5ad-417c-8afc-711f364be398) · [Contractbook: company lookup results](https://mobbin.com/screens/3f1e8ca8-cb28-4f3c-9b7d-1dc28e97ab71) · [Stripe: tax details form](https://mobbin.com/screens/514e1de9-f969-4b40-9fa6-94cb1d32dba3)

### Step 14: Help center & info pages
**Now:** FAQ, help-center sections (my order, returns, delivery, payment, products, security, support), branch contacts with map link, terms of use, privacy policy.
**Redesign:** a topic list plus an accordion FAQ, and contacts as cards.
**Mobbin:** [Slack: FAQ accordion](https://mobbin.com/screens/82fbb1d6-09d3-442d-badb-6309271b7549) · [Airtasker: FAQ](https://mobbin.com/screens/757cbfd3-4573-4261-8681-f8fbfa25c583)

## Notes for the wiring phase (found while designing)

### Product list (step 4)
- **Faceted counts.** The redesign shows per-option counts that apply all *other* active filters, and disables options with 0 results. The backend needs to return these counts (categories, colours, price range) for the current filter set, or the UI falls back to plain lists without counts.
- **Matching variant first.** When a colour filter is active, cards show `variations[0]`. The API should put the matching variation first (the mock does this).
- **"Самые продаваемые" / "Хит продаж".** `sold_count` is `0` / `null` for every product in the live data, so these types can't work truthfully yet. The mock flags a pseudo-random subset for design review.
- **Colours are free text.** `/content/colors/list` returns names only ("Синий", "Ассорти", "5 цветов", "Plastic World"). Swatches are drawn from a name→colour map (`features/product-filters/colorSwatch.ts`); unknown names show without a swatch.

### Content issues to raise with the client
- Promo items are filed in pseudo-categories, e.g. *Офисная мебель › Мебель › 35 %* (a Deli marker) and *Готовые наборы › Базовый* (a Luxor pen). They then appear under the wrong categories in any design.
- Discount prices can be fractional (e.g. `1764.97`). The UI rounds them, but the data should be whole sums.
- Some product names are all caps or carry trailing spaces ("УТЕНОК", "Ручка Deli "). The UI tidies the popular-search chips only.

### Search (step 2)
- Worth raising with the backend team (new backend work, not built): typo tolerance ("ручкп" → "ручка"), and wrong keyboard layout ("hexrf" → "ручка").
