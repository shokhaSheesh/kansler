import { HStack, IconButton, Input } from '@chakra-ui/react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface QuantityStepperProps {
  value: number
  /** Live site clamps manual input to `in_stock`. */
  max?: number
  onChange: (value: number) => void
  /** subtle: gray, for cart rows / PDP. solid: compact navy pill, for product cards. */
  variant?: 'subtle' | 'solid'
}

/** Same rules as the live stepper: digits only, clamped to stock, committed on blur / Enter. */
export const QuantityStepper = ({ value, max = Infinity, onChange, variant = 'subtle' }: QuantityStepperProps) => {
  const [draft, setDraft] = useState(String(value))
  const [synced, setSynced] = useState(value)
  if (synced !== value) {
    // external change (+/− buttons, server) -> reset the text field
    setSynced(value)
    setDraft(String(value))
  }

  const commit = (raw: string) => {
    const n = Math.min(parseInt(raw, 10) || 0, max)
    setDraft(String(n))
    if (n !== value) onChange(n)
  }

  const solid = variant === 'solid'
  const btn = {
    size: 'xs' as const,
    variant: 'ghost' as const,
    borderRadius: 'full',
    color: solid ? 'white' : 'fg.default',
    _hover: { bg: solid ? 'whiteAlpha.200' : 'bg.surface' },
  }

  return (
    <HStack
      gap="0"
      p="1"
      h={solid ? '40px' : '44px'}
      w={solid ? '120px' : 'full'}
      bg={solid ? 'brand.solid' : 'bg.muted'}
      color={solid ? 'white' : 'fg.default'}
      borderRadius={solid ? 'full' : 'primary'}
      boxShadow={solid ? '0 4px 12px rgba(16, 24, 40, 0.24)' : undefined}
      onClick={(e) => e.preventDefault()}
    >
      <IconButton aria-label="−" {...btn} onClick={() => onChange(Math.max(0, value - 1))}>
        {solid && value === 1 ? <Trash2 size={15} /> : <Minus size={16} />}
      </IconButton>
      <Input
        value={draft}
        onChange={(e) => /^\d*$/.test(e.target.value) && setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        inputMode="numeric"
        aria-label="quantity"
        textAlign="center"
        fontWeight="600"
        fontSize="sm"
        color="inherit"
        border="none"
        bg="transparent"
        h="full"
        px="0"
        flex="1"
        minW="0"
      />
      <IconButton aria-label="+" {...btn} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        <Plus size={16} />
      </IconButton>
    </HStack>
  )
}
