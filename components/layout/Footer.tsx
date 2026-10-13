import { Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { NAV_LINKS } from '@/content/nav'
import { site } from '@/content/site'
import { Container } from '@/components/ui'
import { Logo } from './Logo'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-wine text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo className="h-auto w-44" />
          <p>{site.footerDescription}</p>
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
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin aria-hidden />
              </a>
            </li>
          </ul>
        </div>

        <nav aria-labelledby="footer-nav">
          <h2 id="footer-nav" className="font-sans font-bold">
            Navegue
          </h2>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans font-bold">Fale com a gente</h2>
          <ul>
            <li>
              <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-2">
                <Mail aria-hidden className="size-5" />
                {site.contact.email}
              </a>
            </li>
            <li>
              <a href={site.contact.whatsappUrl} className="inline-flex items-center gap-2">
                <Phone aria-hidden className="size-5" />
                {site.contact.phoneDisplay}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin aria-hidden className="size-5" />
              {site.contact.location}
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/30">
        <Container className="flex flex-wrap justify-between gap-4 py-6">
          <p>
            © {year} {site.name}. Todos os direitos reservados.
          </p>
          <ul className="flex gap-8">
            {/* TODO: criar as páginas /privacidade e /termos */}
            <li>
              <a href="/privacidade">Política de Privacidade</a>
            </li>
            <li>
              <a href="/termos">Termos de Uso</a>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  )
}
