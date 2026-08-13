import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection, reference } from 'astro:content'

/** Statuses a project can be in; drives the badge on cards and project pages. */
const status = z.enum(['live', 'beta', 'in-development', 'archived'])
const platform = z.enum(['ios', 'ipados', 'macos', 'watchos', 'visionos', 'web', 'cli'])

/**
 * One entry per project: `src/content/projects/<slug>.md` -> `/projects/<slug>`.
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One line, shown on cards and in OG images. */
      tagline: z.string(),
      /** Longer sentence used for <meta name="description">. */
      description: z.string(),
      status: status.default('in-development'),
      platforms: z.array(platform).default([]),
      appStoreUrl: z.url().optional(),
      siteUrl: z.url().optional(),
      repoUrl: z.url().optional(),
      /** Overrides SITE.email on this project's support page. */
      supportEmail: z.email().optional(),
      cover: image().optional(),
      /** Lower sorts first on the projects index. */
      order: z.number().default(100),
      /** Not built in production while true. */
      draft: z.boolean().default(false),
      /** Flip to true to publish this project's /docs section. */
      docsPublished: z.boolean().default(false),
      updated: z.coerce.date().optional(),
    }),
})

/**
 * Support / terms / privacy pages.
 *
 *   src/content/legal/<project-slug>/<kind>.md -> /projects/<project-slug>/<kind>
 *   src/content/legal/site/<kind>.md           -> /legal/<kind>
 *
 * These are the URLs you hand to App Store Connect, so keep the slugs stable.
 */
const legal = defineCollection({
  loader: glob({ base: './src/content/legal', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    /** Must match the filename: terms | privacy | support. */
    kind: z.enum(['terms', 'privacy', 'support']),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
})

/**
 * Per-project documentation: `src/content/docs/<project-slug>/<...>.md`
 * -> `/docs/<project-slug>/<...>`.
 *
 * Docs are wired up but not published: a page ships only when its project has
 * `docsPublished: true` and the page itself is not a draft.
 */
const docs = defineCollection({
  loader: glob({ base: './src/content/docs', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    project: reference('projects'),
    /** Sidebar grouping label; pages with no section land in the top group. */
    section: z.string().optional(),
    /** Lower sorts first within a section. */
    order: z.number().default(100),
    draft: z.boolean().default(false),
    updated: z.coerce.date().optional(),
  }),
})

export const collections = { projects, legal, docs }
