/**
 * Site-wide constants. Copy comes from the Engine Ignite design handoff
 * (docs/design/handoff.md).
 */
export const SITE = {
  name: 'Engine Ignite',
  url: 'https://engineignite.com',
  domain: 'engineignite.com',
  /** The hero headline, and the tail of the home page title. */
  tagline: 'Dreamers need engine builders.',
  description:
    'Engine Ignite gets the rocket built and launched. Pre-seed founders, funded seed teams and corporate innovation groups hand us a thesis and a deadline; we return a production product they own outright.',
  /** Where every "Start a project" CTA goes. Swap for a form or booking link later. */
  cta: { label: 'Start a project', href: 'mailto:build@engineignite.com' },
  /** New business. Shown in the footer. */
  email: 'build@engineignite.com',
  /** App support, used by project pages that do not set their own. */
  supportEmail: 'support@engineignite.com',
  /** Mono model label in the nav bar, per the design. */
  model: 'Model EI—01',
  locale: 'en',
  legalEntity: 'Engine Ignite',
  social: {
    github: 'https://github.com/engineignite',
  },
} as const

/** OG image palette, taken from the Modernist tokens. */
export const OG_COLORS = {
  bgFrom: [32, 30, 29] as [number, number, number], // --color-text
  bgTo: [45, 43, 43] as [number, number, number], // --color-neutral-900
  accent: [236, 48, 19] as [number, number, number], // --color-accent
  text: [243, 242, 242] as [number, number, number], // --color-bg
  muted: [186, 182, 182] as [number, number, number], // --color-neutral-400
}
