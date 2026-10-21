import { Box, CloseButton, Flex, IconButton, Input, InputGroup, Portal } from '@chakra-ui/react'
import { ArrowLeft, Search } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchPanel } from './model'
import { SearchPanel } from './SearchPanel'
import { useSearchActions } from './useSearchActions'

interface MobileSearchProps {
  query: string
  onQueryChange: (q: string) => void
  onClose: () => void
}

/** Full-screen search on phones: big input with the keyboard up, same content as the desktop panel. */
export const MobileSearch = observer(({ query, onQueryChange, onClose }: MobileSearchProps) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const actions = useSearchActions(onQueryChange, onClose, inputRef)
  const { state, items } = useSearchPanel(query, actions)

  useEffect(() => {
    inputRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  return (
    <Portal>
      <Flex pos="fixed" inset="0" zIndex="modal" bg="bg.surface" direction="column" css={{ animation: 'fade-in .15s ease-out' }}>
        <Flex
          as="form"
          role="search"
          align="center"
          gap="2"
          px="3"
          py="2.5"
          borderBottomWidth="1px"
          borderColor="border.subtle"
          onSubmit={(e) => {
            e.preventDefault()
            actions.search(query)
          }}
        >
          <IconButton aria-label="back" variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft size={22} />
          </IconButton>
          <InputGroup
            flex="1"
            startElement={<Search size={18} />}
            endElement={
              query ? (
                <CloseButton
                  size="xs"
                  aria-label="clear"
                  onClick={() => {
                    onQueryChange('')
                    inputRef.current?.focus()
                  }}
                />
              ) : undefined
            }
          >
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t('nav.search_placeholder')}
              enterKeyHint="search"
              type="search"
              autoComplete="off"
              h="44px"
              bg="bg.muted"
              borderColor="transparent"
              borderRadius="control"
              fontSize="16px" /* 16px stops iOS from zooming the page */
            />
          </InputGroup>
        </Flex>
        <Box flex="1" overflowY="auto" px="4" py="4">
          <SearchPanel state={state} items={items} active={-1} onHover={() => {}} actions={actions} variant="mobile" />
        </Box>
      </Flex>
    </Portal>
  )
})
