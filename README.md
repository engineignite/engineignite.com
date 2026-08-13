# engineignite.com

The Engine Ignite site: the landing page, project pages, and per-project docs including the
per-project documentation. Static [Astro](https://astro.build) build, deployed to GitHub
Pages by GitHub Actions.

## Quick start

```bash
mise trust && mise install   # pinned tools: bun, node, dprint, prek, gitleaks
mise run dev                 # http://localhost:4321, with drafts visible
prek install                 # format/lint on every commit
```

| Task                     | What it does                                                        |
| ------------------------ | ------------------------------------------------------------------- |
| `mise run dev`           | Dev server. Shows drafts and unpublished docs.                      |
| `mise run build`         | Production build into `dist/`. Drafts and unpublished docs omitted. |
| `mise run build:preview` | Builds *everything* into `dist-preview/`, marked `noindex`.         |
| `mise run preview`       | Serve the last production build.                                    |
| `mise run check`         | Format, lint, types, secret scan, build. This is what CI runs.      |
| `mise run fix`           | Autofix: `oxlint --fix` then `dprint fmt`.                          |

## What's published, and what isn't

Content is visible in `dev` long before it is public. Production only builds an entry when:

- **Projects**: `draft: false` in `src/content/projects/<slug>.md`.
- **Docs**: the project has `docsPublished: true` **and** the page has `draft: false`. Support and
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
   - Support URL: `https://engineignite.com/docs/<slug>/support`
   - Privacy Policy URL: `https://engineignite.com/docs/<slug>/privacy`

   No terms page unless the app actually needs its own: Apple's standard EULA covers a normal app,
   and a custom one is only required for auto-renewable subscriptions.
3. Set `draft: false` on the project, `docsPublished: true` on it, and `draft: false` on each page
   that is ready. Pages left as drafts stay invisible.

Keep those slugs stable once an app ships. App Store Connect links point at them.

## Adding docs

Create `src/content/docs/<project-slug>/<page>.md` (see the example project's pages for the
frontmatter). Set `docsPublished: true` on the project when the section is ready to go live;
the header nav, `/docs` index, and sitemap pick it up automatically.

## Stack

| Concern        | Choice                                                                     |
| -------------- | -------------------------------------------------------------------------- |
| Framework      | Astro 7 (static; the theme toggle and mobile nav are the only client JS)   |
| Design         | Modernist handoff, direction 2A. See [`docs/design/`](docs/design/)        |
| Styling        | Tailwind v4, Modernist tokens as CSS variables, class-based dark mode      |
| Type           | Archivo 400 to 800 + JetBrains Mono 400, self-hosted latin subsets         |
| Content        | Astro content collections with typed frontmatter (`src/content.config.ts`) |
| Package mgr    | Bun (installs) · Node runs the Astro CLI                                   |
| Versions/tasks | mise (`.mise.toml`)                                                        |
| Format/lint    | dprint (astro/ts/css/md/json/toml/yaml) + oxlint + `astro check`           |
| Hooks          | prek (`.pre-commit-config.yaml`) + gitleaks                                |
| CI/CD          | GitHub Actions, Lighthouse budget on PRs                                   |
| SEO            | Sitemap, RSS, robots, OG/Twitter meta, build-time OG images                |

Design decisions and their rationale are in [`docs/adr/`](docs/adr/).

## Deployment

`main` builds and publishes automatically. Hosting is moving from GitHub Pages to **Cloudflare
Workers static assets** so the repository can be private, which GitHub Pages does not allow on the
free plan. See
[`docs/adr/0004-hosting-on-cloudflare-workers.md`](docs/adr/0004-hosting-on-cloudflare-workers.md).

`wrangler.toml` holds the worker name, the assets directory and the production hostname, so the
domain is configuration rather than a dashboard setting.

During the move both hosts run:

| Workflow                | Target             | Runs when                                                  |
| ----------------------- | ------------------ | ---------------------------------------------------------- |
| `deploy.yml`            | GitHub Pages       | Always, until Cloudflare serves the domain                 |
| `deploy-cloudflare.yml` | Cloudflare Workers | Once the `CLOUDFLARE_DEPLOY` repository variable is `true` |

The Cloudflare job needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets. The
cutover steps, in order, are in [`next-steps.md`](next-steps.md).

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

- `src/site.config.ts`: name, tagline, description, and the `cta` every "Start a project" button
  points at (currently `mailto:go@engineignite.com`).
- `src/data/landing.ts`: landing copy, meaning the status readout, capabilities and engagements.
  **The prices and the "2 open" slot count are the designer's placeholders. Confirm them before
  launch.**
