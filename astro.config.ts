import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { SITE } from './src/site.config'

// Draft/unpublished content is built only in dev or when PREVIEW_DRAFTS=1.
const previewDrafts = process.env['PREVIEW_DRAFTS'] === '1'

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'never',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    mdx(),
    sitemap({
      // Social images and anything only visible in a draft preview stay out of the sitemap.
      filter: (page) => !page.includes('/og/') && !previewDrafts,
    }),
  ],
  markdown: {
    // Dual themes; the .dark swap lives in src/styles/global.css.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
