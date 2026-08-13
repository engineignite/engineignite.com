# 3. The Modernist design system

- Status: accepted
- Date: 2026-08-12

## Context

A design handoff arrived for the landing page (vendored at `docs/design/`):
direction 2A, "Panel". It is high fidelity — colors, type sizes, spacing and shadows are final —
and it repositions the site. Engine Ignite is a zero-to-one build shop, not an app umbrella. The
site still has to carry project pages, App Store support/legal pages and docs, none of which the
handoff covers.

## Decision

Adopt the Modernist system across every template, not only the landing page.

- **Tokens** from the handoff’s `styles.css` are ported into `src/styles/global.css` as CSS variables and
  exposed to Tailwind through `@theme inline`. Nothing in the codebase names a raw hex.
- **Panel elevation** — raised panel, raised tile, recessed screen — became the `.panel`,
  `.panel-hero`, `.tile` and `.readout` component classes. Offset shadows only: no blur, no radius.
- **Type** is Archivo 400–800, self-hosted as one variable woff2, with JetBrains Mono 400 for the
  technical labels. Both are latin-subset and preloaded.
- **Inner pages** (project, legal, docs, 404) place their content in a raised panel under the same
  nav and footer, so they read as the same object as the landing page.
- **Landing copy** lives in `src/data/landing.ts`, typed and separate from markup.

### Deviations, and why

1. **Dark mode is kept.** The handoff specifies light only. A dark palette is derived from the same
   ramps: the shell < tile < panel lightness relationship is mirrored, the accent keeps its fill,
   and small accent text moves to the 400 step, which is what the system prescribes on a dark
   ground. Light matches the handoff exactly.
2. **Accent text uses the deep ramp step.** The system doc says paragraph-size accent text must use
   `--color-accent-700`, but the prototype markup uses raw accent for the 11px card kickers. Those
   disagree; we follow the written rule. It reads nearly the same and clears WCAG AA.
3. **Nav carries site links.** The handoff's nav is Capabilities / Engagements / Contact. Projects
   and Docs links appear beside them once that content exists, because the site is more than the
   landing page.
4. **Copy corrections.** The handoff's numbers are illustrative and two of them were wrong for this
   business: Engine Ignite is one person, so the crew figures are stated as solo, and the
   engagement cards carry no CTA while contact is closed. The address is `go@engineignite.com`,
   not the `build@` shown in the design's footer.

## Consequences

- The accent `#ec3013` against the `#f3f2f2` ground measures **3.79:1**. That satisfies the 3:1 the
  system documents for chrome and large text, but not AA for the 15px button labels the design
  specifies. The Lighthouse accessibility gate is therefore 0.9, not 1.0. Repainting the primary
  button is a designer decision, not ours — this is the open item to take back to them.
- The brand mark ships as the supplied PNG. An SVG is needed before launch; the PNG will not hold
  up at the 44px nav bezel on retina, and the favicon is the same file.
- Two self-hosted fonts cost roughly 56 KB, paid once and cached. The alternative, a Google Fonts
  CDN request, is render-blocking and third-party.
