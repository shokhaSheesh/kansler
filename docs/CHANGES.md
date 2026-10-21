# Kansler redesign: what changed

This document lists every change in the new Kansler web design, screen by screen, so you don't have to compare the old and new sites side by side.

**What stays the same**
- Fonts: Inter.
- Brand colours: navy, the green accent from the logo, the red used for discounts, and the grey scale.
  - One exception, on your request: the page background is now **white** instead of light grey (see section 1).
- All texts in Russian and Uzbek: copied from the current site. The few new texts are listed in [section 17](#17-new-texts).
- Business logic, backend and API: unchanged.
- Page addresses (URLs): unchanged.
  - Category pages use the same short names as now, e.g. `/categories/ofis-qogozi`.
  - Orders and notifications stay under `/profile/…`.

**How each screen is described**
- **Same as now:** the content and features that already exist on the current site. They are kept.
- **Changed:** layout, visual design and interaction only. No new data, no new features.
- **Needs your approval:** small additions that use existing data, but that the current site doesn't show. We can keep them or take them out.

> Status: design phase. Pages show real Kansler products, prices, banners and categories, from a snapshot of the public site. They are not yet connected to the live API (login, cart, favourites and orders are simulated). Pages that normally need a login can be opened without one in this phase, so they can be reviewed.

---

## Contents

1. [Across the whole site](#1-across-the-whole-site)
2. [Header and navigation](#2-header-and-navigation)
3. [Catalog menu](#3-catalog-menu)
4. [Search](#4-search)
5. [Home page](#5-home-page)
6. [Product card](#6-product-card)
7. [Adding to cart](#7-adding-to-cart)
8. [Catalog, search results and filters](#8-catalog-search-results-and-filters)
9. [Product page](#9-product-page)
10. [Favourites](#10-favourites)
11. [Cart](#11-cart)
12. [Checkout](#12-checkout)
13. [Orders](#13-orders)
14. [Profile and company account](#14-profile-and-company-account)
15. [Login and registration](#15-login-and-registration)
16. [Help centre, footer and other pages](#16-help-centre-footer-and-other-pages)
17. [New texts](#17-new-texts)
18. [Not included, and why](#18-not-included-and-why)
19. [Questions for the client, and data issues](#19-questions-for-the-client-and-data-issues)
20. [Status](#20-status)

---

## 1. Across the whole site

| Before | After |
|---|---|
| Separate pages for phones (`/mobile`, `/mobile-filter`, `/categories-mobile`, `/otp-mobile`) | One site that adapts to any screen. On phones a bottom tab bar holds Главная · Каталог · Корзина · Избранное · Профиль. |
| Sections stay blank while data loads; a splash screen can show for up to 10 seconds | Grey placeholder shapes show where content will appear |
| The whole site downloads up front (1.6 MB of code) | Each page loads only what it needs |
| Footer: light grey block | Footer: navy block with the same content: address, Telegram / Instagram / Facebook / LinkedIn links (each shown only when filled in the admin panel), copyright and the five info links (see section 16) |
| Light grey page background, white blocks on top (on request: looked plain and dated) | **White page background.** So products and sections still stand out:<br>• **Products:** photos sit on soft grey tiles, with no frame around the card<br>• **Category tiles and partner logos:** grey tiles<br>• **Order summaries, filters and the profile menu:** a light grey panel<br>• **Forms and lists:** white blocks with a thin border<br>• **Home page:** the "Скидки" row sits on a grey band, to break up the page<br>All greys are from the existing brand grey scale. |
| No back button; only the browser's | **"Назад"** button on the product page, category pages, search results and checkout. On computers it sits before the breadcrumbs; on phones it replaces them. It returns to the previous page. If the page was opened from a link, it goes one level up (product → its category, category → parent category or Каталог, checkout → cart) instead of leaving the site. |
| Empty pages use different icons | **One illustration for every empty state** (empty cart, favourites, no search results, nothing found, cart preview): an open box in the brand colours, with the page's existing title, text and button |

## 2. Header and navigation

**Same as now:** logo, Каталог, search, Заказы · Избранное · Корзина · Профиль with counters, the 4 shortcuts (Бумажная продукция, Готовые наборы, Папки и файлы, Акции → discounted products), phone number, language.

**Changed**
- **Language:** a one-tap **UZ / RU** toggle instead of a dropdown.
- **Counters:** they **bump** when an item is added.
- **Sticky:** the header stays at the top while scrolling.
- **Phone:** logo, a search field that opens full-screen search, and the cart. Everything else is in the bottom tab bar.

## 3. Catalog menu

**Same as now:** the Каталог button opens the category menu.

**Changed**
- **Computer:** a large menu over the page. The 12 main categories with their pictures are on the left; pointing at one shows its subcategories as columns on the right, with the next level listed under each.
- **Closing:** Esc, a click outside, or opening a page.
- **Phone:** the Каталог tab opens a category list. Tap a category to see its subcategories.

## 4. Search

**Same as now** (the search dropdown)
- **Suggestions** while typing (product names).
- **Недавно искали:** each search removable, or clear all.
- **Популярные запросы.**

**Changed**
- **Results update instantly** while typing, and the typed part is bold.
- **Phone:** search opens full screen with the keyboard up.

**Approved additions.** The current dropdown doesn't have these; approved by the client team:
- **5 matching products** with picture, price and a **"+" to add to the cart without leaving search**. Uses the existing product search.
- **Matching categories** (e.g. Ручки — Товары для письма › Основные принадлежности), and **category shortcuts** before typing.
- **The number of results,** with a "see all" button.
- **Keyboard:**
  - `/` or Ctrl/⌘+K jumps into search.
  - ↑ ↓ move through the results; Enter opens one; Esc closes.
  - The ↖ arrow puts a suggestion into the field so you can refine it.

**Search results page:** same as now (the same filters as the catalog; see section 8).

## 5. Home page

**Same as now:** banners, category icons, Новая коллекция, Рекомендуем, Выгодная выгода, Нам доверяют, the Telegram button.

| Before | After |
|---|---|
| The banner carousel shows the next banner peeking in, which cuts off its text | One full banner at a time, with the right image for computer, tablet or phone. It changes every 5 seconds and pauses while the mouse is over it. **The whole banner is always visible:** it keeps the exact size the artwork is made in (computer 2760×760, tablet and phone 1648×760), so nothing is cut off. |
| A row of small category icons that **scrolls by itself every 3 seconds**, in a loop (so a screenshot can start at any category) | One row of larger category tiles you can swipe (trackpad, mouse drag, finger). Same 12 categories in the same order, starting with Бумажная продукция. It doesn't move on its own, so nobody misses a tap. |
| Product rows | Rows you **swipe** like a phone list, with no arrow buttons; "Все" links are kept |
| Partner logos | Grey logos that turn to colour on hover; a 2-row swipeable strip on phones |

## 6. Product card

**Same as now:** photo with dots for several photos, discount badge, price and old price, name, ♡, add to cart, out of stock.

**Changed**
- **Look:** no frame around the card; the photo sits on a grey tile with rounded corners and lifts slightly on hover. More space between cards.
- **Photos:**
  - computer: move the mouse across the photo to flip through the photos;
  - phone: swipe the photo.
- **Add to cart:** a round **"+"** in the photo corner instead of a full-width button (see section 7).

**Added on request**
- **Brand,** e.g. DELI, LUXOR, BESTAR.
- **The start of the description,** 2 lines, ending in "…".
- **Number of variants** ("3 варианта"), shown when a product has 2 or more.

> ⚠️ Backend needed for brand and description. The product list the site uses (`/content/product/list`) doesn't return brand or description; they only come with the full product. For cards, the backend should add `brand` and a short description to the list response. Loading every product separately would make lists slow.

How variants work in the data: the **product** is a group (name, category). What you actually buy is a **variant**, which has its own price, photos and stock; the cart stores variants.
- 451 products have exactly 1 variant: the product *is* that one item, and nothing to choose.
- 149 products have 2–7 variants.
- 220 products in the data have no variants, meaning no price; they can't be bought and aren't shown.

## 7. Adding to cart

| Before | After |
|---|---|
| Full-width "Добавить в корзину" button under every card | A round **"+"** on the photo corner |
| — | **One variant:** the "+" becomes a small **"− 1 +"** control. At 1 the minus becomes a 🗑 bin. You can still type a quantity; it can't go above the stock. |
| — | **Several variants** (added on request): the "+" opens a **"which variant?" window** listing every variant with its photo, price and its own quantity control, so several variants can be added at once. The card then shows **✓ and the number in the cart**; tapping it reopens the window. |
| — | **Confirmation bar** at the top of the screen, in dark navy: product photo, "Товар добавлен в корзину", the name, and **"Перейти в корзину"**. Quick repeated adds update one bar instead of stacking. |

**How do you add more after adding?** Use the same **"− n +"** control on the card, in the variant window, on the product page, or in the cart. They all change the same cart quantity.

## 8. Catalog, search results and filters

The current site shows the **same filter sidebar** on category pages, search results and favourites. The new design keeps that.

**Same as now**
- **Breadcrumbs,** title and product count.
- **Subcategory chips** under the title.
- **The sidebar:**
  - **Категории:** Все категории › current category › its subcategories (on search and favourites: pick one category).
  - **Фильтры:** **Цена, сум** (range slider) and **Цвет** (list with "Ещё N / Скрыть").
- **The price toggle** (cheapest first) and pages of results.

**Changed**
- **Sidebar:** it stays visible while scrolling.
- **Price slider:** it shows the chosen amounts and is scaled so that cheap items are easy to pick out. Prices range from 101 to over 14 million сум.
- **Colours:** a colour dot next to each colour name.
- **Applied filters** show as chips above the products; tap ✕ to remove one.
- **Matching variant:** filtering by colour shows the variant in that colour on the card.
- **The page address keeps the filters,** so a filtered page can be shared or bookmarked.
- **At the deepest category level,** the chips show neighbouring categories (Ручки, Маркеры, Карандаши…).
- **Phone:** "Фильтры" and the price toggle stay pinned under the header. Filters open in a panel from the bottom and apply immediately, like the current mobile filter page.

## 9. Product page

**Same as now**
- Photos and variant thumbnails.
- Name, price, "Добавить в корзину" and ♡, "Поделиться", "Задать вопрос" (Telegram bot @Kansler_CustomerCare_bot).
- **Часто задаваемые вопросы** with the links "Условия доставки" and "Условия оплаты".
- The **Доставка** card ("Курьером — Бесплатно") and the **Бренд** card.
- **О товаре**, **Описание товара** (show more / less), and **Рекомендуем** below.

**Changed**

| Before | After |
|---|---|
| Photos, details and the price block side by side | Photos on the left; the **price block stays visible** while you scroll the details. On phones: photos, price block, details. |
| On phones the add button scrolls away | A **price + "Добавить в корзину" bar stays pinned** above the bottom tab bar |
| Small variant thumbnails | Larger variant tiles with **each variant's price**. The chosen variant is kept in the page address, so a shared link opens it. |
| One add button | **Choose the quantity first,** then add. After adding: the quantity control plus **"В корзине"**, which opens the cart. |
| Characteristics repeated per value | Repeated characteristics merged: "Грамаж: 240, 280, 380 г/кв.м" |
| "купили" shown even without a number | Shown only when there is a number |
| Breadcrumbs: home › product | Breadcrumbs include the category (Главная › Хоз товары › Газовая зажигалка) |

## 10. Favourites

**Same as now:** title, count, the filter sidebar and price toggle (as in section 8), the products, the "Здесь пусто" message with "Начать покупку", and **Рекомендуем** below.

**Changed**
- **One ♡ everywhere:** liking a product on any card updates the header counter (with a bump) and this page.
- **Forgiving removal:** un-liking a product here fades its card instead of removing it, so a mis-tap is one tap to undo. It's gone on the next visit.

## 11. Cart

**Same as now**
- **Selection:** "Выбрать все / Снять все", and "Удалить выбранное" once something is selected.
- **Each line:** checkbox, photo, name (opens the product), price with the old price crossed out, quantity (can't go above the stock), delete.
- **"Ваш заказ":**
  - The free-delivery progress, "N сум до бесплатной доставки", or "Бесплатная доставка" once reached. The 500 000 limit comes from the cart's own delivery data.
  - "Товары (N)" and "Итого". **Only selected lines count**, as now.
  - "Перейти к оформлению", and the @Kansler_CustomerCare_bot link.
- **Empty cart:** "Ваша корзина пуста" and "Начать покупки".
- **"Рекомендуем"** below.
- **Header preview ("Моя корзина")** when pointing at the cart icon: number of products, each line as "name (Nx)" with price, and "Итого".

**Changed**
- **The summary card stays visible** while scrolling a long cart.
- **Each line shows its line total** (price × quantity). On phones it appears under the price when the quantity is more than 1.
- **Everything starts selected,** including products added later, so a buyer can go straight to checkout. They un-tick what they don't want now.
- **Phone:** a **"Итого (N) · Перейти к оформлению" bar stays pinned** above the bottom tab bar.
- **Phone:** the header cart icon shows the counter.

## 12. Checkout

**Same as now**
- **Flow:** "Перейти к оформлению" creates the order and opens `/checkout/<order number>`.
- **Header:** title **"Оформление заказа"**, the **ID заказа**, and **"Скачать КП"** (commercial offer PDF).
- **"Информация о доставке":** **"Доставить в"** (choose from "Ваши адреса", or "Добавить адрес") and **"Информация о получателе"** (choose from "Получатели", or "Добавить получателя").
- **"Тип оплаты":**
  - **Корпоративная карта:** your saved cards plus "Добавить карту" (card number + ММ/ГГ, confirmed by SMS code).
  - **Перечисление:** "Посмотреть договор / Перейти в Didox".
- **"Ваш заказ":** the products, expandable.
- **Summary:**
  - Товары (N), Доставка (amount or "Бесплатно"), Промокод (removable), Скидка, **Итого**.
  - **"Оплатить N сум"** (card) or **"Оформить заказ"** (transfer).
  - The consent text with links, and "Соединение защищено".
- **Promo code:** "Добавить промокод" → enter → "Применить", with the existing errors (invalid, expired, minimum order sum).
- **Card payment:** confirmed with the **6-digit SMS code** ("Введите код… Мы отправили 6-значный код на номер"), then "Заказ успешно оформлен" and the orders page.

**Changed**
- **Computer:** two columns, with the **summary and pay button staying visible** while scrolling.
- **Phone:** **"Итого · Оплатить"** pinned above the tab bar.
- **Address and recipient pickers** are proper choice lists (computer: centred window; phone: panel from the bottom).
- **Missing details:** paying without an address or recipient opens the right picker and points out what's missing, instead of only showing an error.
- **Saved cards** look like bank cards:
  - navy, in a different shade for UZCARD and HUMO;
  - chip, masked number (•••• 4512) and the card type;
  - the selected card has a green ✓ and an outline.

  "Добавить карту" is a tile of the same size. Cards scroll sideways when there are many.
- **SMS code:** 6 boxes, fills in automatically from the SMS on phones, confirms on the last digit, and resend becomes available after a countdown.
- **"Скидка"** is hidden when there is no discount (currently it shows "−0 сум").

**Design-phase note:** delivery addresses, recipients, saved cards and promo codes belong to the logged-in company account, so the design uses **sample entries**. Real ones come from the account after the API is connected.

## 13. Orders

Page `/profile/orders`, also reached from "Заказы" in the header.

**Same as now**
- **Title and tabs:** "Заказы", with the tabs **Все · В процессе · Доставленные · Перевозки · Отмененные**.
- **Each order shows:**
  - its status, as a coloured label ("Собирается", "Доставлен"…) and a sentence ("Заказ собирается");
  - the order date and **ID заказа**, with a copy button;
  - the **total**, and the payment card (e.g. "UZCARD **** 4512");
  - **Номер договора**, for bank-transfer orders;
  - **Адрес** and **Кол-во товаров**;
  - **product photos**.
- **"N товаров"** opens the order's products: photo, name, price (and old price), and "Смотреть все характеристики", which opens the product.
- **Buttons:**
  - **"Детали"** opens the order;
  - **"Продолжать"** goes back to checkout, for a bank-transfer order whose contract wasn't sent;
  - **"Повторный заказ"** puts the order's products back in the cart and opens the cart.
- **Paging:** 5 orders per page.
- **No orders:** "У вас пока нет заказов" and "Начать покупки", shown with the common empty-page illustration.
- Status colours are the same as now: green delivered/paid, yellow in progress, grey waiting for payment, blue shipping, red cancelled.

**Changed**
- **One layout for computer and phone.** The current site shows different information on each: the computer version has no address and no product list, the phone version has no photos and no buttons. Now both show everything.
  - **Computer:** status and total on top, then photos and details in columns, then the buttons.
  - **Phone:** details as label/value rows, full-width buttons, and tabs that stay under the header while scrolling.
- **The whole card can be clicked** to open the order. The buttons are still there.
- **Photos:** after 5, the last photo shows "+N".
- **Tab and page are kept in the page address,** so Back and shared links return to the same view.
- **Quantity** is shown next to each product in the expanded list ("× 3").

**Profile menu**, now matching the current site's list and order:
1. Личная Информация
2. Данные компании
3. **Заказы**
4. Адрес
5. Карта
6. Получатель
7. Отзывы
8. Рассчетный счет
9. **Уведомления**
10. Настройки, after a divider
11. **Справочный центр**

Our earlier draft had "Промокоды" there instead; the current menu doesn't have it, so it was removed.

**Design-phase note:** the orders are **samples** built from real catalog products (one of every status). An order placed in checkout appears at the top of the list.

### Order page

Page `/profile/orders/<ID>`, opened with "Детали" or by clicking an order.

**Same as now**
- **Status block:** the status ("Заказ собирается"), the date, and a status badge.
  - Orders in progress: the **3-step progress Собирается → В пути → Доставлен**.
  - Cancelled orders: the total, the payment card and the number of products instead.
- **"Скачать чек":** the receipt, shown once paid by card.
- **"Спасибо за ваш отзыв":** a banner, once a review has been left.
- **Products:** photo, name, price and old price, and quantity ("3x").
- **"Ваш заказ":** ID заказа, Номер договора, Товары (N), Доставка, Скидка, **Итого**.
- **"Оплачено с":** the card (e.g. "UZCARD **** 4512"), or "Способ оплаты: по счету-фактуре" for bank transfer.
- **"Адрес доставки".**
- **Delivered orders:** "Отзывы → Оценить товары", which opens the reviews page.
- **Orders not finished yet:** "Хотите отменить заказ? → Отменить заказ", which opens the Kansler support bot in Telegram, as now.

**Changed**
- **Page title** "Заказ ID 686083", with "Назад" and breadcrumbs (Главная › Заказы › Заказ ID …). On computers the current page has no title.
- **Two columns on computers:** status and products on the left. The summary, payment, address and actions are on the right and stay visible while scrolling.
- **Progress:** the current site shows three pictures with a bar. Now it's a stepper with icons:
  - a box for Собирается;
  - a truck for В пути;
  - a tick for Доставлен.

  Completed steps are green, and the current step is highlighted.
- **Products open their product page** (photo or name).
- **The order ID can be copied.**
- **Phones:** the same blocks in one column, in the current order.

## 14. Profile and company account

Pages under `/profile/…`, with the side menu on computers and a sideways-scrolling menu on phones.

**One pattern for every list** (addresses, recipients, bank accounts):
- **The default item** has a navy outline and a ✓; tap any item to make it the default (the current site uses a radio button).
- **Edit ✎ and delete 🗑** sit on the right of each item.
- **"Добавить…"** is a dashed row at the end of the list.
- **Deleting asks for confirmation** first, with the current texts.
- **Forms open in a window:** centred on computers, a panel from the bottom on phones. The current phone site opens separate pages for them (`/profile/recipient/form`, `/profile/map`…). Those addresses still work and open the same window.

**Личная Информация** (`/profile/user`)
- **Same as now:**
  - the green **"Вы являетесь VIP клиентом"** banner, for VIP clients;
  - **ФИО** and **Номер телефона**, each with an edit button;
  - name: the "Редактировать" window;
  - phone: the new number, then the 6-digit SMS code sent to it.
- **Changed:**
  - layout;
  - the phone field has a fixed +998 and spaces itself;
  - the SMS code boxes are the same as in checkout.
- **Not kept:** the current VIP banner has two decorative chips with fixed numbers ("−200 000 сум", "−20%") that aren't the client's real discount. Please confirm they can go.

**Данные компании** (`/profile/details`)
- **Same as now:** read only.
  - **Company (signed up with INN):** Название, ИНН, Организационно-правовая форма, Адрес, Статус, ФИО Директора, Дата регистрации, Расчетный счет, bank code, ОКЭД, Плательщик НДС.
  - **Sole trader (signed up with PINFL):** 6 of these.
  - Empty fields are hidden.
- **Changed:**
  - two columns on computers;
  - the numbers (ИНН, account, bank code, ОКЭД) have a copy button.

**Адрес** (`/profile/address`)
- **Same as now:** the list, with address, apartment/office, floor and the comment for the courier.
- **The add/edit window "Куда привезти заказ?"** has:
  - the map;
  - Город, улица, дом;
  - Квартира / Офис and Этаж (required);
  - Комментарий для курьера (up to 220 characters, with a counter);
  - **"Привезти сюда"**.

  On computers the form is on the left and the map on the right, like now. On phones the map is on top.
- **Empty list:** "У вас нету адреса доставки" and "Добавить новый адрес", with the common illustration.
- **Design-phase note:** the map is a **drawn stand-in**. Tapping it fills in a sample Tashkent address, the way the real map fills the address. The real **Yandex map** (as now, limited to Tashkent) is connected when the site goes live.

**Получатели** (`/profile/recipient`)
- **Same as now:**
  - the list, with name and phone;
  - **the account owner's own number can't be edited or deleted**;
  - the "Новый получатель" / "Редактировать получателя" window: Имя, Фамилия, phone, the "Отправим уведомление…" note, and "Сохранить";
  - the "already have a recipient with this number" error.

**Карта** (`/profile/cards`)
- **Same as now:** saved corporate cards, with delete. "Добавить карту" opens card number + ММ/ГГ, then the SMS code.
- **Changed:** cards look like bank cards, the same as in checkout.

**Расчетные счета** (`/profile/business-account`)
- **Same as now:**
  - each account shows its name ("Главный" for the main one), the 20-digit account number and its status: **Проверен / В проверке / Отклонен**;
  - the account from registration can't be edited or deleted;
  - the add/edit window has Название (up to 50) and Расчетный счет (exactly 20 digits).
- **Changed:**
  - the account number is shown in groups of 4, so it's easy to check against bank papers;
  - the status is a coloured label.

**Отзывы** (`/profile/comments`)
- **Same as now:**
  - delivered orders as cards: "Заказ ID …", the review date, and "N сум • N товаров";
  - opening one shows **"Оцените заказ"**: "Ваш отзыв поможет нам стать лучше", then **Что думаете насчет доставки**, **Недостатки** and **Комментарий** (all required), and **"Отправить"**;
  - **a sent review opens read only.**
  - There are no star ratings, as now.
- **Changed:**
  - each card shows whether it's reviewed already (✓) or waiting for a review;
  - "Оценить товары" on the order page opens that order's review directly;
  - after sending, the order page shows "Спасибо за ваш отзыв".

**Настройки** (`/profile/settings`)
- **Same as now:** **Статус заказа** and **Рекламные предложения**, each with **Уведомления** (on) and **СМС** (off) switches.
- **Changed:**
  - the description sits on the left and the switches on the right;
  - the switches are navy, the brand colour.

**Уведомления** (`/profile/notifications`)
- **Same as now:**
  - **"У вас N новых уведомлений"**;
  - each notification: the status icon, **"Заказ ID …"**, the message, the date and time, and **"Не прочитано"** until opened;
  - opening one marks it read and opens the order;
  - 10 per page;
  - the **unread count on "Уведомления"** in the profile menu.
- **Changed:**
  - unread ones are white and raised, read ones are grey and quieter;
  - delivered notifications are green, cancelled red and shipping blue.
- **Design-phase note:** the messages are written by the backend. The samples use the site's own order texts ("Ваш заказ подтвержден и собирается." etc.), one for each status change of the sample orders.

**Checkout:** "Добавить адрес" and "Добавить получателя" now open the same windows **on top of checkout**, and the new address or recipient is selected straight away. The current site leaves checkout for a profile page and comes back.

**Design-phase note:** the user, company, addresses, recipients, cards and accounts are **samples**, the same ones checkout uses. Changes made on these pages show up in checkout.

## 15. Login and registration

Pages under `/auth/…`, with the same addresses as now.

**Layout, same as now:** the form on the left, with the Kansler logo and the language switch above it, and the current **warehouse picture with the Kansler wordmark** on the right (computers only). The picture now has rounded corners and stays in place while the form scrolls.

**Вход** (`/auth/login`)
- **Same as now:** "Войти в систему", phone, password (at least 4 characters), "Забыли пароль?", **"Войти"**, "Регистрация", and the "wrong phone or password" error.
- **Changed:**
  - fields have their labels above them;
  - the phone field has a fixed +998;
  - the password has a show/hide eye;
  - "Забыли пароль?" sits next to the password label;
  - the error appears under the password instead of as a pop-up.

**Регистрация.** The steps are the same as now, with a **thin 4-part progress bar** at the top (company → contact → code → password). It has no text.
1. **Поиск** (`/auth/register/check`): **Юр Лицо / ИП** tabs, **ИНН (9 digits) or ПИНФЛ (14 digits)** with a digit counter, the agreement line, **"Поиск"** and **"Ввести вручную"**.
   - **Not found:** "Ничего не нашлось(" and **"Ввести в ручную"**, with the common illustration.
2. **Результат** (`/auth/register/check-result`): what the tax service returned.
   - **Company:** ИНН, address, registration date, ОПФ, ОКЭД, bank code, account (only the first and last 4 digits, as now), VAT status, VAT code, director.
   - **Sole trader:** ПИНФЛ, ФИО and the rest of its fields.
   - The company name heads the card. Then **"Продолжить"**.
   - **Manual entry** (`/auth/register/company-form`), same fields and rules as now:
     - **Company:** name, ИНН (9), legal form (ООО, АО, ИП, хоз. товарищества, кооперативы), address (with "where to deliver" note), director, registration date, ОКЭД (5), account (20), bank code (5), and "Является плательщиком НДС?", which shows Код НДС (12) when on.
     - **Sole trader:** ПИНФЛ (14), ФИО, address, status (Активный / Ликвидирована), date, bank code, account.
     - Short fields sit two per row on computers.
3. **Регистрация** (`/auth/register/form`): phone, **role in the company** (Отдел закупа / Бухгалтерия / Владелец / Другое), ФИО (5–150 letters), the agreement line, and **"Регистрация"**. Then "Код отправлен, проверьте".
4. **SMS code** (`/auth/register/verify-otp`):
   - the phone the code went to, with a ✎ to change it;
   - **6 boxes**, confirmed on the last digit;
   - **"Отправить код снова" after a 2:00 countdown**;
   - "Подтвердить" and the wrong-code message.
5. **Установка пароля** (`/auth/register/password`):
   - new password with show/hide;
   - the checklist **"Пароль должен содержать:"** (6+ characters, a capital letter, a small letter, a digit, a special character), ticking green as you type;
   - the repeat field with "Пароли не совпадают";
   - "Продолжить" → "Регистрация прошла успешно".

**Пользовательское соглашение:** the link in the agreement line opens the current agreement text (Russian or Uzbek, word for word) in a window.

**Сброс пароля** (`/auth/reset-password`): phone → **"Подтвердить"** → the same SMS-code step → **"Сброс пароля"** with the same checklist → "Пароль успешно изменен" → login. An unknown number shows "Пользователь не найден".

**Design-phase demo** (no backend):
- **Sign-up:** any ИНН or ПИНФЛ is found except all zeros, which shows "Ничего не нашлось(". The number +998 90 123 45 67 shows "user already exists".
- **Reset:** the number +998 99 999 99 99 shows "user not found".
- **Codes and passwords:** SMS code 000000 is wrong; login password 0000 is wrong.

## 16. Help centre, footer and other pages

**Справочный центр** (`/profile/info`, in the profile menu)
- **Same as now:**
  - the pages written in the admin panel: **Главная, О компании, Условия доставки, оплаты и возврата, Политика конфиденциальности, Контакты**. The design shows the current text and pictures as they are;
  - **"Вопросы – ответы"**, the FAQ;
  - **"Поддержка"**, which opens the support bot in Telegram;
  - `?infoIndex=N` opens a page directly.
- **Changed:**
  - **Computers:** the page list on the left (the current one is marked) and the page on the right, with readable spacing for headings, lists, links and pictures.
  - **Phones:** the pages are a sideways row of chips instead of a side panel.
  - The FAQ is an accordion.

**Footer links**, same targets as now:

| Link | Opens |
|---|---|
| О нас | О компании |
| Контакты | Контакты |
| Как сделать заказ | Условия доставки, оплаты и возврата |
| Условия оплаты и доставки | Условия доставки, оплаты и возврата |
| Политика конфиденциальности | Политика конфиденциальности |

Our earlier draft sent all five to a made-up `/help-center` page, and it showed "(БЦ OASIS)" after the address, which the current footer doesn't. Both are fixed.

**Product page:** "Условия доставки" and "Условия оплаты" under "Часто задаваемые вопросы" both open "Условия доставки, оплаты и возврата". On the current site one of them opens the help centre's front page.

**Unknown address (404):** the current site shows an empty screen. The design shows the common illustration, "Ничего не нашлось(" and **"На главную"**, all existing texts.

**`/profile/promocode`:** the current phone-only page for entering a promo code during checkout. In the design the promo code is entered in the checkout summary, so this address returns to the cart.

## 17. New texts

Everything else reuses the current site's texts.

| Where | Russian | Uzbek |
|---|---|---|
| Bar after adding to cart | Товар добавлен в корзину | Mahsulot savatga qo'shildi |
| Button in that bar and in the variant window | Перейти в корзину | Savatga o'tish |
| Number of variants (card, variant window) | 1 вариант · 2 варианта · 5 вариантов | 1 ta variant |
| Back button | Назад | Orqaga |
| Products in an order: correct Russian endings (the current text always says "товаров", e.g. "1 товаров") | 1 товар · 3 товара · 5 товаров | (unchanged) |

## 18. Not included, and why

These texts exist in the current site's files, but **no page of the current site uses them**, or the backend has nothing behind them. We did not design them:

- **Product list:** "Тип товара" (Супер скидки / Самые продаваемые / Хит продаж), the sort menu (Популярные / Сначала дорогие / Сначала дешёвые), and the "Сетка / Список" view switch. The current site only has the price toggle.
- **Favourites:** tabs (Все товары / Товары со скидкой / Рекомендуемые / Новые).
- **Product page:** the warehouse address ("Со склада Kansler, пр Амира Темура 129Б").
- **Account:**
  - Bonus points, balance and transactions.
  - Profile photo upload.
  - Deleting the account.
  - The "Мастер" user type.
  - An "Azia Stroy" welcome screen (left over from another project).

To check with a logged-in account before designing them:
- Pickup from a branch.
- The "Отменить заказ" button.
- What the profile "Settings" page contains.

## 19. Questions for the client, and data issues

**Questions**
- **Delivery price.** The product data includes a delivery cost of **25 000 сум, free from 500 000 сум**, and a home banner says "Бесплатная доставка по Ташкенту от 500 000 сум". But the product page always says "Курьером — Бесплатно". Which is right? If the 25 000 / 500 000 rule is real, the product page and cart could show it.
- **Logged-in delivery address.** When a buyer is logged in, the current header and Доставка card show their selected delivery address. This will be designed with addresses (step 11).
- **Brand and description on cards** need the backend change described in section 6.

**Data issues** (for the Kansler content team; these affect any design)
- **A text bug on the current checkout.** The recipient placeholder asks for a text that is actually a group of texts, so the current site likely shows a technical message ("…returned an object instead of string") instead of "Выберите получателя". The new design shows "Выберите получателя".
- **Orders: texts and filters on the current site.**
  - **Missing status text:** there is no Russian text for the status "in-progress", so the current site would show the raw key. The new design uses "В процессе".
  - **The "В процессе" tab** asks the backend only for "Собирается" orders. The page's own code expects it to show all unfinished orders (waiting for payment, paid, assembling, shipping). The design shows all unfinished ones. **Please confirm which is intended.**
  - **The date on the order page** reads "к 20 октября 2026" ("by…", like a delivery date), but the current site fills it with the date the order was *placed*. Should it be a delivery date (needs the backend to send one) or the order date (then "от 20 октября 2026" would read correctly)? The design keeps the current text and data for now.
  - **Recipient:** the order data includes the recipient's name and phone, but the current order page doesn't show them. Should it? (Not added.)
  - **"Повторить заказ"** exists in the texts but the current order page doesn't use it. It is available from the orders list. (Not added.)
  - **"Перевозки"** is the current name of the "shipping" tab. "Доставляются" may read more naturally; it's your call.
- **Profile: texts and rules on the current site.**
  - **Bank code label.** On "Данные компании" it is labelled **"Название"** ("Name") instead of something like "МФО" / "Код банка". The design keeps the current text; please send the right label.
  - **Delete confirmation wording.** "Вы действительно хотите сделать?" (recipients, cards) is unfinished Russian; "…хотите удалить?" was probably meant. It is kept as is for now.
  - **The courier-comment error text doesn't match the rule.** The rule is that no word is longer than 20 letters; the text says "В комментариях должно быть не менее 2 пробелов".
  - **Recipient names need 4+ letters** (first and last name). A short name like "Ли" can't be saved. Is that intended?
  - **Настройки are not saved.** The current switches aren't sent to the backend, so they reset on reload. The backend needs a place to keep them before they can work.
  - **Settings page title.** On computers the current settings page is titled "Уведомления", the same as the notifications page. The design uses "Настройки", like the menu.
  - **"У вас 4 новых уведомлений"** has no Russian plural forms ("4 новых уведомления" would be correct).
  - **Manual company form has no heading** on the current site. The design uses "Регистрация компании", the site's own text for this form.
  - **"Мы отпавили код…"**: a typo in the current text ("отправили"). It is kept as is for now.
  - **"Ввести в ручную"** (not found page) is a typo for "вручную"; the "Поиск" step spells it right. Kept as is for now.
  - **Help-centre page title typo:** "Политика конфедициальности" (in the admin panel, "конфиденциальности"). The footer link spells it right.
  - **Addresses are deleted without asking** on the current site. The design asks first, with the same confirmation as recipients.
- **Not used on the current checkout,** and so not designed:
  - an order comment field;
  - pickup from a branch;
  - the "Минимальная сумма заказа 50 000 сум" note;
  - separate "category" and "product" discount lines;
  - a separate "Оплата прошла успешно" success page.
- **Wrong description on a product.** "Нить" (thread) has the description of a soap ("Туалетное мыло BS «Зелёный чай и огурец»…"). That's in the current data.
- **Promo items filed as categories.** For example, a Deli marker sits under *Офисная мебель › Мебель › 35 %*, and a Luxor pen under *Готовые наборы › Базовый*.
- **Variants can't be told apart by name.** All variants share one name. Characteristics like size or density are listed for the whole product, not linked to a variant, so the design tells variants apart by photo and price.
- **The "Категория" characteristic sometimes holds promo labels** like "35 %".
- **Sales numbers are 0 for every product.**
- **Some discount prices have kopecks** (e.g. 1 764,97 сум). The design rounds them.
- **Colours are free text** ("5 цветов", "Plastic World") and can't show a colour dot. A fixed list of colours would help.
- **Many Uzbek descriptions are empty;** the Russian text is shown instead.
- **Some names are all capitals or end with extra spaces** ("УТЕНОК", "Ручка Deli ").

**Ideas for the backend team** (new backend work, not part of this redesign)
- **Typo tolerance** in search ("ручкп" → "ручка").
- **Wrong keyboard layout fix** ("hexrf" → "ручка").

## 20. Status

| Step | Screen | Status |
|---|---|---|
| 0 | Shared components | ✅ Done |
| 1 | Header, catalog menu, footer | ✅ Done |
| 2 | Search | ✅ Done (additions approved) |
| 3 | Home | ✅ Done |
| 4 | Catalog and product list | ✅ Done (checked against the current site) |
| 5 | Product page | ✅ Done (checked against the current site) |
| 6 | Favourites | ✅ Done (checked against the current site) |
| 7 | Cart | ✅ Done (checked against the current site) |
| 8 | Checkout and payment | ✅ Done (checked against the current site) |
| 9 | Orders list | ✅ Done (checked against the current site) |
| 10 | Order details | ✅ Done (checked against the current site) |
| 11 | Profile and company account | ✅ Done (checked against the current site) |
| 11b | Profile: Отзывы (reviews) and Настройки (settings) | ✅ Done (checked against the current site) |
| 12 | Notifications | ✅ Done (checked against the current site) |
| 13 | Login and registration | ✅ Done (checked against the current site) |
| 14 | Help centre and info pages | ✅ Done (checked against the current site) |

Design references for each screen (Mobbin) are listed in [REDESIGN.md](REDESIGN.md).
