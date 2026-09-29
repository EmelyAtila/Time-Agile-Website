import type { Metadata, Viewport } from 'next'
import { Montserrat, Noto_Serif } from 'next/font/google'
import './globals.css'
import { siteMetadata, siteViewport } from '@/lib/metadata'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'

// Fonte principal (corpo de texto)
const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-noto-serif',
  display: 'swap',
})

// Fonte secundária (títulos, navegação, botões)
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = siteMetadata
export const viewport: Viewport = siteViewport

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${notoSerif.variable} ${montserrat.variable}`}>
      {/* suppressHydrationWarning: extensões do navegador injetam atributos no <body> */}
      <body
        className="bg-brand-cream font-serif text-brand-wine antialiased"
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-to-content">
          Ir para o conteúdo principal
        </a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
