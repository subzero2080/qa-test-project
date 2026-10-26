import type { MetadataRoute } from 'next'
import { config } from '@/lib/app-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app/', '/api/'],
    },
    sitemap: `${config.url}/sitemap.xml`,
  }
}
