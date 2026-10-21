import { HStack, Text, type StackProps } from '@chakra-ui/react'
import { useLang } from '@/shared/hooks/useLang'
import { formatPrice } from '@/shared/lib/format'

interface PriceProps extends StackProps {
  /** Final price the customer pays. */
  value: number
  /** Price before discount; rendered struck-through when higher than `value`. */
  oldValue?: number | null
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { main: 'md', old: 'xs' },
  md: { main: 'lg', old: 'sm' },
  lg: { main: '3xl', old: 'md' },
} as const

export const Price = ({ value, oldValue, size = 'md', ...rest }: PriceProps) => {
  const lang = useLang()
  const hasOld = oldValue != null && oldValue > value
  return (
    <HStack gap="2" align="baseline" wrap="wrap" rowGap="0" {...rest}>
      <Text fontSize={sizes[size].main} fontWeight="700" color={hasOld ? 'fg.discount' : 'fg.default'} lineHeight="1.2">
        {formatPrice(value, lang)}
      </Text>
      {hasOld && (
        <Text fontSize={sizes[size].old} color="fg.subtle" textDecoration="line-through" lineHeight="1.2">
          {formatPrice(oldValue, lang)}
        </Text>
      )}
    </HStack>
  )
}
