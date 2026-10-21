# Kansler redesign: what changed

This document lists every change in the new Kansler web design, screen by screen, so you don't have to compare the old and new sites side by side.

**What stays the same**
- Fonts: Inter.
- Brand colours: navy, the green accent from the logo, the red used for discounts, and the grey scale.
- All texts in Russian and Uzbek: copied from the current site. The few new texts are listed below.
- Business logic, backend and API: unchanged. Nothing was added that the backend doesn't support.
- Page addresses (URLs): unchanged.

**What changes:** layout, visual design, interaction and mobile experience.

> Status: design phase. Pages show real Kansler products, prices, banners and categories, from a snapshot of the public site. They are not yet connected to the live API (login, cart, favourites and orders are simulated). Pages that normally need a login (favourites, orders, profile) can be opened without one in this phase, so they can be reviewed.

---

## Contents

1. [Across the whole site](#1-across-the-whole-site)
2. [Header and navigation](#2-header-and-navigation)
3. [Catalog menu](#3-catalog-menu)
4. [Search](#4-search)
5. [Home page](#5-home-page)
6. [Product card](#6-product-card)
7. [Adding to cart](#7-adding-to-cart)
8. [Catalog and product list](#8-catalog-and-product-list)
9. [Product page](#9-product-page)
10. [Favourites](#10-favourites)
11. [New texts](#11-new-texts)
12. [Not included, and why](#12-not-included-and-why)
13. [Issues found in the current data](#13-issues-found-in-the-current-data)
14. [Still to do](#14-still-to-do)

---

## 1. Across the whole site

| Before | After |
|---|---|
| Separate pages for phones (`/mobile`, `/mobile-filter`, `/categories-mobile`, `/otp-mobile`) | One site that adapts to any screen. On phones a bottom tab bar holds Главная · Каталог · Корзина · Избранное · Профиль. |
| Sections stay blank while data loads; a splash screen can show for up to 10 seconds | Grey placeholder shapes show where content will appear, so the page never looks empty or broken |
| The whole site downloads up front (1.6 MB of code) | Each page loads only what it needs, and the main code is split up |
| Footer: light grey block | Footer: navy block with the same links and address |

## 2. Header and navigation

| Before | After |
|---|---|
| Language selector with a dropdown (🇷🇺 РУ ⌄) | A one-tap **UZ / RU** toggle |
| Cart and favourites icons without live feedback | Counters on Корзина / Избранное that **bump** each time an item is added |
| — | The header stays at the top while scrolling |
| Phone: search field and icons in the header | Phone: logo, a search field that opens full-screen search, and the cart with its counter. Everything else is in the bottom tab bar. |

The 4 shortcuts under the search field (Бумажная продукция, Готовые наборы, Папки и файлы, Акции) are kept. **"Акции" now opens discounted products directly.**

## 3. Catalog menu

**After:** the **Каталог** button opens a large menu over the page:
- Left: all 12 main categories, with their pictures.
- Right: when you point at a category, its subcategories appear as columns, with the next level listed under each one.
- Closes with Esc, a click outside, or when you open a page.
- The button changes to ✕ while the menu is open.

**On phones:** the **Каталог** tab opens a list of categories. Tap one to see its subcategories.

## 4. Search

The client told us that about 90% of buyers find products through search, so this got the most attention.

**Before you type:**
- **Недавно искали:** your last searches. You can remove each one or clear them all.
- **Популярные запросы:** the most popular queries, from the existing data.
- **Категории:** quick links to all main categories.

**While you type** (results update instantly):
- **Suggestions,** with the typed part in bold. The ↖ arrow puts a suggestion into the field so you can refine it.
- **Matching categories,** with where they sit in the catalog (e.g. Ручки — Товары для письма › Основные принадлежности).
- **5 matching products,** each with its picture, price and a **"+" button to add it to the cart without leaving search.** Buyers who know what they need can type, add, type, add.
- **The total number of results,** and a button to see them all.
- If nothing is found: a clear message plus popular queries to try.

**Keyboard** (desktop):
- `/` or Ctrl/⌘+K jumps into search from anywhere.
- ↑ ↓ move through the results.
- Enter opens the highlighted result.
- Esc closes the search.

**On phones:** search opens full screen, with a large field and the keyboard already up.

**Results page:**
- Shows the query and the number of products found.
- **Category chips built from the results** (e.g. "Ручки 34"); tap one to narrow down.
- The same 3 sort options as before: popular, cheapest first, most expensive first.
- Pages of results; the "nothing found" state suggests popular queries.
- The results page address keeps your choices, so the back button and shared links work.

## 5. Home page

Same sections as before: banners, categories, Новая коллекция, Рекомендуем, Выгодная выгода, Нам доверяют, and the Telegram button.

| Before | After |
|---|---|
| The banner carousel shows the next banner peeking in, which cuts off its text | One full banner at a time, with the right image for computer, tablet or phone. It changes by itself every 5 seconds and pauses while the mouse is over it. |
| A single row of small category icons | One row of larger category tiles you can swipe (trackpad, mouse drag or finger) |
| Product rows | Rows you **swipe** like a phone list, with no arrow buttons. **"Все"** links are kept, and "Выгодная выгода → Все" opens all discounted products. |
| Partner logos | Logos in grey that turn to colour on hover; a 2-row swipeable strip on phones |
| Telegram button | Same button, restyled, with the same greeting text |

## 6. Product card

Used everywhere products are listed.

- **Photos:** when a product has several photos, you can browse them from the card without opening the product:
  - computer: move the mouse across the photo;
  - phone: swipe the photo.

  Small bars at the top show which photo you're on.
- **Discount:** a red **−35%** badge, the new price in red, and the old price crossed out.
- **Favourite:** the ♡ button in the corner.
- **Add to cart:** a round **"+"** in the photo corner instead of a full-width button, which makes cards more compact (see section 7).
- **Out of stock:** the photo is faded and a "Нет в наличии" label is shown.

## 7. Adding to cart

| Before | After |
|---|---|
| Full-width "Добавить в корзину" button under every card | A round **"+"** on the photo corner |
| — | After the first tap it becomes a small **"− 1 +"** control. At 1, the minus becomes a 🗑 bin, so it's clear the next tap removes the item. You can still type a quantity; it can't go above the stock. |
| — | A **confirmation bar** at the top of the screen, in dark navy so it stands out: product photo, "Товар добавлен в корзину", the product name and a **"Перейти в корзину"** button. Adding several products quickly updates the same bar instead of stacking several. |
| — | The cart counter in the header bumps |

## 8. Catalog and product list

Applies to category pages (`/categories/…`) and the all-products page (`/products`).

**Page layout**
- **Breadcrumbs:** Главная › Товары для письма › Основные принадлежности › Ручки.
- **Title** with the number of products.
- **Subcategory chips** to go deeper. On the last level they show neighbouring categories (Ручки, Маркеры, Карандаши…) so you can switch quickly.
- **Grid or list view** (the existing "Сетка / Список" option). The list view shows compact rows with unit, colour and number of variants. The site remembers the choice on each device.
- **Sort:** the same 3 options.
- **Pages** of results.

**Filters** (the same filters as before, redesigned)
- **Категории:** with a search box (all-products page only).
- **Тип товара:** Все, Супер скидки, Самые продаваемые, Хит продаж.
- **Цена, сум:** "от / до" fields plus a slider. Prices on the site range from 101 to over 14 million сум, so the slider is scaled to make cheap items easy to pick out.
- **Цвет:** a colour dot next to each colour name, plus "Ещё N" to show more.

**New behaviour**
- **Each option shows how many products it would give,** taking your other choices into account. Options that would give no products are greyed out, so you can't end up on an empty page by accident.
- **Applied filters show as chips** above the products; tap ✕ to remove one, or **"Сбросить все"** to clear everything.
- When you filter by colour, cards show **the variant in that colour.**
- The page address keeps your filters, so a filtered page can be shared or bookmarked.

**On phones:**
- A **"Фильтры"** button (showing how many filters are on), sort and view stay pinned under the header.
- Filters open in a panel from the bottom: make your choices, then **"Сохранить"** applies them and **"Отмена"** discards them, the same buttons as the current mobile filter.

## 9. Product page

**Layout**
- **Computer:** photos on the left; the **buy box stays visible on the right** while you scroll down through the details.
- **Phone:** photos, then the buy box, then the details. A **price + "Добавить в корзину" bar stays pinned** above the bottom tab bar.

**Photos**
- **Computer:** a row of thumbnails, plus arrows when you hover over the photo.
- **Phone:** swipe, with dots showing the position.
- **Variants:** choosing a different variant shows that variant's photos.

**Buy box**
- **Name, share and favourite.** **Поделиться** opens the phone's share menu, or copies the link on a computer ("Адрес товара сохранен успешно").
- **SKU code** when the product has one.
- **Price,** with the old price crossed out and a −% badge; the unit ("/ шт."); and "N шт в коробке" when the product has a box quantity.
- **Variant picker ("Вариант 2 / 3"):** each variant shows its photo and price. The chosen variant is kept in the page address, so a shared link opens exactly that variant.
- **Choose the quantity first, then "Добавить в корзину".** Business buyers often order 10 or 50 at once. After adding, it shows the quantity control plus a **"В корзине"** button that opens the cart.
- **"Задать вопрос":** opens the Kansler Telegram support chat.

**Delivery and payment** (from the product data and the existing texts)
- **Delivery by courier:** the fee is shown, plus a **progress bar to free delivery**, e.g. "120 000 сум до бесплатной доставки". It's worked out from what's already in the cart, and turns green with "Бесплатная доставка" once the order passes 500 000 сум.
- Warehouse address, and the note that delivery cost can change with the address.
- **Payment options:** Корпоративная карта, Перечисление.

**Details below**
- **О товаре:** a clean table of characteristics. Repeated values are merged, e.g. "Грамаж: 240, 280, 380 г/кв.м".
- **Описание товара:** long descriptions are shortened, with "Читать подробное описание" to expand.
- **Часто задаваемые вопросы:** the existing FAQ, as expandable questions.
- **Похожие товары:** a swipeable row of products from the same category.

## 10. Favourites

Same content as before: the 4 tabs (Все товары, Товары со скидкой, Рекомендуемые товары, Новые товары), the number of products, and the "Здесь пусто" message.

| Before | After |
|---|---|
| — | **One ♡ everywhere.** Liking a product on any card, list row or search result updates the Избранное counter in the header (with a small bump) and the Favourites page. |
| — | **Tabs show their counts** ("Товары со скидкой 4"). A tab with nothing in it is greyed out. |
| — | **Removing is forgiving.** If you un-like a product on the Favourites page, its card fades instead of disappearing, so a mis-tap is one tap to undo. It's gone the next time you open the page. |
| Empty page with a message | The same message and "Начать покупку" button, plus the **"Рекомендуем" row** underneath, so an empty page still leads somewhere |
| — | Breadcrumbs: Главная › Избранное |

To confirm with the backend: how "Рекомендуемые товары" is decided for favourites. The design currently shows a sample set.

## 11. New texts

All other texts are reused from the current site. These are the only additions, in both languages:

| Where | Russian | Uzbek |
|---|---|---|
| Bar after adding to cart | Товар добавлен в корзину | Mahsulot savatga qo'shildi |
| Button in that bar | Перейти в корзину | Savatga o'tish |
| Clear all filters | Сбросить все | Hammasini tozalash |

## 12. Not included, and why

These texts exist in the current site's files, but the backend has no data or functions behind them. We did not design them so that no feature is promised that can't work:

- Bonus points, points exchange, balance and transaction history.
- Uploading or cropping a profile photo.
- Deleting the account.
- Push / SMS notification settings.
- "Мастер" user type, and an "Azia Stroy" welcome screen (left over from another project).

To confirm with a logged-in account before we design them:
- Pickup from a branch.
- The "Отменить заказ" button.
- What the profile "Settings" page contains.

## 13. Issues found in the current data

For the Kansler content team. These affect any design, old or new.

- **Promo items filed as categories.** For example, a Deli marker sits under *Офисная мебель › Мебель › 35 %*, and a Luxor pen under *Готовые наборы › Базовый*. They then appear in unrelated categories.
- **"Самые продаваемые" / "Хит продаж" can't work yet.** Sales numbers are 0 for every product.
- **Some discount prices have kopecks** (e.g. 1 764,97 сум). The new design rounds them, but the data should be whole sums.
- **Colours are free text.** Values like "5 цветов" or "Plastic World" can't show a colour dot. A short fixed list of colours would make the colour filter cleaner.
- **Variants of a product can't be told apart by name.** All variants share one name, and characteristics like size or density are listed for the whole product, not linked to a variant. For example, a canvas has "Грамаж: 240 / 280 / 380 г/кв.м", but nothing says which of its 3 variants is which. The new design tells variants apart by photo and price. Linking characteristics to each variant would let the picker say "380 г/кв.м" directly.
- **The "Категория" characteristic holds promo labels** like "35 %". It's hidden on the product page, because the breadcrumbs already show the category.
- **Many Uzbek descriptions are empty.** The Russian description is shown instead.
- **Some names are all capitals or end with extra spaces** ("УТЕНОК", "Ручка Deli ").

Ideas for the backend team: these would be new backend work and are **not** part of this redesign.
- **Typo tolerance** in search ("ручкп" → "ручка").
- **Wrong keyboard layout fix** ("hexrf" → "ручка"). This is very common with Russian and Uzbek keyboards.

## 14. Still to do

| Step | Screen | Status |
|---|---|---|
| 0 | Shared components | ✅ Done |
| 1 | Header, catalog menu, footer | ✅ Done |
| 2 | Search | ✅ Done |
| 3 | Home | ✅ Done |
| 4 | Catalog and product list | ✅ Done |
| 5 | Product page | ✅ Done |
| 6 | Favourites | ✅ Done |
| 7 | Cart | ⏳ Next |
| 8 | Checkout and payment | ⏳ |
| 9 | Orders list | ⏳ |
| 10 | Order details | ⏳ |
| 11 | Profile and company account | ⏳ |
| 12 | Notifications | ⏳ |
| 13 | Login and registration | ⏳ |
| 14 | Help centre and info pages | ⏳ |

Design references for each screen (Mobbin) are listed in [REDESIGN.md](REDESIGN.md).
