# 2. Draft gating and the content model

- Status: accepted
- Date: 2026-08-12

## Context

The docs section is wanted structurally but has no content yet, and must not be publicly
visible. The same is true of project pages and legal templates: they need to exist and be
reviewable long before they are public. Legal URLs get registered in App Store Connect, so
they must be stable and predictable.

## Decision

Three content collections with typed schemas, and one gating rule enforced in
`src/lib/content.ts`:

```
projects  src/content/projects/<slug>.md          -> /projects/<slug>
legal     src/content/legal/<owner>/<kind>.md     -> /projects/<owner>/<kind>
                                                     /legal/<kind> when owner is `site`
docs      src/content/docs/<project>/<page>.md    -> /docs/<project>/<page>
```

An entry is built in production only when it is not a draft; a docs page additionally
requires its project to set `docsPublished: true`. Drafts render in `astro dev` and in a
`PREVIEW_DRAFTS=1` build, which also sets `noindex` and makes `robots.txt` disallow
everything.

`/docs` is a rest route that returns no paths while nothing is published, so the URL 404s
rather than existing as an empty page.

## Consequences

- Production currently emits the landing page, the projects index, `404`, `robots.txt`,
  `rss.xml`, and the sitemap. Nothing else is reachable, by design.
- Draft templates would otherwise rot untested, so CI runs `mise run build:preview` on every
  push — a build that includes every draft — purely as a compile check.
- Publishing is a one-line frontmatter change plus a deploy, with no code edits.
- Directory position carries meaning (`legal/<owner>/`, `docs/<project>/`). That is implicit
  where frontmatter would be explicit, but it keeps the URL structure obvious from the file
  tree and prevents a page from disagreeing with its own path.
