import { Badge, Box, Flex, Heading, IconButton, Stack, Text } from '@chakra-ui/react'
import { Check, Pencil, Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'

/** Page title of a profile section (+ optional text under it). */
export const ProfileHeader = ({ title, sub, action }: { title: string; sub?: ReactNode; action?: ReactNode }) => (
  <Flex align="flex-end" justify="space-between" gap="3" wrap="wrap">
    <Stack gap="1">
      <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700">
        {title}
      </Heading>
      {sub && (
        <Text fontSize="sm" color="fg.muted">
          {sub}
        </Text>
      )}
    </Stack>
    {action}
  </Flex>
)

const TONES = {
  green: ['green.50', 'green.700'],
  yellow: ['yellow.50', 'yellow.700'],
  red: ['red.50', 'red.700'],
  gray: ['bg.tile', 'fg.body'],
} as const

export const StatusTag = ({ tone, children }: { tone: keyof typeof TONES; children: ReactNode }) => (
  <Badge bg={TONES[tone][0]} color={TONES[tone][1]} borderRadius="full" px="2.5" py="0.5" fontWeight="600" fontSize="xs">
    {children}
  </Badge>
)

interface SelectableRowProps {
  title: ReactNode
  sub?: ReactNode
  /** Extra line (comment) */
  note?: ReactNode
  tag?: ReactNode
  /** Default item (live: radio). Tapping the row makes it the default. */
  selected: boolean
  onSelect: () => void
  onEdit?: () => void
  onDelete?: () => void
  editLabel: string
  deleteLabel: string
}

/** One saved item (address, recipient, bank account): tap to make default; edit and delete on the right. */
export const SelectableRow = ({ title, sub, note, tag, selected, onSelect, onEdit, onDelete, editLabel, deleteLabel }: SelectableRowProps) => (
  <Flex
    role="radio"
    aria-checked={selected}
    tabIndex={0}
    gap="3"
    align="flex-start"
    p={{ base: 3.5, md: 4 }}
    borderRadius="card"
    borderWidth="1.5px"
    borderColor={selected ? 'navy.900' : 'border.subtle'}
    bg="bg.surface"
    cursor="pointer"
    transition="border-color .15s, box-shadow .15s"
    _hover={{ borderColor: selected ? 'navy.900' : 'kgray.300' }}
    onClick={onSelect}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}
  >
    <Flex
      boxSize="22px"
      mt="0.5"
      flexShrink="0"
      align="center"
      justify="center"
      borderRadius="full"
      borderWidth={selected ? 0 : '1.5px'}
      borderColor="kgray.300"
      bg={selected ? 'navy.900' : 'transparent'}
      color="white"
    >
      {selected && <Check size={13} strokeWidth={3} />}
    </Flex>
    <Box flex="1" minW="0">
      <Flex gap="2" align="center" wrap="wrap">
        <Text fontSize="sm" fontWeight="600" color="fg.default" wordBreak="break-word">
          {title}
        </Text>
        {tag}
      </Flex>
      {sub && (
        <Text fontSize="sm" color="fg.muted" mt="0.5" fontVariantNumeric="tabular-nums" wordBreak="break-word">
          {sub}
        </Text>
      )}
      {note && (
        <Text fontSize="xs" color="fg.subtle" mt="1" lineClamp="2" wordBreak="break-word">
          {note}
        </Text>
      )}
    </Box>
    {(onEdit || onDelete) && (
      <Flex gap="0.5" mt="-1" me="-1" flexShrink="0">
        {onEdit && (
          <IconButton aria-label={editLabel} title={editLabel} variant="ghost" size="sm" color="fg.muted" onClick={(e) => (e.stopPropagation(), onEdit())}>
            <Pencil size={16} />
          </IconButton>
        )}
        {onDelete && (
          <IconButton
            aria-label={deleteLabel}
            title={deleteLabel}
            variant="ghost"
            size="sm"
            color="fg.muted"
            _hover={{ color: 'fg.error', bg: 'primary.50' }}
            onClick={(e) => (e.stopPropagation(), onDelete())}
          >
            <Trash2 size={16} />
          </IconButton>
        )}
      </Flex>
    )}
  </Flex>
)

/** Dashed "+ Добавить…" row at the end of a list. */
export const AddRow = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Flex
    as="button"
    align="center"
    gap="3"
    w="full"
    p={{ base: 3.5, md: 4 }}
    borderRadius="card"
    borderWidth="1.5px"
    borderStyle="dashed"
    borderColor="kgray.300"
    color="fg.body"
    fontSize="sm"
    fontWeight="600"
    transition="border-color .15s, color .15s"
    _hover={{ borderColor: 'navy.900', color: 'fg.default' }}
    onClick={onClick}
  >
    <Flex boxSize="22px" align="center" justify="center" borderRadius="full" bg="navy.900" color="white">
      <Plus size={14} strokeWidth={3} />
    </Flex>
    {label}
  </Flex>
)
