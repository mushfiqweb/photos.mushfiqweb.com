import type { MetadataRoute } from 'next'
import { SITE_METADATA } from '~/data/site-metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = SITE_METADATA.siteUrl
  const today = new Date().toISOString().split('T')[0]

  const routes = ['', 'about'].map((route) => ({
    url: route ? `${siteUrl}/${route}` : siteUrl,
    lastModified: today,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  return routes
}
