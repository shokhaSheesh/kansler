/**
 * Minimal allow-list sanitiser for admin-panel HTML (product descriptions, FAQ answers).
 * Keeps basic formatting, drops scripts, styles, event handlers and iframes. Images only with `images: true`
 * (help-centre pages): https or inline png/jpeg/webp/gif.
 */
const ALLOWED = new Set(['P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'H3', 'H4', 'A', 'TABLE', 'TBODY', 'THEAD', 'TR', 'TD', 'TH', 'SPAN'])

const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'IMG', 'SVG', 'FORM', 'INPUT', 'BUTTON', 'LINK', 'META'])

export const sanitizeHtml = (html: string | null | undefined, opts: { images?: boolean } = {}): string => {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  // Deepest first, so children are already clean when a parent gets unwrapped
  ;[...doc.body.querySelectorAll('*')].reverse().forEach((el) => {
    if (el.tagName === 'IMG' && opts.images) {
      const src = el.getAttribute('src') ?? ''
      if (!/^(https:\/\/|data:image\/(png|jpe?g|webp|gif);)/i.test(src)) return el.remove()
      const alt = el.getAttribute('alt') ?? ''
      ;[...el.attributes].forEach((a) => el.removeAttribute(a.name))
      el.setAttribute('src', src)
      el.setAttribute('alt', alt)
      el.setAttribute('loading', 'lazy')
      return
    }
    if (DROP.has(el.tagName)) return el.remove()
    if (!ALLOWED.has(el.tagName)) return el.replaceWith(...el.childNodes)
    ;[...el.attributes].forEach((a) => {
      const keep = el.tagName === 'A' && a.name === 'href' && /^(https?:\/\/|mailto:|tel:)/i.test(a.value)
      if (!keep) el.removeAttribute(a.name)
    })
    if (el.tagName === 'A') {
      el.setAttribute('target', '_blank')
      el.setAttribute('rel', 'noopener noreferrer')
    }
  })
  return doc.body.innerHTML
}

/** Visible text only: "<p>Как сделать заказ?</p>" -> "Как сделать заказ?" */
export const htmlToText = (html: string | null | undefined) =>
  html ? (new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '').replace(/\s+/g, ' ').trim() : ''
