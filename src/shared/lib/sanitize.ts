/**
 * Minimal allow-list sanitiser for admin-panel HTML (product descriptions, FAQ answers).
 * Keeps basic formatting, drops scripts, styles, event handlers, iframes and inline base64 images.
 */
const ALLOWED = new Set(['P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'H3', 'H4', 'A', 'TABLE', 'TBODY', 'THEAD', 'TR', 'TD', 'TH', 'SPAN'])

const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'IMG', 'SVG', 'FORM', 'INPUT', 'BUTTON', 'LINK', 'META'])

export const sanitizeHtml = (html: string | null | undefined): string => {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  // Deepest first, so children are already clean when a parent gets unwrapped
  ;[...doc.body.querySelectorAll('*')].reverse().forEach((el) => {
    if (DROP.has(el.tagName)) return el.remove()
    if (!ALLOWED.has(el.tagName)) return el.replaceWith(...el.childNodes)
    ;[...el.attributes].forEach((a) => {
      const keep = el.tagName === 'A' && a.name === 'href' && /^https?:\/\//i.test(a.value)
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
