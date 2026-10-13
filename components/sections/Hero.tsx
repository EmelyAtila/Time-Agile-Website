import { site } from '@/content/site'
import { Logo } from '@/components/layout/Logo'
import { InstagramIcon } from '@/components/decor/InstagramIcon'
import { WhatsAppIcon } from '@/components/decor/WhatsAppIcon'
import { HeroIntro } from './hero/HeroIntro'
import { HeroRibbons } from './hero/HeroRibbons'

const TITLE = 'Sua Marca Merece Ser Lembrada'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: site.social.instagram, Icon: InstagramIcon },
  { label: 'WhatsApp', href: site.contact.whatsappUrl, Icon: WhatsAppIcon },
]

export function Hero() {
  return (
    <HeroIntro
      id="inicio"
      aria-labelledby="hero-title"
      // Altura amarrada à largura nos extremos: no desktop mantém a proporção dentro do
      // que as curvas conseguem acompanhar (stretch em heroPaths.ts)
      className="relative isolate min-h-[max(100svh,135vw)] overflow-hidden lg:min-h-[max(min(100svh,75vw),38vw)]"
    >
      {/* O título visível é desenhado sobre a fita (SVG decorativo); este vale para leitor de tela e SEO */}
      <h1 id="hero-title" className="sr-only">
        {TITLE}!
      </h1>

      <HeroRibbons title={TITLE} mark="!" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-[var(--hero-padding-x)] pb-[clamp(1.75rem,4vw,3.75rem)]">
        <Logo data-intro="logo" className="h-auto w-[clamp(11.5rem,28.3vw,26.25rem)]" />

        <ul
          data-intro="social"
          aria-label="Redes sociais"
          className="flex shrink-0 items-center gap-5 rounded-full border-2 border-white/70 bg-brand-pink px-[22px] py-3.5 text-white"
        >
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="-m-1.5 block rounded-full p-1.5 transition-transform duration-300 ease-brand hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <Icon className="size-[30px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </HeroIntro>
  )
}
