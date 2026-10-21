import { Box, CloseButton, Input, InputGroup, Kbd } from '@chakra-ui/react'
import { Search } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchPanel } from './model'
import { SearchPanel } from './SearchPanel'
import { useSearchActions } from './useSearchActions'

interface SearchBoxProps {
  query: string
  onQueryChange: (q: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Desktop header search: combobox + dropdown panel.
 * Keys: "/" or Ctrl/⌘+K to focus · ↑↓ to move · Enter to open · Esc to close.
 */
export const SearchBox = observer(({ query, onQueryChange, open, onOpenChange }: SearchBoxProps) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(-1)

  const close = useCallback(() => onOpenChange(false), [onOpenChange])
  const actions = useSearchActions(onQueryChange, close, inputRef)
  const { state, items } = useSearchPanel(query, actions)

  // Reset the highlighted row whenever the list changes
  const [lastItems, setLastItems] = useState(items)
  if (lastItems !== items) {
    setLastItems(items)
    setActive(-1)
  }

  // Global shortcut: "/" or Ctrl/⌘+K
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const el = e.target as HTMLElement
      const typing = el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
      if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        inputRef.current?.focus()
        onOpenChange(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onOpenChange])

  // Keep the highlighted row visible
  useEffect(() => {
    panelRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      onOpenChange(true)
      if (!items.length) return
      const step = e.key === 'ArrowDown' ? 1 : -1
      // -1 = back in the input; wraps around at both ends
      setActive((a) => {
        const next = a + step
        if (next >= items.length) return -1
        if (next < -1) return items.length - 1
        return next
      })
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (active >= 0 && items[active]) items[active].run()
      else actions.search(query)
    } else if (e.key === 'Escape') {
      close()
      inputRef.current?.blur()
    }
  }

  return (
    <Box pos="relative" flex="1" minW="0">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          actions.search(query)
        }}
      >
        <InputGroup
          startElement={<Search size={18} />}
          endElement={
            query ? (
              <CloseButton
                size="xs"
                aria-label="clear"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onQueryChange('')
                  inputRef.current?.focus()
                }}
              />
            ) : (
              <Kbd size="sm" hideBelow="lg" bg="bg.surface" color="fg.subtle">
                /
              </Kbd>
            )
          }
        >
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value)
              onOpenChange(true)
            }}
            onFocus={() => onOpenChange(true)}
            onKeyDown={onKeyDown}
            placeholder={t('nav.search_placeholder')}
            role="combobox"
            aria-expanded={open}
            aria-controls="search-panel"
            aria-activedescendant={active >= 0 ? `search-item-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
            h="44px"
            bg={open ? 'bg.surface' : 'bg.muted'}
            borderColor={open ? 'navy.900' : 'transparent'}
            borderRadius="control"
            fontSize="md"
            _focusVisible={{ outline: 'none', borderColor: 'navy.900', boxShadow: '0 0 0 3px rgba(16, 24, 40, 0.08)' }}
          />
        </InputGroup>
      </form>

      {open && (
        <Box
          ref={panelRef}
          id="search-panel"
          role="listbox"
          pos="absolute"
          top="calc(100% + 8px)"
          left="0"
          right="0"
          zIndex="dropdown"
          bg="bg.surface"
          borderRadius="card"
          boxShadow="0 24px 48px rgba(16, 24, 40, 0.18)"
          maxH="min(640px, calc(100dvh - 120px))"
          overflowY="auto"
        >
          <SearchPanel state={state} items={items} active={active} onHover={setActive} actions={actions} variant="desktop" />
        </Box>
      )}
    </Box>
  )
})
