import { Stack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { paths } from '@/app/router/paths'
import { banners, categories, contacts, partners, shelves } from '@/mocks'
import { CategoryRail } from '@/widgets/home/CategoryRail'
import { HeroBanners } from '@/widgets/home/HeroBanners'
import { PartnersStrip } from '@/widgets/home/PartnersStrip'
import { ProductShelf } from '@/widgets/home/ProductShelf'
import { TelegramButton } from '@/widgets/telegram-button/TelegramButton'

/** Same content as live /home: banners, categories, 3 shelves, partners, Telegram widget. */
export default function HomePage() {
  const { t } = useTranslation()
  return (
    <Stack gap={{ base: 8, md: 12 }}>
      <Stack gap={{ base: 4, md: 5 }}>
        <HeroBanners banners={banners} />
        <CategoryRail categories={categories} />
      </Stack>
      <ProductShelf title={t('new_collection')} to={paths.products} products={shelves.newCollection} />
      <ProductShelf title={t('recommended_products')} to={paths.products} products={shelves.recommended} />
      <ProductShelf title={t('discounted')} to={`${paths.products}?type=super_discount`} products={shelves.discounted} tinted />
      <PartnersStrip partners={partners} />
      <TelegramButton href={contacts.telegram} />
    </Stack>
  )
}
