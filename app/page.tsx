import { SCROLL_RESTORE_APPLY, SCROLL_RESTORE_BOOT } from '@/animations/scrollRestoreBoot'
import { Header } from '@/components/layout/Header'
import { Preloader } from '@/components/layout/Preloader'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { ScrollReveals } from '@/components/providers/ScrollReveals'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Services } from '@/components/sections/Services'
import { TagMarquee } from '@/components/sections/TagMarquee'
import { Projects } from '@/components/sections/Projects'
import { Testimonials } from '@/components/sections/Testimonials'
import { Contact } from '@/components/sections/Contact'
import { structuredDataJson } from '@/lib/structured-data'

// Pre-loader e restauração da rolagem só aqui: quem chega direto numa página interna vai ler, não ver a abertura
export default function Home() {
  return (
    <>
      {/* Antes do pre-loader: ele não toca quando o recarregar volta para o meio da página */}
      <script dangerouslySetInnerHTML={{ __html: SCROLL_RESTORE_BOOT }} />
      <Preloader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataJson }} />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Services />
        <TagMarquee />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton section="#contato" />
      <ScrollReveals />
      <script dangerouslySetInnerHTML={{ __html: SCROLL_RESTORE_APPLY }} />
    </>
  )
}
