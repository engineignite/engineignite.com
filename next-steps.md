# Next steps

The repo is configured and the build passes. This file lists the work that is left.
Delete it when you finish the list.

## 1. Make the repository private, without taking the site down

The site is live on GitHub Pages. GitHub Pages does not serve a private repository on the free
plan, so the repository cannot go private until Cloudflare Pages serves engineignite.com. Do these
in order. Steps 1 to 4 change nothing that visitors see.

DNS for engineignite.com is already on Cloudflare, so the final switch is a record change inside
one account, not a nameserver migration.

### 1. Create the API token and note the account id

Cloudflare dashboard, My Profile, API Tokens, Create Token. Use the **Cloudflare Pages: Edit**
template, scoped to your account. Copy the token once; it is not shown again.

The account id is on the right-hand side of any zone's overview page.

### 2. Tell the repository about it

```bash
gh secret set CLOUDFLARE_API_TOKEN  --repo engineignite/engineignite.com   # paste the token
gh secret set CLOUDFLARE_ACCOUNT_ID --repo engineignite/engineignite.com   # paste the account id
gh variable set CF_PAGES_PROJECT --repo engineignite/engineignite.com --body engineignite-com
```

The deploy workflow stays dormant until that variable exists.

### 3. Create the Pages project and deploy once

```bash
wrangler login
wrangler pages project create engineignite-com --production-branch main
gh workflow run "Deploy (Cloudflare)" --repo engineignite/engineignite.com
gh run watch --repo engineignite/engineignite.com
```

### 4. Check the build on the temporary URL

Open `https://engineignite-com.pages.dev`. Confirm the landing page, then these two, because they
are the ones App Store Connect will hold:

- `https://engineignite-com.pages.dev/docs/articulation-drills/support`
- `https://engineignite-com.pages.dev/docs/articulation-drills/privacy`

### 5. Point the domain at Cloudflare Pages

In the Pages project, Custom domains, add `engineignite.com`. Cloudflare updates the DNS record
itself, because the zone is in the same account.

Confirm the domain now comes from Pages rather than GitHub:

```bash
curl -sI https://engineignite.com/ | grep -iE '^(server|cf-ray)'
curl -s -o /dev/null -w '%{http_code}\n' https://engineignite.com/docs/articulation-drills/support
```

### 6. Retire GitHub Pages, then go private

Only after step 5 answers 200:

1. Repository Settings, Pages, unpublish the site.
2. Delete `.github/workflows/deploy.yml` and `public/CNAME`, which exist only for GitHub Pages.
3. Repository Settings, General, Change visibility, Make private.

Note that Actions minutes are billed against the free monthly quota once the repository is
private. A CI run takes a few minutes, so the quota is not a real constraint, but it is no longer
unlimited.

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
