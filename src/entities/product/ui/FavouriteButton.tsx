import { IconButton, type IconButtonProps } from '@chakra-ui/react'
import { Heart } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { mockFavourites } from '@/mocks/favourites.store'
import type { Product } from '../types'

/** ♡ toggle. Design phase: shared mock store. Wiring: useToggleFavourite (POST /content/products/like-unlike). */
export const FavouriteButton = observer(
  ({ product, variant = 'floating', ...rest }: { product: Product; variant?: 'floating' | 'plain' } & Omit<IconButtonProps, 'aria-label'>) => {
    const { t } = useTranslation()
    const on = mockFavourites.has(product.guid)
    return (
      <IconButton
        aria-label={t('favourites.title')}
        aria-pressed={on}
        size="sm"
        borderRadius="full"
        variant={variant === 'plain' ? 'ghost' : 'solid'}
        bg={variant === 'plain' ? undefined : 'bg.surface'}
        color={on ? 'primary.main' : variant === 'plain' ? 'fg.subtle' : 'fg.muted'}
        boxShadow={variant === 'plain' ? undefined : '0 1px 3px rgba(16, 24, 40, 0.1)'}
        _hover={{ bg: variant === 'plain' ? 'bg.muted' : 'bg.surface', color: 'primary.main' }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          mockFavourites.toggle(product)
        }}
        {...rest}
      >
        <Heart
          key={String(on)}
          size={16}
          fill={on ? 'currentColor' : 'none'}
          style={on ? { animation: 'heart-pop .3s ease-out' } : undefined}
        />
      </IconButton>
    )
  },
)
