import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import type { ReactNode } from 'react'
import { mockFavourites } from '@/mocks/favourites.store'

/** Favourites page: a card the buyer just un-liked fades (instead of vanishing) until the next visit. */
export const FadeIfUnliked = observer(({ id, children }: { id: string; children: ReactNode }) => (
  <Box opacity={mockFavourites.has(id) ? 1 : 0.5} transition="opacity .2s" css={{ '&:hover': { opacity: 1 } }}>
    {children}
  </Box>
))
