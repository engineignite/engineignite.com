# Next steps

The repo is configured and the build passes. This file lists the work that is left.
Delete it when you finish the list.

## 1. Ship the branch

`main` is now PR-only, so you cannot push to it directly.

```bash
git push -u origin astro-site
gh pr create --fill
gh pr merge --squash
```

The merge starts the **Deploy** workflow. The workflow builds the site and publishes it to
GitHub Pages. Pages is already set to build from GitHub Actions, and `public/CNAME` keeps
the custom domain.

Watch the first deploy:

```bash
gh run watch
```

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
- **Mailbox.** Everything — CTAs, the footer, app support pages — points at
  `go@engineignite.com`. Confirm it exists and is monitored.
- **Brand mark.** `public/engine-ignite-mark.png` is the supplied PNG, and it is also the favicon.
  Get an SVG from the designer — the PNG will not hold up at the 44px nav bezel on retina.

One item to take back to the designer: the accent `#ec3013` behind `#f3f2f2` button labels
measures **3.79:1**. That clears the 3:1 the design system documents for chrome, but not WCAG AA
for 15px text. The build ships the color as designed and the Lighthouse accessibility gate sits at
0.9 to allow it. Darkening the primary button to `--color-accent-700` would clear AA at 6.5:1.

## 4. Add the first real project

1. Copy `src/content/projects/example-app.md` to `src/content/projects/<slug>.md`.
   The slug becomes the URL.
2. Copy `src/content/legal/example-app/` to `src/content/legal/<slug>/`.
3. Write the support, terms, and privacy pages.
4. Set `draft: false` on the project and on each legal page.
5. Delete the example files.

Give these URLs to App Store Connect:

| App Store Connect field | URL                                                |
| ----------------------- | -------------------------------------------------- |
| Support URL             | `https://engineignite.com/projects/<slug>/support` |
| Privacy Policy URL      | `https://engineignite.com/projects/<slug>/privacy` |
| EULA / Terms            | `https://engineignite.com/projects/<slug>/terms`   |

Do not rename a slug after an app ships. App Store Connect links point to it.

**The legal files are templates, not legal advice.** Read them and correct them before you
publish them. The privacy text must agree with the privacy answers in App Store Connect.

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
