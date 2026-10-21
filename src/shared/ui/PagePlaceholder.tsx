import { Box, Heading, Text } from '@chakra-ui/react'
import { panel } from './surface'

/** Temporary stub rendered by every route until its redesigned page lands. */
export const PagePlaceholder = ({ title, note }: { title: string; note?: string }) => (
  <Box {...panel} p={{ base: 6, md: 10 }}>
    <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700" color="fg.default">
      {title}
    </Heading>
    {note && (
      <Text mt={3} color="fg.muted" fontSize="sm">
        {note}
      </Text>
    )}
  </Box>
)
