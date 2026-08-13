import { type CollectionEntry, getCollection } from 'astro:content'

/**
 * Drafts and unpublished docs render in `astro dev` and in a PREVIEW_DRAFTS=1
 * build, and are omitted from the production build.
 */
export const previewDrafts = import.meta.env.DEV || process.env['PREVIEW_DRAFTS'] === '1'

export type Project = CollectionEntry<'projects'>
export type Doc = CollectionEntry<'docs'>

/** Projects that should be built, sorted by `order` then title. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', ({ data }) => previewDrafts || !data.draft)
  return projects.toSorted((a, b) =>
    a.data.order - b.data.order || a.data.title.localeCompare(b.data.title)
  )
}

export async function getProject(id: string): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.id === id)
}

/** `<project>/<...slug>` -> project slug. */
export function docProject(entry: Doc): string {
  return entry.id.split('/')[0] ?? ''
}

/** `<project>/<...slug>` -> the part of the path after the project slug. */
export function docSlug(entry: Doc): string {
  return entry.id.split('/').slice(1).join('/')
}

/**
 * Docs pages that should be built. A page ships only when its project is
 * published, the project has `docsPublished: true`, and the page is not a draft
 * This does not apply when we are previewing drafts.
 */
export async function getDocs(project?: string): Promise<Doc[]> {
  const projects = await getProjects()
  const publishable = new Set(
    projects.filter((entry) => previewDrafts || entry.data.docsPublished).map((entry) => entry.id),
  )

  const entries = await getCollection('docs', ({ data }) => previewDrafts || !data.draft)
  return entries
    .filter((entry) => publishable.has(docProject(entry)))
    .filter((entry) => !project || docProject(entry) === project)
    .toSorted((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title))
}

/** Projects that have at least one buildable docs page. */
export async function getDocumentedProjects(): Promise<Project[]> {
  const docs = await getDocs()
  const withDocs = new Set(docs.map(docProject))
  return (await getProjects()).filter((project) => withDocs.has(project.id))
}

/** Group docs into ordered sidebar sections. */
export function groupDocs(docs: Doc[]): { section: string; entries: Doc[] }[] {
  const groups = new Map<string, Doc[]>()
  for (const entry of docs) {
    const section = entry.data.section ?? ''
    groups.set(section, [...(groups.get(section) ?? []), entry])
  }
  return [...groups.entries()]
    .toSorted(([a], [b]) => (a === '' ? -1 : b === '' ? 1 : a.localeCompare(b)))
    .map(([section, entries]) => ({ section, entries }))
}

export const STATUS_LABELS: Record<Project['data']['status'], string> = {
  'live': 'Live',
  'beta': 'Beta',
  'in-development': 'In development',
  'archived': 'Archived',
}

export const PLATFORM_LABELS: Record<Project['data']['platforms'][number], string> = {
  ios: 'iOS',
  ipados: 'iPadOS',
  macos: 'macOS',
  watchos: 'watchOS',
  visionos: 'visionOS',
  web: 'Web',
  cli: 'CLI',
}
