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
    // Só WebP: o servidor converte cada tamanho no primeiro pedido, e o AVIF levava de 3 a 6 vezes mais
    formats: ['image/webp'],
    // Imagens de /public (adesivos dos serviços) mudam de nome se mudarem: 31 dias de cache no navegador
    minimumCacheTTL: 2678400,
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
