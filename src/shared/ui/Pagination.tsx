import { Button, HStack, IconButton, Text } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/** 1 … 4 5 [6] 7 8 … 20 — the live site paginates, so we keep pages (copy: pagination.previous / next). */
const pageList = (page: number, total: number): Array<number | '…'> => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const out: Array<number | '…'> = [1]
  const from = Math.max(2, page - 1)
  const to = Math.min(total - 1, page + 1)
  if (from > 2) out.push('…')
  for (let i = from; i <= to; i++) out.push(i)
  if (to < total - 1) out.push('…')
  out.push(total)
  return out
}

export const Pagination = ({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) => {
  const { t } = useTranslation()
  if (totalPages <= 1) return null
  return (
    <HStack as="nav" justify="center" gap="1" pt="4" aria-label="pagination">
      <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)} gap="1" hideBelow="sm">
        <ChevronLeft size={16} />
        {t('pagination.previous')}
      </Button>
      <IconButton aria-label={t('pagination.previous')} variant="ghost" size="sm" hideFrom="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={16} />
      </IconButton>
      {pageList(page, totalPages).map((p, i) =>
        p === '…' ? (
          <Text key={`gap-${i}`} px="1" color="fg.subtle">
            …
          </Text>
        ) : (
          <Button
            key={p}
            size="sm"
            minW="36px"
            borderRadius="primary"
            variant={p === page ? 'solid' : 'ghost'}
            colorPalette={p === page ? 'brand' : undefined}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </Button>
        ),
      )}
      <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)} gap="1" hideBelow="sm">
        {t('pagination.next')}
        <ChevronRight size={16} />
      </Button>
      <IconButton aria-label={t('pagination.next')} variant="ghost" size="sm" hideFrom="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        <ChevronRight size={16} />
      </IconButton>
    </HStack>
  )
}
