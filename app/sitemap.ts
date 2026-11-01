import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { privacyPolicy, termsOfUse } from '@/content/legal'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...[privacyPolicy, termsOfUse].map((doc) => ({
      url: `${site.url}${doc.path}`,
      lastModified: new Date(doc.updatedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ]
}
