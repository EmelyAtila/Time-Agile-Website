import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),
  poweredByHeader: false,
  experimental: {
    // CSS no HTML (~14 KB com gzip): sem a requisição que bloqueia a primeira pintura
    inlineCss: true,
  },
  images: {
    // O Next serve o primeiro formato que o navegador aceita: AVIF antes, por ser menor
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 420, 640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
