import { HStack, IconButton, Input } from '@chakra-ui/react'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

interface QuantityStepperProps {
  value: number
  /** Live site clamps manual input to `in_stock`. */
  max?: number
  onChange: (value: number) => void
  size?: 'sm' | 'md'
}

/** Same rules as the live stepper: digits only, clamped to stock, committed on blur / Enter. */
export const QuantityStepper = ({ value, max = Infinity, onChange, size = 'md' }: QuantityStepperProps) => {
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
  const h = size === 'sm' ? '36px' : '44px'

  return (
    <HStack gap="1" bg="bg.muted" borderRadius="primary" p="1" h={h} w="full">
      <IconButton aria-label="−" size="xs" variant="ghost" borderRadius="8px" onClick={() => onChange(Math.max(0, value - 1))}>
        <Minus size={16} />
      </IconButton>
      <Input
        value={draft}
        onChange={(e) => /^\d*$/.test(e.target.value) && setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        inputMode="numeric"
        textAlign="center"
        fontWeight="600"
        fontSize="sm"
        border="none"
        bg="transparent"
        h="full"
        px="0"
        flex="1"
        minW="0"
      />
      <IconButton
        aria-label="+"
        size="xs"
        variant="ghost"
        borderRadius="8px"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={16} />
      </IconButton>
    </HStack>
  )
}
