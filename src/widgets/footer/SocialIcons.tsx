/** Simple outline marks for the social links (lucide has no brand icons). 20px, currentColor. */
const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const TelegramIcon = () => (
  <svg {...base} aria-hidden>
    <path d="M21.5 4.5 2.8 11.7c-.9.4-.9 1.4 0 1.7l4.7 1.5 1.8 5.6c.2.7 1.1.9 1.6.4l2.6-2.4 4.9 3.6c.6.4 1.4.1 1.6-.6L22.9 5.9c.3-1.1-.6-1.8-1.4-1.4Z" />
    <path d="m7.5 14.9 10-6.6-7.7 7.6" />
  </svg>
)

export const InstagramIcon = () => (
  <svg {...base} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
  </svg>
)

export const FacebookIcon = () => (
  <svg {...base} aria-hidden>
    <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H9v3h2.5V21" />
  </svg>
)

export const LinkedinIcon = () => (
  <svg {...base} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 10.5V16M8 7.8v.01M12 16v-5.5M12 13c0-1.5 1-2.5 2.3-2.5S16.5 11.3 16.5 13v3" />
  </svg>
)
