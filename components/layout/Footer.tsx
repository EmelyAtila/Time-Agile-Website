import Image from 'next/image'
import { Mail, MapPin } from 'lucide-react'
import { NAV_LINKS } from '@/content/nav'
import { site } from '@/content/site'
import { InstagramIcon } from '@/components/decor/InstagramIcon'
import { LinkedInIcon } from '@/components/decor/LinkedInIcon'
import { WhatsAppIcon } from '@/components/decor/WhatsAppIcon'

const LINK =
  'rounded-sm transition-opacity hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
const HEADING =
  'font-sans text-[1.25rem] font-bold leading-tight lg:text-[length:max(1.125rem,calc(24*var(--u)))]'
const ITEM_TEXT = 'text-[1rem] leading-snug lg:text-[length:max(0.875rem,calc(18*var(--u)))]'
const CONTACT_ICON = 'size-6 shrink-0 text-white/70 lg:size-[calc(24*var(--u))]'

// No desktop as medidas são px de docs/Desktop - 1.svg (--u), contados do topo do rodapé (y 5938 do mockup);
// na horizontal as colunas ficam na mesma fração da largura que no mockup (cqw = 1% da largura do rodapé).
// Sem position/z-index aqui: o Sorrizinho do Contato (z-10) continua por cima da borda de cima
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      data-reveal-group="lg"
      className="bg-brand-wine text-white lg:[--u:calc(var(--stage-width)/1480)] lg:[container-type:inline-size]"
    >
      {/* No celular "Navegue" e "Fale com a gente" ficam lado a lado a partir de 360px; abaixo disso o e-mail não cabe */}
      <div className="mx-auto grid max-w-[92.5rem] gap-10 px-6 pb-12 pt-14 min-[360px]:grid-cols-[auto_1fr] min-[360px]:gap-x-5 md:grid-cols-2 md:gap-x-10 md:px-12 lg:min-h-[calc(422*var(--u))] lg:max-w-none lg:grid-cols-[calc(730cqw/14.8)_calc(174cqw/14.8)_1fr] lg:content-start lg:gap-0 lg:pb-0 lg:pl-[calc(145cqw/14.8)] lg:pr-0 lg:pt-[calc(86*var(--u))]">
        <div className="min-[360px]:col-span-2 lg:col-span-1">
          <Image
            data-reveal="rise"
            src="/images/logo-footer.svg"
            alt={`${site.name} — ${site.tagline}`}
            width={276}
            height={61}
            unoptimized
            className="h-auto w-56 lg:w-[calc(276*var(--u))]"
          />
          <p
            data-reveal="rise"
            className="mt-6 max-w-[30rem] text-[0.9375rem] font-semibold leading-[1.6] text-white/80 lg:mt-[calc(18*var(--u))] lg:w-[calc(461*var(--u))] lg:max-w-none lg:text-justify lg:text-[length:max(0.875rem,calc(20*var(--u)))] lg:leading-[1.565]"
          >
            {site.footerDescription}
          </p>
          <ul
            data-reveal="rise"
            className="mt-5 flex gap-5 lg:ml-[calc(6*var(--u))] lg:mt-[calc(13*var(--u))] lg:gap-[calc(19*var(--u))]"
            aria-label="Redes sociais"
          >
            <li>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Time Agile"
                className={`block ${LINK}`}
              >
                <InstagramIcon className="size-6 lg:size-[calc(24*var(--u))]" />
              </a>
            </li>
            <li>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn da Time Agile"
                className={`block ${LINK}`}
              >
                <LinkedInIcon className="size-6 lg:size-[calc(24*var(--u))]" />
              </a>
            </li>
          </ul>
        </div>

        <nav
          aria-labelledby="footer-nav"
          data-reveal="rise"
          data-reveal-at="0.15"
          className="lg:pt-[calc(34*var(--u))]"
        >
          <h2 id="footer-nav" className={HEADING}>
            Navegue
          </h2>
          <ul className="mt-4 flex flex-col gap-3 lg:mt-[calc(18*var(--u))] lg:gap-[calc(12*var(--u))]">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={`${LINK} ${ITEM_TEXT}`}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div data-reveal="rise" className="lg:pt-[calc(34*var(--u))]">
          <h2 id="footer-contact" className={HEADING}>
            Fale com a gente
          </h2>
          <address
            aria-labelledby="footer-contact"
            className={`mt-4 not-italic lg:mt-[calc(18*var(--u))] ${ITEM_TEXT}`}
          >
            <ul className="flex flex-col gap-3 lg:gap-[calc(18*var(--u))]">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className={`flex w-fit items-center gap-3 lg:gap-[calc(14*var(--u))] ${LINK}`}
                >
                  <Mail aria-hidden className={CONTACT_ICON} />
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={site.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex w-fit items-center gap-3 lg:gap-[calc(14*var(--u))] ${LINK}`}
                >
                  <WhatsAppIcon className={CONTACT_ICON} />
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3 lg:gap-[calc(14*var(--u))]">
                <MapPin aria-hidden className={CONTACT_ICON} />
                {site.contact.location}
              </li>
            </ul>
          </address>
        </div>
      </div>

      <div
        data-reveal="wipe"
        data-reveal-from="center"
        className="border-t-2 border-white/70 lg:border-t-[length:max(2px,calc(3*var(--u)))]"
      >
        <div className="mx-auto flex max-w-[92.5rem] flex-col items-center gap-3 px-6 py-6 text-center text-[0.875rem] text-white/60 md:flex-row md:justify-between md:px-12 md:text-left lg:min-h-[calc(84*var(--u))] lg:max-w-none lg:px-[calc(67cqw/14.8)] lg:pb-[calc(12*var(--u))] lg:pt-0 lg:text-[length:max(0.8125rem,calc(20*var(--u)))]">
          <p>
            © {year} {site.name}. Todos os direitos reservados.
          </p>
          <ul className="flex gap-8 lg:gap-[calc(59*var(--u))]">
            {/* TODO: criar as páginas /privacidade e /termos */}
            <li>
              <a href="/privacidade" className={LINK}>
                Política de Privacidade
              </a>
            </li>
            <li>
              <a href="/termos" className={LINK}>
                Termos de Uso
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
