/**
 * Landing page copy, from the design handoff. The numbers are the designer's
 * illustrative placeholders — confirm them before launch.
 */

export const HERO = {
  kicker: 'Zero → one build unit',
  secondaryCta: { label: 'See engagement models', href: '#engagements' },
} as const

/** The recessed status readout. Static copy; edit it here when it changes. */
export const READOUT: { label: string; value: string; live?: boolean }[] = [
  { label: 'Stage', value: '0 → 1' },
  { label: 'First ship', value: '6 weeks' },
  { label: 'Crew', value: '2–4' },
  { label: 'Source', value: 'Client-owned', live: true },
  { label: 'Slots Q3', value: '2 open', live: true },
]

export const CHIPS = [
  { label: 'Spec', accent: false },
  { label: 'Build', accent: false },
  { label: 'Launch', accent: true },
] as const

export const READOUT_CAPTION = 'Status readout · live intake'

export const CAPABILITIES = [
  {
    kicker: '01 · Ignition sprint',
    title: 'Two weeks, thesis to spec',
    body:
      'We convert the idea into a written spec, an architecture decision record, a clickable prototype and a costed build plan any team could execute. You keep all of it, with or without us.',
  },
  {
    kicker: '02 · Engine build',
    title: 'Full-stack, shipped weekly',
    body:
      'A dedicated crew of two to four senior builders takes the plan to a production product: product design, application, data model, infrastructure. Every Friday something real is in your hands.',
  },
  {
    kicker: '03 · Launch ops',
    title: 'The parts that survive contact',
    body:
      'Instrumentation, CI/CD, environments, alerting and a runbook. Unglamorous work that decides whether v1 holds together the week real users arrive.',
  },
  {
    kicker: '04 · Hand-off',
    title: 'We staff ourselves out',
    body:
      'Documentation, architecture walkthroughs, and help hiring and onboarding the team that takes it forward. Finishing is somebody’s job — we make sure it is a named somebody.',
  },
] as const

export const ENGAGEMENTS = [
  {
    kicker: '01 · Ignition',
    price: '$12k',
    unit: 'flat',
    meta: '2 weeks · 2 people',
    features: [
      'Written product spec',
      'Architecture decision record',
      'Clickable prototype',
      'Costed build plan',
    ],
    cta: { label: 'Book an Ignition', href: 'mailto:build@engineignite.com?subject=Ignition' },
    featured: false,
  },
  {
    kicker: '02 · Engine',
    price: '$28k',
    unit: '/ month',
    meta: '6–12 weeks · 2–4 builders',
    features: [
      'Dedicated build crew',
      'Weekly production releases',
      'Launch ops included',
      'Full source ownership',
    ],
    cta: { label: 'Start a project', href: 'mailto:build@engineignite.com' },
    featured: true,
  },
  {
    kicker: '03 · Afterburner',
    price: '$6k',
    unit: '/ month',
    meta: 'Ongoing · retained',
    features: [
      'One senior day per week',
      'Architecture review',
      'Escalation line',
      'Hiring support',
    ],
    cta: { label: 'Talk about retainer', href: 'mailto:build@engineignite.com?subject=Retainer' },
    featured: false,
  },
] as const

export const ENGAGEMENTS_NOTE =
  'Corporate innovation teams: SOW, security review and procurement supported.'

export const POSTER = {
  heading: 'Zero to one is a discipline, not a mood.',
} as const
