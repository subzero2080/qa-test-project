import type { MetadataRoute } from 'next'
import { config } from '@/lib/app-config'

// Public routes only. Add new marketing/content routes here.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/pricing', '/login', '/signup', '/privacy', '/terms']
  const now = new Date()
  return routes.map((path) => ({
    url: `${config.url}${path}`,
    lastModified: now,
  }))
}
