/** Shared panel styles for the white page background. */

/** White block with a hairline border: forms, lists, info blocks. */
export const panel = {
  bg: 'bg.surface',
  borderRadius: 'card',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  boxShadow: 'panel',
} as const

/** Tinted block: order summaries, filters, side navigation. */
export const tintedPanel = {
  bg: 'bg.tint',
  borderRadius: 'card',
} as const
