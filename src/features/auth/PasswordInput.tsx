import { IconButton, Input, InputGroup } from '@chakra-ui/react'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export const PasswordInput = ({ value, onChange, placeholder, autoComplete = 'current-password' }: { value: string; onChange: (v: string) => void; placeholder: string; autoComplete?: string }) => {
  const [shown, setShown] = useState(false)
  return (
    <InputGroup
      endElement={
        <IconButton aria-label={shown ? 'hide' : 'show'} variant="ghost" size="sm" color="fg.muted" me="-2" onClick={() => setShown((s) => !s)}>
          {shown ? <EyeOff size={18} /> : <Eye size={18} />}
        </IconButton>
      }
    >
      <Input type={shown ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} h="48px" borderRadius="control" fontSize="md" />
    </InputGroup>
  )
}
