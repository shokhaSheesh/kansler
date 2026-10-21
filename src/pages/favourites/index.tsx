import { Button, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { Heart } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/app/router/paths'
import { FadeIfUnliked } from '@/entities/product/ui/FadeIfUnliked'
import { shelves } from '@/mocks'
import { mockFavourites } from '@/mocks/favourites.store'
import { topCategories } from '@/mocks/products'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { ProductShelf } from '@/widgets/home/ProductShelf'
import { ProductListView } from '@/widgets/product-list/ProductListView'

/**
 * /favourites — same content as live: title, count, the filter sidebar, price toggle, products,
 * empty state and "Рекомендуем". Un-liking here fades the card until the next visit (one tap to undo).
 */
const FavouritesPage = observer(() => {
  const { t } = useTranslation()
  // Snapshot on arrival: removed items stay (faded) until the next visit
  const [shown] = useState(() => mockFavourites.list)
  const crumbs = <Breadcrumbs items={[{ label: t('favourites.breadcrumb.home'), to: paths.home }, { label: t('favourites.title') }]} />

  const empty = (
    <Flex direction="column" align="center" textAlign="center" gap="3" py={{ base: 12, md: 16 }} px="6" bg="bg.surface" borderRadius="card" borderWidth="1px" borderColor="border.subtle">
      <Flex boxSize="72px" align="center" justify="center" borderRadius="full" bg="primary.50" color="primary.main">
        <Heart size={32} />
      </Flex>
      <Text fontWeight="700" fontSize="xl" color="fg.default">
        {t('favourites.empty.title')}
      </Text>
      <Text color="fg.muted" maxW="320px">
        {t('favourites.empty.description')}
      </Text>
      <Button asChild colorPalette="brand" borderRadius="control" h="48px" px="8" mt="2">
        <RouterLink to={paths.home}>{t('favourites.empty.start_shopping')}</RouterLink>
      </Button>
    </Flex>
  )

  return (
    <Stack gap={{ base: 8, md: 12 }}>
      {shown.length === 0 ? (
        <Stack gap={{ base: 4, md: 6 }}>
          <Stack gap="2">
            {crumbs}
            <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700">
              {t('favourites.title')}
            </Heading>
          </Stack>
          {empty}
        </Stack>
      ) : (
        <ProductListView
          base={{ source: shown }}
          categories={{ kind: 'filter', options: topCategories }}
          header={() => (
            <Stack gap="2">
              {crumbs}
              <Flex align="baseline" gap="3" wrap="wrap">
                <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700" color="fg.default">
                  {t('favourites.title')}
                </Heading>
                <Text color="fg.muted" fontSize={{ base: 'sm', md: 'md' }}>
                  {mockFavourites.count} {t('favourites.products')}
                </Text>
              </Flex>
            </Stack>
          )}
          empty={empty}
          renderItem={(card, id) => <FadeIfUnliked id={id}>{card}</FadeIfUnliked>}
        />
      )}
      <ProductShelf title={t('recommended_products')} products={shelves.recommended} />
    </Stack>
  )
})

export default FavouritesPage
