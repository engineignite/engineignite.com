---
title: Getting started
description: How the docs section works.
project: example-app
order: 10
draft: true
updated: 2026-08-12
---

Docs live at `/docs/<project>/<page>` and are wired up but not published: a page ships
only when its project sets `docsPublished: true` **and** the page itself has
`draft: false`.

Until then these pages render in `mise run dev` and in a `mise run build:preview` build,
and are absent from the production build, the sitemap, and the navigation.

## Adding a page

Create `src/content/docs/<project-slug>/<page>.md` with frontmatter:

```yaml
---
title: Installing
project: <project-slug>
section: Guides   # optional sidebar group
order: 20         # lower sorts first
draft: false
---
```

The sidebar builds itself from `section` and `order`.
