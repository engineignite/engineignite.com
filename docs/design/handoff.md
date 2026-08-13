# Handoff: Engine Ignite — marketing landing page

## Overview

A single static marketing page for **Engine Ignite**, a zero-to-one build shop for pre-seed founders, funded seed teams, and corporate innovation groups. One page, four bands: hero, capabilities, engagements (pricing), red poster close. Primary CTA everywhere is **"Start a project"**.

Build **direction 2A only** — the "Panel" direction. It is the first (topmost) option in the design file.

## About the design files

The files in `design/` are **design references created in HTML** — a prototype of the intended look, not production code to lift. Recreate the design in whatever the target codebase uses (Next.js/React, Astro, plain HTML, whatever is already there); if there is no codebase yet, pick the simplest thing that ships a static marketing page well (Astro or Next static export are both fine) and implement it there.

`design/Engine Ignite Landing.dc.html` is a prototyping-format file and will not render standalone outside the design tool. Read it as markup + inline styles — every value in this README is taken from it. `design/styles.css` **is** directly usable: it is the Modernist design-system token sheet and component layer, and it is the source of truth for colors, type, and the `.btn` / `.tag` classes.

## Fidelity

**High fidelity.** Colors, type sizes, spacing, and shadows are final. Match them. The one open item is imagery (see Assets).

## Design tokens

All tokens live in `design/styles.css` under `:root`. Use the CSS variables, never raw hexes.

| Token                 | Value                                          | Use                                             |
| --------------------- | ---------------------------------------------- | ----------------------------------------------- |
| `--color-bg`          | `#f3f2f2`                                      | Page ground, button tiles, reversed button fill |
| `--color-neutral-100` | `#f8f4f4`                                      | Raised panel faces, nav bar, footer             |
| `--color-neutral-200` | `#eae7e7`                                      | Page shell behind the panels                    |
| `--color-neutral-900` | `#2d2b2b`                                      | Status readout background                       |
| `--color-text`        | `#201e1d`                                      | Ink                                             |
| `--color-accent`      | `#ec3013`                                      | Primary button, numbering, poster band          |
| `--color-accent-400`  | `#ff9783`                                      | Live values on the dark readout                 |
| `--color-accent-700`  | `#ae1800`                                      | Accent-colored small text (contrast-safe)       |
| `--color-divider`     | `color-mix(in srgb, #201e1d 40%, transparent)` | 2px section rules                               |
| `--radius-*`          | `0px`                                          | **Never round a corner.**                       |
| `--shadow-lg`         | `0 12px 32px rgba(45,43,43,0.22)`              | Page shell only                                 |

Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 px (`--space-1..8`). Page-level padding uses 32px gutters.

### Panel elevation (the TE-hardware look)

Not from the token shadows — these are the direction's signature. Three recipes:

- **Raised panel** (hero panel, cards, footer modules):
  `background: var(--color-neutral-100); border: 1px solid color-mix(in srgb, var(--color-text) 16%, transparent); box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 4px 4px 0 color-mix(in srgb, var(--color-text) 10%, transparent);`
  The hero panel uses a heavier offset: `6px 6px 0` at 12%, border at 18%.
- **Raised tile** (logo bezel, SPEC/BUILD chips):
  `background: var(--color-bg); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-text) 18%, transparent), 3px 3px 0 color-mix(in srgb, var(--color-text) 12%, transparent);`
- **Recessed screen** (status readout):
  `background: var(--color-neutral-900); box-shadow: inset 0 2px 6px rgba(0,0,0,0.5);`

Buttons in the hero and the poster band carry a hard offset shadow too: `4px 4px 0` at `--color-text` 22% (accent button) / 12% (secondary) / `rgba(0,0,0,0.25)` on the red band. **No blur, no radius** — offset shadows only.

## Typography

- **Archivo** (Google Fonts, weights 400/600/800) for everything. Already imported at the top of `styles.css`.
- Headings: Archivo **800**, `line-height: 1.12` default, `letter-spacing: -0.015em`; the display sizes below tighten to `-0.02em`/`-0.03em`.
- **Monospace** carries every technical label. The prototype uses the system stack `ui-monospace, "SF Mono", Menlo, monospace`. If you want it consistent across platforms, substitute a single webfont — **Archivo Mono is not a thing; use JetBrains Mono or IBM Plex Mono at 400** — and apply it everywhere the stack appears.

| Role                              | Spec                                                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| H1 (hero)                         | Archivo 800, 62px / 1.03, `-0.03em`                                                                        |
| H2 (section, poster)              | Archivo 800, 32px / 1.02–1.12, `-0.02em`; poster band 44px, `-0.03em`, `max-width: 16ch`                   |
| H3 (card title)                   | Archivo 800, 21px / 1.2                                                                                    |
| Lead paragraph                    | Archivo 400, 17px / 1.5, `max-width: 44ch`, color `color-mix(in srgb, var(--color-text) 80%, transparent)` |
| Body / card copy                  | 14px / 1.6, text at 78%                                                                                    |
| List rows (engagements)           | 13.5px / 1.5                                                                                               |
| Price                             | Archivo 800, 32px, `-0.02em`; the unit suffix is 14px, `letter-spacing: 0`, text at 55%                    |
| Mono kicker (cards)               | 11px, `letter-spacing: 0.12em`, `--color-accent`                                                           |
| Mono label (nav, section, footer) | 11px, `letter-spacing: 0.14–0.16em`, uppercase, text at 55–60% (section kickers use `--color-accent-700`)  |
| Readout                           | mono 11.5px / 1.9, `letter-spacing: 0.04em`                                                                |

Everything is **flush left**, including labels inside full-width buttons (`.btn-block` sets `justify-content: flex-start`). Do not center hero copy or button labels.

## Screen: landing page (single view)

Design canvas width **1200px**; treat that as the max content width. Page shell: `background: var(--color-neutral-200)`, `border: 2px solid var(--color-divider)` — in production, drop the outer border/shadow and just let the neutral-200 ground run full-bleed with the content capped at 1200px.

### 1. Nav bar

`background: var(--color-neutral-100)`, `padding: 14px 32px`, `border-bottom: 2px solid var(--color-divider)`, flex row, `gap: 32px`, `align-items: center`.

- Left group (`margin-right: auto`, `gap: 14px`): 44×44 raised tile containing the 28×28 logo mark, then the mono label `MODEL EI—01` (11px, `0.16em`, uppercase, text at 60%). **Mark only — no wordmark in the nav** (this was the lockup choice for this direction).
- Center links: `Capabilities`, `Engagements`, `Contact` — 13px, `letter-spacing: 0.04em`, `color: inherit`, no underline, `gap: 26px`. Hover → `--color-accent`.
- Right: `.btn.btn-primary` — "Start a project".

Consider making the nav sticky; the prototype does not, and that is fine.

### 2. Hero

Outer padding `36px 32px 32px`. Inside, one **raised panel** (6px offset) split `grid-template-columns: 1fr 360px`, with a `1px solid color-mix(in srgb, var(--color-text) 18%, transparent)` divider between the two cells.

**Left cell** — padding `44px 40px 36px`:

1. Mono kicker, `--color-accent-700`, `margin-bottom: 22px`: `Zero → one build unit`
2. H1: **Dreamers need engine builders.**
3. Lead: *"Engine Ignite gets the rocket built and launched. Pre-seed founders, funded seed teams and corporate innovation groups hand us a thesis and a deadline; we return a production product they own outright."* (`margin-bottom: 30px`)
4. Button row, `gap: 12px`, both 15px / `padding: 13px 22px` with the offset shadow: `.btn-primary` **Start a project**, `.btn-secondary` (on `--color-bg`) **See engagement models**

**Right cell** — padding 24px, column, `gap: 14px`:

1. **Recessed readout**, padding 18px, mono 11.5px/1.9. Five rows, each `display: flex; justify-content: space-between`; label at `opacity: 0.6`, value full. Rows: `STAGE / 0 → 1`, `FIRST SHIP / 6 WEEKS`, `CREW / 2–4`, `SOURCE / CLIENT-OWNED`, `SLOTS Q3 / 2 OPEN`. The last two values are `--color-accent-400`.
2. Three 46px raised tiles, `grid-template-columns: repeat(3, 1fr)`, `gap: 10px`, mono 10px `0.1em` centered: `SPEC`, `BUILD`, `LAUNCH` — **LAUNCH is filled `--color-accent`** with `--color-bg` text and a `3px 3px 0` shadow at text 22%.
3. Mono 10px caption, text at 50%: `Status readout · live intake`.

The readout is static copy in the prototype. If you wire "SLOTS Q3" to anything real, it needs a CMS/config value — otherwise keep it editable in code and update it manually.

### 3. Capabilities

Padding `8px 32px 36px`. Header row: mono kicker `CAPABILITIES` in `--color-accent-700` + H2 **Four modules in the rack.**, `align-items: baseline`, `gap: 16px`, `margin-bottom: 18px`.

2×2 grid, `gap: 16px`, each cell a **raised panel** with `padding: 26px 28px`, column flex, `gap: 10px`:

| #  | Mono kicker (accent)   | Title                          | Body                                                                                                                                                                                           |
| -- | ---------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01 | `01 · IGNITION SPRINT` | Two weeks, thesis to spec      | We convert the idea into a written spec, an architecture decision record, a clickable prototype and a costed build plan any team could execute. You keep all of it, with or without us.        |
| 02 | `02 · ENGINE BUILD`    | Full-stack, shipped weekly     | A dedicated crew of two to four senior builders takes the plan to a production product: product design, application, data model, infrastructure. Every Friday something real is in your hands. |
| 03 | `03 · LAUNCH OPS`      | The parts that survive contact | Instrumentation, CI/CD, environments, alerting and a runbook. Unglamorous work that decides whether v1 holds together the week real users arrive.                                              |
| 04 | `04 · HAND-OFF`        | We staff ourselves out         | Documentation, architecture walkthroughs, and help hiring and onboarding the team that takes it forward. Finishing is somebody's job — we make sure it is a named somebody.                    |

### 4. Engagements (pricing)

Padding `8px 32px 40px`. Header: mono `ENGAGEMENTS` (accent-700) + H2 **Pick a setting.**

Three raised panels, `grid-template-columns: repeat(3, 1fr)`, `gap: 16px`, `padding: 24px`, column flex `gap: 12px`. Each card:

1. Indicator row — mono 11px `0.14em` uppercase in `--color-accent`, `gap: 8px`, led by an **8×8 square** (not a circle): text-at-25% for the outer two, `--color-accent` for the middle.
2. Price line (Archivo 800 32px) + unit suffix.
3. Mono 11px meta line, text at 55%.
4. Feature list — `border-top: 1px solid color-mix(in srgb, var(--color-text) 16%, transparent)`, `padding-top: 12px`, rows 13.5px, `gap: 7px`.
5. `.btn-block` pinned with `margin-top: auto` so all three buttons align.

| Card               | Price        | Meta                      | Features                                                                                        | Button                                                   |
| ------------------ | ------------ | ------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `01 · IGNITION`    | $12k flat    | 2 weeks · 2 people        | Written product spec / Architecture decision record / Clickable prototype / Costed build plan   | `.btn-secondary` on `--color-bg` — "Book an Ignition"    |
| `02 · ENGINE`      | $28k / month | 6–12 weeks · 2–4 builders | Dedicated build crew / Weekly production releases / Launch ops included / Full source ownership | `.btn-primary` — "Start a project"                       |
| `03 · AFTERBURNER` | $6k / month  | Ongoing · retained        | One senior day per week / Architecture review / Escalation line / Hiring support                | `.btn-secondary` on `--color-bg` — "Talk about retainer" |

**Engine is the featured card:** `border: 1px solid var(--color-accent)` and `box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 4px 4px 0 color-mix(in srgb, var(--color-accent) 35%, transparent)`.

Below the grid, `margin-top: 20px`, mono 11px text at 55%: *"Corporate innovation teams: SOW, security review and procurement supported."*

### 5. Poster close

Full-bleed `--color-accent` band. `padding: 48px 32px`, flex row, `align-items: flex-end`, `justify-content: space-between`, `gap: 40px`.

- H2 in `--color-bg`, 44px / 1.02, `-0.03em`, `max-width: 16ch`: **Zero to one is a discipline, not a mood.**
- Button: `--color-bg` fill, `--color-accent` label, 15px, `padding: 14px 22px`, `flex: none`, shadow `4px 4px 0 rgba(0,0,0,0.25)` — "Start a project".

This is the **only** place red runs as a field. Do not add a second red band.

### 6. Footer

`background: var(--color-neutral-100)`, `padding: 20px 32px`, flex row `justify-content: space-between`, mono 11px `0.06em` uppercase, text at 55%: `Engine Ignite · EI—01` / `build@engineignite.com` / `© 2026`.

## Interactions & behavior

Minimal by design — this is a static page.

- **Buttons/links:** hover and pressed states come from `styles.css` (`.btn-primary:hover` → `--color-accent-600`, `:active` → `--color-accent-700`; `.btn-secondary` hover/active are ink tints). Do not restyle them.
- **Focus:** `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` — already in the sheet. Never leave the browser default.
- **Nav links** scroll to `#capabilities`, `#engagements`, `#contact` anchors; every "Start a project" CTA goes to the same destination (a contact form, Cal.com booking, or `mailto:` — decide with the client; the prototype stubs them).
- **Panel press affordance (optional, nice):** on `:active`, translate a button `2px, 2px` and drop its offset shadow to `2px 2px 0`. That is the one motion the direction wants; keep it under 120ms and respect `prefers-reduced-motion`.
- No modals, no carousels, no scroll animation.

## State management

None. Static content, no client state, no data fetching. If the "SLOTS Q3 / 2 OPEN" readout becomes real, it is a single config or CMS field, not app state.

## Responsive behavior

The prototype is desktop-only at 1200px. Recommended breakdown:

- **≥1200px:** as specified.
- **900–1199px:** fluid width with 32px gutters; hero panel keeps its 2-column split but the right cell shrinks to `min(320px, 32%)`.
- **≤899px (tablet):** hero panel stacks — readout column moves below the copy, full width, divider becomes a top border. Capabilities go 1 column; engagements go 1 column.
- **≤600px (mobile):** gutters 20px; H1 to 40px, poster H2 to 32px; nav links collapse behind a menu button (`.btn-icon`, Lucide `menu`) with the primary CTA still visible; keep offset shadows at 3px so they do not overwhelm small panels.

Nothing about the direction depends on the 2-column hero — stacking reads fine as long as the panel edges and mono labels survive.

## Assets

- `design/assets/engine-ignite-mark.png` — the Engine Ignite mark, as supplied. **Get an SVG from the client before launch**; the PNG will not hold up on retina at the 44px bezel or in a favicon set. Do not recolor it, and do not apply the `.grayscale` wrapper to it.
- **No photography in this direction.** If the client wants imagery later, the system requires it in pure black and white via the `.grayscale` class — never tinted.
- Icons: **Lucide** (https://lucide.dev) if any are needed. The current design uses none.
- Fonts: Archivo 400/600/800 via Google Fonts (already `@import`ed in `styles.css`); self-host for production. Plus one monospace (see Typography).

## Files

- `design/Engine Ignite Landing.dc.html` — the design prototype. Direction **2A** (topmost section, badge "2A") is the one to build. Sections below it are earlier explorations, kept for reference only — ignore 1A and 1B.
- `design/styles.css` — Modernist token sheet + component classes. Usable as-is; port the `:root` block into the target project's styling layer if it uses tokens of its own.
- `design/modernist-design-system.md` — the design system's own guidance. Read the **Do / Don't** section before deviating: zero radius anywhere, flush-left everything, 2px dividers not hairlines, accent used sparingly.
- `design/assets/engine-ignite-mark.png` — logo mark.

## Copy notes

Tone is dry and technical on purpose — specifications, not enthusiasm. If new copy is needed, match that register: concrete nouns, no exclamation, no "we're passionate about." Numbers are illustrative placeholders and should be confirmed with the client before launch.
