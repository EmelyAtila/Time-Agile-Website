import type { Metadata, Viewport } from 'next'
import { site } from '@/content/site'

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

// A imagem de compartilhamento vem de app/opengraph-image.tsx, e o Twitter/X herda título, descrição e
// imagem do Open Graph. Os dados para a busca local estão em lib/structured-data.ts
export const siteMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seoTitle,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: site.name,
    title: site.seoTitle,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  ...(googleVerification && { verification: { google: googleVerification } }),
  // O Google usa os dados estruturados; outros buscadores ainda leem estas metas de região
  other: {
    'geo.region': `${site.address.country}-${site.address.region}`,
    'geo.placename': site.address.locality,
  },
}

export const siteViewport: Viewport = {
  themeColor: '#FD4274',
  width: 'device-width',
  initialScale: 1,
}
