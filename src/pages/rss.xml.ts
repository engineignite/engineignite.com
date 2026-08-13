import { getProjects } from '@/lib/content'
import { SITE } from '@/site.config'
import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async (context) => {
  const projects = await getProjects()

  return rss({
    title: `${SITE.name} — Projects`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: projects.map((project) => ({
      title: project.data.title,
      description: project.data.tagline,
      link: `/projects/${project.id}`,
      pubDate: project.data.updated,
    })),
    customData: `<language>en-us</language>`,
  })
}
