import { Instagram } from 'lucide-react'
import { site } from '@/content/site'
import { Container, SectionHeading } from '@/components/ui'
import { Logo } from '@/components/layout/Logo'
import { WhatsAppIcon } from '@/components/decor/WhatsAppIcon'

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Fitas decorativas: usar <Ribbon /> com os paths do mockup */}
      <Container className="relative flex min-h-screen flex-col justify-end pb-16 pt-header">
        {/* No mockup o título acompanha a fita laranja (SVG <textPath>) */}
        <SectionHeading id="hero-title" as="h1">
          Sua Marca Merece Ser Lembrada!
        </SectionHeading>

        <div className="flex items-end justify-between">
          <Logo className="text-7xl" />

          <ul className="flex gap-3" aria-label="Redes sociais">
            <li>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram aria-hidden />
              </a>
            </li>
            <li>
              <a
                href={site.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="size-6" />
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  )
}
