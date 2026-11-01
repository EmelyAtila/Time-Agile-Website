import type { CSSProperties } from 'react'
import type { Metadata, Viewport } from 'next'
import { Noto_Serif } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { siteMetadata, siteViewport } from '@/lib/metadata'
import { SCROLL_RESTORE_APPLY, SCROLL_RESTORE_BOOT } from '@/animations/scrollRestoreBoot'
import { Preloader } from '@/components/layout/Preloader'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-noto-serif',
  display: 'swap',
})

// Sem a itálica: o site não usa texto itálico, e ela seria pré-carregada à toa
const satoshi = localFont({
  src: '../public/fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Variable.woff2',
  weight: '300 900',
  style: 'normal',
  variable: '--font-satoshi',
  display: 'swap',
})

// Só aparece abaixo da dobra: sem preload, e só entra depois do load (hooks/useLateScriptFont.ts).
// WOFF2 com o subset latin do Google Fonts (acentos, ç, aspas), gerado do .otf original
const handelson = localFont({
  src: '../public/fonts/handelson-one-maisfontes.086c/handelson-one.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-handelson',
  display: 'swap',
  preload: false,
})

// O fallback que o next/font ajusta às medidas da Handelson, sozinho: vale até ela entrar
const handelsonFallback = handelson.style.fontFamily.split(',').slice(1).join(',').trim()

export const metadata: Metadata = siteMetadata
export const viewport: Viewport = siteViewport

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: o script inline do Hero marca a entrada no <html> antes de o React hidratar
    <html
      suppressHydrationWarning
      lang="pt-BR"
      className={`${notoSerif.variable} ${satoshi.variable} ${handelson.variable}`}
      style={{ '--font-handelson-fallback': handelsonFallback || 'cursive' } as CSSProperties}
    >
      {/* suppressHydrationWarning: extensões do navegador injetam atributos no <body> */}
      <body
        className="bg-brand-cream font-serif text-brand-wine antialiased"
        suppressHydrationWarning
      >
        {/* Antes do pre-loader: ele não toca quando o recarregar volta para o meio da página */}
        <script dangerouslySetInnerHTML={{ __html: SCROLL_RESTORE_BOOT }} />
        <Preloader />
        <a href="#main-content" className="skip-to-content">
          Ir para o conteúdo principal
        </a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <script dangerouslySetInnerHTML={{ __html: SCROLL_RESTORE_APPLY }} />
      </body>
    </html>
  )
}
