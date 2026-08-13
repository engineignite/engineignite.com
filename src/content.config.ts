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
 * Everything written about a project: guides, and the support and privacy pages
 * whose URLs go into App Store Connect.
 *
 *   src/content/docs/<project-slug>/<page>.md -> /docs/<project-slug>/<page>
 *
 * A page ships only when its project has `docsPublished: true` and the page
 * itself is not a draft.
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

export const collections = { projects, docs }
