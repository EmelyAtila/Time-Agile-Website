import type { Metadata, Viewport } from 'next'
import { Noto_Serif } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { siteMetadata, siteViewport } from '@/lib/metadata'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'

// Fonte principal (corpo de texto)
const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-noto-serif',
  display: 'swap',
})

// Fonte secundária (títulos, navegação, botões) — arquivo variável, cobre pesos 300–900
const satoshi = localFont({
  src: [
    {
      path: '../public/fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Variable.woff2',
      weight: '300 900',
      style: 'normal',
    },
    {
      path: '../public/fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-VariableItalic.woff2',
      weight: '300 900',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
})

// Fonte criativa (destaques, nomes, títulos de projetos)
const handelson = localFont({
  src: '../public/fonts/handelson-one-maisfontes.086c/handelson-one.otf',
  weight: '400',
  style: 'normal',
  variable: '--font-handelson',
  display: 'swap',
})

export const metadata: Metadata = siteMetadata
export const viewport: Viewport = siteViewport

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${notoSerif.variable} ${satoshi.variable} ${handelson.variable}`}>
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
