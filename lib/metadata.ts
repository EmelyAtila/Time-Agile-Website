import type { Metadata, Viewport } from 'next'
import { site } from '@/content/site'

const title = `${site.name} | ${site.tagline}`

export const siteMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
    // TODO: adicionar public/og-image.jpg (1200x630)
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: site.description,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const siteViewport: Viewport = {
  themeColor: '#FD4274',
  width: 'device-width',
  initialScale: 1,
}
