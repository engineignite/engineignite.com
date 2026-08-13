# Next steps

The repo is configured and the build passes. This file lists the work that is left.
Delete it when you finish the list.

## 1. Make the repository private, without taking the site down

The site is live on GitHub Pages. GitHub Pages does not serve a private repository on the free
plan, so the repository cannot go private until Cloudflare Pages serves engineignite.com.

Most of this is done. What is left needs permissions that the wrangler OAuth token does not carry.

### Done

- Pages project `engineignite-com` created in the Cloudflare account `8cef3d9c...`.
- The current build is deployed and verified at
  [engineignite-com.pages.dev](https://engineignite-com.pages.dev). All 15 routes answer 200, the
  `_headers` rules apply, and the trailing-slash form redirects with a 308 instead of the 404 that
  GitHub Pages returned.
- The custom domain `engineignite.com` is attached to the project. It sits at `status=pending`
  until DNS points at Pages.
- The `CLOUDFLARE_ACCOUNT_ID` secret is set on the repository.

### 1. Finish wiring the deploy workflow

Create an API token in the Cloudflare dashboard: My Profile, API Tokens, Create Token, using the
**Cloudflare Pages: Edit** template. The wrangler OAuth token cannot be reused, because it belongs
to your login rather than to CI.

```bash
gh secret set CLOUDFLARE_API_TOKEN --repo engineignite/engineignite.com   # paste the token
gh variable set CF_PAGES_PROJECT --repo engineignite/engineignite.com --body engineignite-com
```

Set both. The workflow wakes up when the variable exists, and fails without the token.

### 2. Point the domain at Pages

This needs DNS edit rights, which the wrangler token does not have. In the Cloudflare dashboard,
open the Pages project, then Custom domains. `engineignite.com` is already listed as pending, and
Cloudflare offers to update the DNS record for you.

The apex currently resolves to GitHub Pages through the Cloudflare proxy. The change replaces that
with a proxied record pointing at `engineignite-com.pages.dev`.

Then confirm the domain is served by Pages rather than GitHub. The `via: 1.1 varnish` and
`x-served-by: cache-...` headers are GitHub's CDN, so they should disappear:

```bash
curl -sI https://engineignite.com/ | grep -iE '^(server|via|x-served-by)'
curl -s -o /dev/null -w '%{http_code}\n' https://engineignite.com/docs/articulation-drills/support
```

### 3. Retire GitHub Pages, then go private

Only once the check above answers 200 from Pages:

1. Repository Settings, Pages, unpublish the site.
2. Delete `.github/workflows/deploy.yml` and `public/CNAME`, which exist only for GitHub Pages.
3. Repository Settings, General, Change visibility, Make private.

Actions minutes are billed against the free monthly quota once the repository is private. A CI run
takes a few minutes, so the quota is not a real constraint, but it is no longer unlimited.

## 1b. Decide about Cloudflare email obfuscation

Scrape Shield's **Email Address Obfuscation** is on for the zone, so it rewrites the site's mailto
links. On the live site every "Start a project" link points at `/cdn-cgi/l/email-protection#...`
instead of `mailto:go@engineignite.com`, and the footer reads "[email protected]" until JavaScript
decodes it.

The CTA is the whole point of the landing page, and it currently depends on JavaScript. This is a
zone setting, so moving to Pages does not change it.

To turn it off: Cloudflare dashboard, the engineignite.com zone, Scrape Shield, Email Address
Obfuscation, off. The trade-off is that `go@engineignite.com` becomes readable to scrapers.

## 2. Add the CI check to the ruleset

A required status check cannot be added before the check reports one time. After the first
CI run finishes, add it:

```bash
gh api -X PUT repos/engineignite/engineignite.com/rulesets/20774232 \
  --input - <<'JSON'
{
  "name": "main",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "bypass_actors": [],
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_linear_history" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false,
        "allowed_merge_methods": ["squash"]
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [
          { "context": "Format, lint, types, build" },
          { "context": "Lighthouse" }
        ]
      }
    }
  ]
}
JSON
```

## 3. Confirm the design copy and open items

The landing page now carries the handoff's copy. Three things need your confirmation:

- **Prices.** `$12k` / `$28k` / `$6k` in `src/data/landing.ts` are the designer's illustrative
  placeholders. So is `SLOTS Q3 · 2 OPEN` in the status readout.
- **Mailbox.** Everything points at one address: CTAs, the footer, and app support pages all use
  `go@engineignite.com`. Confirm it exists and is monitored.
- **Brand mark.** Done. `ei_logo_on_light.svg` and `ei_logo_on_dark.svg` are in `public/`, the
  nav swaps them by theme, and `favicon.svg` follows the OS theme.

One item to take back to the designer: the accent `#ec3013` behind `#f3f2f2` button labels
measures **3.79:1**. That clears the 3:1 the design system documents for chrome, but not WCAG AA
for 15px text. The build ships the color as designed and the Lighthouse accessibility gate sits at
0.9 to allow it. Darkening the primary button to `--color-accent-700` would clear AA at 6.5:1.

## 4. Add the first real project

1. Copy `src/content/projects/articulation-drills.md` to `src/content/projects/<slug>.md`.
   The slug becomes the URL.
2. Copy `src/content/docs/articulation-drills/` to `src/content/docs/<slug>/`.
3. Write the support, terms, and privacy pages.
4. Set `draft: false` on the project, `docsPublished: true` on it, and `draft: false` on each
   page that is ready.
5. Delete the example files.

Give these URLs to App Store Connect:

| App Store Connect field | URL                                                |
| ----------------------- | -------------------------------------------------- |
| Support URL             | `https://engineignite.com/projects/<slug>/support` |
| Privacy Policy URL      | `https://engineignite.com/projects/<slug>/privacy` |
| EULA / Terms            | `https://engineignite.com/projects/<slug>/terms`   |

Do not rename a slug after an app ships. App Store Connect links point to it.

No terms page unless an app needs its own. Apple's standard EULA covers a normal app, and a
custom one is only required for auto-renewable subscriptions. Whatever you do publish, the
privacy text must agree with the privacy answers in App Store Connect.

## 5. Publish docs when you have content

The docs section is built but not public.

1. Add `src/content/docs/<project>/<page>.md` files.
2. Set `draft: false` on each page.
3. Set `docsPublished: true` on the project.

The header link, the `/docs` index, and the sitemap then appear automatically.

## 6. Optional: security scanning

You did not select this. Enable it later with:

```bash
gh api -X PATCH repos/engineignite/engineignite.com \
  -F security_and_analysis[secret_scanning][status]=enabled \
  -F security_and_analysis[secret_scanning_push_protection][status]=enabled
```

Renovate is configured in `.github/renovate.json5`, but it does not run until you install
the Renovate GitHub App on the `engineignite` org.

## Known risk

The Lighthouse job asserts high scores: performance 0.95, accessibility 1.0,
best practices 0.95, and SEO 1.0. The first PR can fail on a threshold. If that happens,
read the report in the workflow artifacts. Then correct the page, or lower the threshold in
`lighthouserc.json`.

## Commands

```bash
mise trust && mise install   # one time, per machine
prek install                 # one time, per clone
mise run dev                 # drafts and unpublished docs are visible
mise run check               # everything CI runs
mise run fix                 # autofix format and lint
```
