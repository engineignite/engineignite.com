# 4. Hosting on Cloudflare Workers static assets

- Status: accepted
- Date: 2026-08-13

## Context

The repository needs to be private. GitHub Pages only publishes from a private repository on
the Pro, Team, or Enterprise plans, and the `engineignite` organisation is on the free plan. Making
the repository private while staying on GitHub Pages would unpublish engineignite.com, including
the two URLs that App Store Connect requires for Articulation Drills.

Two facts decided where to go instead:

- DNS for engineignite.com is already served by Cloudflare. The nameservers are
  `earl.ns.cloudflare.com` and `janet.ns.cloudflare.com`, and the apex A records are Cloudflare
  addresses, so the domain is already proxied.
- Cloudflare Pages builds from a private repository on its free plan.

## Decision

Move hosting to Cloudflare **Workers static assets**, deployed from GitHub Actions with
`wrangler`, rather than to Cloudflare Pages or the Cloudflare Git integration.

Pages was the first choice and was built out, then replaced. The deciding difference is that a
Pages custom domain cannot be declared in configuration: wrangler's own validation rejects
`routes` for a Pages project, so the hostname would live only in the dashboard. Workers accepts
`routes` with `custom_domain = true`, which puts the production hostname in `wrangler.toml` beside
the assets directory, and lets `wrangler deploy` provision the DNS record. Everything the site
needs is otherwise identical: Workers static assets honours `_headers` and `_redirects`, serves
`path.html` at `/path`, and redirects the trailing-slash form to it.

Deploying from Actions keeps one deployment path: the same workflow that builds for CI builds for
release, using the same mise tasks. It also avoids installing a Cloudflare GitHub App with read
access to the repository, which matters more once the repository is private. The cost is two
secrets and one repository variable to manage.

The workflow stays dormant until the repository variable `CF_PAGES_PROJECT` is set, so it can be
merged before the Cloudflare side exists without turning CI red.

## Consequences

- **The migration is ordered so the site never goes dark.** Both hosts serve the same build until
  DNS moves. GitHub Pages keeps deploying, and `public/CNAME` stays in place, until Cloudflare
  serves the domain. Only then do the GitHub Pages workflow and `CNAME` come out, and only then
  does the repository go private. The runbook is in `next-steps.md`.
- **`build.format: 'file'` behaves better here.** Workers serves `/docs/<app>/support` from
  `support.html` and redirects the trailing-slash form to it with a 307. On GitHub Pages the
  trailing-slash form returned 404.
- **The hostname is code.** `wrangler.toml` carries the worker name, the assets directory and the
  custom domain, so a rebuild from scratch needs no dashboard clicks.
- **`workers_dev` stays on.** It gives a URL that verifies a deploy without touching DNS. Canonical
  links point at engineignite.com, so the second hostname does not compete in search.
- **Header control returns.** `public/_headers` sets security headers and immutable caching for
  fonts and hashed assets. GitHub Pages allows neither.
- **Actions minutes become metered.** Public repositories run free; a private repository on the
  free plan draws on the monthly quota. A CI run is a few minutes, so this is not close to a
  constraint, but it is no longer free.
- If Cloudflare Pages ever proves wrong, the site is static and the build output is portable. The
  binding to Cloudflare is one workflow step and one `_headers` file.
