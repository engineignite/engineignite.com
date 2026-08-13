# engineignite.com

The Engine Ignite site: the landing page, project pages, and per-project docs including the
per-project documentation. Static [Astro](https://astro.build) build, deployed to GitHub
Pages by GitHub Actions.

## Quick start

```bash
mise trust && mise install   # pinned tools: bun, node, dprint, prek, gitleaks
mise run dev                 # http://localhost:4321 — drafts and unpublished docs visible
prek install                 # format/lint on every commit
```

| Task                     | What it does                                                        |
| ------------------------ | ------------------------------------------------------------------- |
| `mise run dev`           | Dev server. Shows drafts and unpublished docs.                      |
| `mise run build`         | Production build into `dist/`. Drafts and unpublished docs omitted. |
| `mise run build:preview` | Builds *everything* into `dist-preview/`, marked `noindex`.         |
| `mise run preview`       | Serve the last production build.                                    |
| `mise run check`         | Format, lint, types, secret scan, build — what CI runs.             |
| `mise run fix`           | Autofix: `oxlint --fix` then `dprint fmt`.                          |

## What's published, and what isn't

Content is visible in `dev` long before it is public. Production only builds an entry when:

- **Projects** — `draft: false` in `src/content/projects/<slug>.md`.
- **Docs** — the project has `docsPublished: true` **and** the page has `draft: false`. Support and
  privacy pages are docs pages like any other, so they publish the same way.

Today every sample entry is a draft, so production ships the landing page, the (empty)
projects index, `/404`, `/robots.txt`, `/rss.xml`, and the sitemap. `/docs` does not exist
until a project publishes docs; the docs layout, sidebar, and routing are already built and
are exercised on every CI run by `mise run build:preview`.

## Adding a project

1. Copy `src/content/projects/articulation-drills.md` to `src/content/projects/<slug>.md` and edit the
   frontmatter. The slug is the URL: `/projects/<slug>`.
2. Copy `src/content/docs/articulation-drills/` to `src/content/docs/<slug>/` and write at least
   the support and privacy pages. These are the URLs App Store Connect asks for:
   - Support URL — `https://engineignite.com/docs/<slug>/support`
   - Privacy Policy URL — `https://engineignite.com/docs/<slug>/privacy`

   No terms page unless the app actually needs its own: Apple's standard EULA covers a normal app,
   and a custom one is only required for auto-renewable subscriptions.
3. Set `draft: false` on the project, `docsPublished: true` on it, and `draft: false` on each page
   that is ready. Pages left as drafts stay invisible.

Keep those slugs stable once an app ships — App Store Connect links point at them.

## Adding docs

Create `src/content/docs/<project-slug>/<page>.md` (see the example project's pages for the
frontmatter). Set `docsPublished: true` on the project when the section is ready to go live;
the header nav, `/docs` index, and sitemap pick it up automatically.

## Stack

| Concern        | Choice                                                                     |
| -------------- | -------------------------------------------------------------------------- |
| Framework      | Astro 7 (static; the theme toggle and mobile nav are the only client JS)   |
| Design         | Modernist handoff, direction 2A — see [`docs/design/`](docs/design/)       |
| Styling        | Tailwind v4, Modernist tokens as CSS variables, class-based dark mode      |
| Type           | Archivo 400–800 + JetBrains Mono 400, self-hosted latin subsets            |
| Content        | Astro content collections with typed frontmatter (`src/content.config.ts`) |
| Package mgr    | Bun (installs) · Node runs the Astro CLI                                   |
| Versions/tasks | mise (`.mise.toml`)                                                        |
| Format/lint    | dprint (astro/ts/css/md/json/toml/yaml) + oxlint + `astro check`           |
| Hooks          | prek (`.pre-commit-config.yaml`) + gitleaks                                |
| CI/CD          | GitHub Actions → GitHub Pages, Lighthouse budget on PRs                    |
| SEO            | Sitemap, RSS, robots, OG/Twitter meta, build-time OG images                |

Design decisions and their rationale are in [`docs/adr/`](docs/adr/).

## Deployment

`main` → the **Deploy** workflow builds and publishes to GitHub Pages. The custom domain
lives in `public/CNAME`; Pages must be set to **Source: GitHub Actions** in repo settings.

## Design

The landing page implements the **Modernist** handoff kept in
[`docs/design/`](docs/design/) (direction 2A, "Panel"): nav, hero panel with the
status readout, capabilities, engagements, red poster close, footer. Its tokens drive every other
template too, so project and docs pages read as the same object.

Before changing anything visual, read [`docs/design/handoff.md`](docs/design/handoff.md) and
[`docs/adr/0003-modernist-design-system.md`](docs/adr/0003-modernist-design-system.md), which
records the three deliberate deviations. The rules that are easy to break by accident: zero corner
radius anywhere, flush-left everything including button labels, 2px rules rather than hairlines,
and red as a field in exactly one band.

## First edits

- `src/site.config.ts` — name, tagline, description, and the `cta` every "Start a project" button
  points at (currently `mailto:go@engineignite.com`).
- `src/data/landing.ts` — landing copy: status readout, capabilities, engagements. **The prices and
  the "2 open" slot count are the designer's placeholders — confirm them before launch.**
