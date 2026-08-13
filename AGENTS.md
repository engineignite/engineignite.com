# Agent instructions

Static Astro site for engineignite.com: project landing pages, App Store support/legal
pages, and per-project docs. Deployed to GitHub Pages by GitHub Actions.

## Before choosing tooling

Read Lee's standing preferences at `~/code/github.com/leetrout/preferences/stack/index.md`
(navigation rules in that repo's `AGENTS.md`). This project's own conventions win where they
differ; the notable local deviations are recorded in `docs/adr/`.

## Ground rules

- **Never publish content by accident.** Production builds only non-draft entries. Do not flip
  `draft: false` or `docsPublished: true` unless the task explicitly asks for it.
- **Slugs are contracts.** `/projects/<slug>/{support,privacy,terms}` URLs are registered in
  App Store Connect. Renaming a project slug breaks live App Store links.
- **Tokens, not raw colors.** Use the semantic Tailwind classes (`bg-bg`, `text-fg`,
  `text-muted`, `border-border`, `bg-accent`, …). They resolve to the CSS variables defined in
  `src/styles/global.css`; that block is the only place raw color values belong.
- **Keep it zero-JS.** The theme toggle is the only client script. Prefer static markup; add an
  island only when interactivity is genuinely required.
- **Run `mise run check`** before declaring work done — it is exactly what CI runs.

## Layout

```
src/content.config.ts    typed frontmatter schemas for all three collections
src/content/projects/    one file per project      -> /projects/<slug>
src/content/legal/       <owner>/<kind>.md         -> /projects/<owner>/<kind>, /legal/<kind>
src/content/docs/        <project>/<page>.md       -> /docs/<project>/<page>
src/lib/content.ts       draft gating + sorting helpers — all content access goes through here
src/site.config.ts       site name, tagline, description, contact, OG colors
src/styles/global.css    design tokens, dark mode, prose theming
```

## Commits

Short, imperative, capitalized subjects; no Conventional Commits prefix. Body only when the
"why" is not obvious.
