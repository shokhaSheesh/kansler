import { Box, Button, Heading, List, Text } from '@chakra-ui/react'
import { Fragment, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import ru from '@/shared/content/agreement.ru.md?raw'
import uz from '@/shared/content/agreement.uz.md?raw'
import { useLang } from '@/shared/hooks/useLang'
import { ResponsiveDialog } from '@/shared/ui/ResponsiveDialog'

/** **bold** inside a line */
const inline = (s: string) => s.split(/(\*\*[^*]+\*\*)/).map((p, i) => (p.startsWith('**') ? <b key={i}>{p.slice(2, -2)}</b> : <Fragment key={i}>{p}</Fragment>))

/** The live agreement is a short Markdown text (headings, paragraphs, bullet lists) shipped with the site. */
const Markdown = ({ text }: { text: string }) => {
  const out: ReactNode[] = []
  let list: string[] = []
  const flush = () => {
    if (!list.length) return
    out.push(
      <List.Root key={out.length} ps="5" mb="3" gap="1">
        {list.map((li, i) => (
          <List.Item key={i}>{inline(li)}</List.Item>
        ))}
      </List.Root>,
    )
    list = []
  }
  text.split('\n').forEach((line) => {
    const l = line.trim()
    if (/^[*-] /.test(l)) return list.push(l.slice(2))
    flush()
    if (!l) return
    if (l.startsWith('## '))
      out.push(
        <Heading key={out.length} as="h3" fontSize="md" fontWeight="700" mt="4" mb="2">
          {inline(l.slice(3))}
        </Heading>,
      )
    else if (l.startsWith('# ')) return // shown as the window title
    else
      out.push(
        <Text key={out.length} mb="2">
          {inline(l)}
        </Text>,
      )
  })
  flush()
  return <Box fontSize="sm" color="fg.body" lineHeight="1.6">{out}</Box>
}

/** "Регистрируясь, вы соглашаетесь с правилами [пользовательское соглашение]" + the agreement window. */
export const AgreeText = ({ textKey, linkKey }: { textKey: string; linkKey: string }) => {
  const { t } = useTranslation()
  const lang = useLang()
  const [open, setOpen] = useState(false)
  const md = lang === 'uz' ? uz : ru
  const title = md.split('\n')[0].replace(/^#\s*/, '')
  return (
    <>
      <Text fontSize="sm" color="fg.muted">
        {t(textKey)}{' '}
        <Button variant="plain" h="auto" p="0" minW="0" fontSize="sm" fontWeight="600" color="fg.link" verticalAlign="baseline" onClick={() => setOpen(true)}>
          {t(linkKey)}
        </Button>
      </Text>
      <ResponsiveDialog open={open} onOpenChange={setOpen} title={title} size="lg">
        <Markdown text={md} />
      </ResponsiveDialog>
    </>
  )
}
