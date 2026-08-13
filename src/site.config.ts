/**
 * Site-wide constants. Edit this first — most copy on the site reads from here.
 */
export const SITE = {
  name: 'Engine Ignite',
  url: 'https://engineignite.com',
  domain: 'engineignite.com',
  /** TODO: replace with the real positioning line. Shown in the hero and in <meta>. */
  tagline: 'Small, sharp software.',
  /** TODO: replace. Used as the default meta description and OG description. */
  description:
    'Engine Ignite builds small, focused apps and tools. Project pages, support, and documentation live here.',
  /** Contact address published on support pages. */
  email: 'support@engineignite.com',
  locale: 'en',
  /** Legal entity named in terms/privacy documents. TODO: confirm. */
  legalEntity: 'Engine Ignite',
  social: {
    github: 'https://github.com/engineignite',
  },
} as const

export const NAV = [
  { label: 'Projects', href: '/projects' },
  { label: 'Support', href: '/#support' },
] as const

/** Accent color used for OG image gradients, as [R, G, B]. */
export const OG_COLORS = {
  bgFrom: [16, 18, 27] as [number, number, number],
  bgTo: [32, 24, 20] as [number, number, number],
  accent: [235, 106, 42] as [number, number, number],
  text: [246, 246, 248] as [number, number, number],
  muted: [166, 168, 180] as [number, number, number],
}
