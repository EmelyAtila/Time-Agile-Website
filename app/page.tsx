import { Header } from '@/components/layout/Header'
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

export default function Home() {
  return (
    <>
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
    </>
  )
}
