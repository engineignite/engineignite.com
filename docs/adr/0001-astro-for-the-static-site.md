# 1. Astro for the static site

- Status: accepted
- Date: 2026-08-12

## Context

engineignite.com was a 2021 Skeleton CSS placeholder. It needs to become an umbrella site
hosting project landing pages, App Store support/legal pages, and eventually per-project
documentation. Hosting is GitHub Pages. Ruby tooling (Jekyll) is ruled out.

Hugo is the generator used on other sites and was the obvious incumbent. The standing
preferences (`~/code/github.com/leetrout/preferences`) put the rest of the toolchain in the
TypeScript ecosystem: Vite, React, Tailwind, Bun, oxlint.

## Decision

Use Astro.

- Vite-based and TypeScript-first, so it shares idiom, config, and muscle memory with the
  preferred frontend stack instead of being an isolated Go-template island.
- Content collections give typed frontmatter with build-time validation — a project entry
  cannot ship missing its support email or with a malformed App Store URL.
- Ships zero JavaScript by default, which suits a marketing/legal/docs site and keeps the
  Lighthouse budget cheap to hold. React islands remain available if a page ever needs them.
- MDX and a docs layout are first-party concerns, so the docs section did not need a second
  generator.

## Consequences

- A `node_modules` tree and a lockfile now exist, where Hugo needed one binary. Renovate and
  the CI lockfile check absorb that cost.
- Astro requires Node ≥ 22.12. Bun installs packages; the Astro CLI runs on Node, its
  supported runtime, and that is what CI does too.
- If the docs section outgrows the hand-rolled layout, Astro Starlight is the in-family
  upgrade — at the cost of a second design system to theme.
