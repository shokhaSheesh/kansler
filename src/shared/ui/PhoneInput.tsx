import { Input, InputGroup } from '@chakra-ui/react'

/** Uzbek number "+998 90 123 45 67". `value` holds the 9 local digits. */
export const PhoneInput = ({ value, onChange, placeholder, invalid }: { value: string; onChange: (digits: string) => void; placeholder?: string; invalid?: boolean }) => {
  const d = value.replace(/\D/g, '').slice(0, 9)
  const shown = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ')
  return (
    <InputGroup startElement="+998" startElementProps={{ color: 'fg.default', fontWeight: '500', ps: '4' }}>
      <Input
        value={shown}
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={placeholder ?? '90 123 45 67'}
        aria-invalid={invalid || undefined}
        h="48px"
        ps="16"
        borderRadius="control"
        fontSize="md"
        fontVariantNumeric="tabular-nums"
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 9))}
      />
    </InputGroup>
  )
}
