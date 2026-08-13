import { getProjects } from '@/lib/content'
import { OG_COLORS, SITE } from '@/site.config'
import { OGImageRoute } from 'astro-og-canvas'

const projects = await getProjects()

/** Keys become paths: `site` -> /og/site.png, `projects/<slug>` -> /og/projects/<slug>.png */
const pages: Record<string, { title: string; description: string }> = {
  site: { title: SITE.name, description: SITE.tagline },
  ...Object.fromEntries(
    projects.map((project) => [
      `projects/${project.id}`,
      { title: project.data.title, description: project.data.tagline },
    ]),
  ),
}

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    padding: 72,
    bgGradient: [OG_COLORS.bgFrom, OG_COLORS.bgTo],
    border: { color: OG_COLORS.accent, width: 16, side: 'inline-start' },
    font: {
      title: { size: 72, weight: 'SemiBold', color: OG_COLORS.text, families: ['Inter'] },
      description: { size: 34, lineHeight: 1.4, color: OG_COLORS.muted, families: ['Inter'] },
    },
    fonts: ['./src/assets/fonts/Inter-Regular.ttf', './src/assets/fonts/Inter-SemiBold.ttf'],
  }),
})
