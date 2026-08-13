# 2. Draft gating and the content model

- Status: accepted
- Date: 2026-08-12

## Context

The docs section is wanted structurally but has no content yet, and must not be publicly
visible. The same is true of project pages and of the support and privacy pages an app needs:
they have to exist and be reviewable long before they are public. Those URLs get registered in
App Store Connect, so they must be stable and predictable.

## Decision

Two content collections with typed schemas, and one gating rule enforced in
`src/lib/content.ts`:

```
projects  src/content/projects/<slug>.md          -> /projects/<slug>
docs      src/content/docs/<project>/<page>.md    -> /docs/<project>/<page>
```

Support and privacy are docs pages, not a separate kind. An app's manual and its policies are
the same sort of thing, text written about one project, and one collection means one schema,
one route, one sidebar and one publish rule instead of two of each. **Amended 2026-08-12:** an
earlier revision had a third `legal` collection with its own `/projects/<slug>/<kind>` routes;
it was folded into `docs`.

An entry is built in production only when it is not a draft; a docs page additionally
requires its project to set `docsPublished: true`. That gate covers support and privacy too, so
publishing an app's pages is deliberate rather than a side effect of writing them. Drafts render in `astro dev` and in a
`PREVIEW_DRAFTS=1` build, which also sets `noindex` and makes `robots.txt` disallow
everything.

`/docs` is a rest route that returns no paths while nothing is published, so the URL 404s
rather than existing as an empty page.

## Consequences

- Production currently emits the landing page, the projects index, `404`, `robots.txt`,
  `rss.xml`, and the sitemap. Nothing else is reachable, by design.
- Draft templates would otherwise rot untested, so CI runs `mise run build:preview` on every
  push. That build includes every draft, purely as a compile check.
- Publishing is a one-line frontmatter change plus a deploy, with no code edits.
- Directory position carries meaning (`docs/<project>/`). That is implicit
  where frontmatter would be explicit, but it keeps the URL structure obvious from the file
  tree and prevents a page from disagreeing with its own path.
