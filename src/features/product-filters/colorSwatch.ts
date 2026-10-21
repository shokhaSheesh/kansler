/**
 * Colours come from the backend as free text ("Синий", "Ассорти", "5 цветов", "Plastic World"), no hex.
 * We draw a swatch only when the name is a recognisable colour; otherwise just the name.
 */
const MAP: Array<[RegExp, string]> = [
  [/черн|black/i, '#101828'],
  [/бел|white/i, '#FFFFFF'],
  [/красн|red/i, '#E53935'],
  [/син|blue/i, '#1E5BD8'],
  [/голуб/i, '#5AB0F0'],
  [/зел|green/i, '#2E9D4F'],
  [/ж[её]л|желт|yellow|жетл/i, '#F5C518'],
  [/оранж|orange/i, '#F57C00'],
  [/(^|[\s-])роз|pink/i, '#F06292'], // word start: 'прозрачная' contains 'роз'
  [/фиол|сирен|purple|violet/i, '#7E57C2'],
  [/коричн|brown/i, '#795548'],
  [/сер(ый|ая|ое|ые)|grey|gray/i, '#9E9E9E'],
  [/серебр|silver/i, 'linear-gradient(135deg,#E0E0E0,#9E9E9E)'],
  [/золот|gold/i, 'linear-gradient(135deg,#F7D774,#C9A227)'],
  [/бежев|beige/i, '#E8D8B8'],
  [/прозрач|transparent/i, 'repeating-conic-gradient(#E4E7EC 0 25%, #fff 0 50%) 0 0 / 8px 8px'],
  [/ассорти|разноцв|цвет|mix|multi/i, 'conic-gradient(#E53935,#F5C518,#2E9D4F,#1E5BD8,#7E57C2,#E53935)'],
]

export const swatchFor = (name: string): string | null => MAP.find(([re]) => re.test(name))?.[1] ?? null
