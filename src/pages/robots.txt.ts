import { previewDrafts } from '@/lib/content'
import { SITE } from '@/site.config'
import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site ?? SITE.url).href

  // A draft preview build must never be indexed if it is published somewhere.
  const body = previewDrafts
    ? ['User-agent: *', 'Disallow: /', ''].join('\n')
    : ['User-agent: *', 'Allow: /', 'Disallow: /og/', '', `Sitemap: ${sitemap}`, ''].join('\n')

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
