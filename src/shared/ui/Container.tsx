import { Box, type BoxProps } from '@chakra-ui/react'

/** Page gutter + max width shared by header, content and footer. */
export const Container = (props: BoxProps) => (
  <Box w="full" maxW="1440px" mx="auto" px={{ base: 4, md: 6, xl: 8 }} {...props} />
)
