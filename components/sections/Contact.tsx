import { MailCheck } from 'lucide-react'
import { contactContent } from '@/content/contact'
import { site } from '@/content/site'
import { SectionHeading } from '@/components/ui'
import { ContactForm } from '@/components/forms/ContactForm'
import { SmartphoneIcon } from '@/components/decor/SmartphoneIcon'
import { ContactSmileys } from './contact/ContactSmileys'

const INFO_LINK =
  'flex items-center gap-3 rounded-sm font-serif text-[1rem] font-semibold transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-wine lg:gap-[calc(5.5*var(--u))] lg:text-[length:max(0.875rem,calc(20*var(--u)))]'
const ICON_SLOT =
  'flex w-8 shrink-0 justify-center lg:-ml-[calc(4*var(--u))] lg:w-[calc(33*var(--u))]'

// No desktop as medidas são px de docs/Desktop - 1.svg (--u), contados do topo da seção (y 4998 do mockup).
// --u também encolhe com a altura da janela: os 940px da seção (até o rodapé) cabem abaixo do header
export function Contact() {
  return (
    <section
      id="contato"
      aria-labelledby="contact-title"
      className="relative overflow-x-clip pb-20 pt-10 lg:pb-[calc(117.3*var(--u))] lg:pt-[calc(30.3*var(--u))] lg:[--u:min(var(--stage-width)/1480,(100svh_-_var(--header-height)_-_1rem)/940)]"
    >
      <ContactSmileys className="hidden lg:block" />

      <div className="mx-auto max-w-[92.5rem] px-6 md:px-12 lg:w-[calc(1480*var(--u))] lg:max-w-none lg:px-0">
        {/* max-w em `em` para o texto quebrar como no mockup. Toca inteiro: perto do fim da página o trecho
            de rolagem é curto e, preso a ele, o título ficava parado no meio, com as palavras cortadas */}
        <header
          data-reveal-group
          data-reveal-mode="play"
          className="mx-auto max-w-[33.5em] text-center text-[1.0625rem] md:text-[1.125rem] lg:text-[length:calc(24*var(--u))]"
        >
          <SectionHeading
            id="contact-title"
            data-reveal="heading"
            className="text-[1.75rem] font-black leading-[1.35] text-brand-pink md:text-[2rem] lg:text-[length:calc(40*var(--u))]"
          >
            {contactContent.title}
          </SectionHeading>
          {/* No celular só o título, para ele aparecer junto do formulário; o leitor de tela continua lendo o texto */}
          <p
            data-reveal="text"
            className="mt-3 font-semibold leading-[1.54] max-md:sr-only lg:mt-[calc(3.6*var(--u))]"
          >
            {contactContent.description}
          </p>
        </header>

        {/* O card amarelo vem antes no DOM, mas é colado depois que o formulário sobe (data-reveal-at) */}
        <div
          data-reveal-group="lg"
          className="relative mx-auto mt-8 max-w-[38rem] md:mt-12 lg:ml-[calc(408.2*var(--u))] lg:mt-[calc(112.8*var(--u))] lg:w-[calc(608*var(--u))] lg:max-w-none"
        >
          {/* Fora do celular: lá o e-mail e o telefone ficam só no rodapé. No tablet vem antes e avança sobre
              o canto do formulário, como no desktop */}
          <aside
            aria-labelledby="contact-info-title"
            data-reveal="sticker"
            data-reveal-at="0.55"
            className="relative z-10 ml-auto w-fit max-md:hidden md:-mb-6 lg:absolute lg:left-[calc(528*var(--u))] lg:top-[calc(-24*var(--u))] lg:mb-0 lg:ml-0 lg:w-[calc(329*var(--u))]"
          >
            <h3
              id="contact-info-title"
              className="mb-2 ml-1 font-sans text-[1.5rem] font-black leading-[1.2] text-brand-red lg:absolute lg:bottom-full lg:mb-[calc(7.7*var(--u))] lg:ml-[calc(4.7*var(--u))] lg:text-[length:calc(32*var(--u))]"
            >
              {contactContent.infoTitle}
            </h3>
            {/* Vinho: o branco do mockup dá 1,8:1 sobre o amarelo */}
            <ul className="flex flex-col gap-3 rounded-[1.25rem] bg-brand-yellow px-5 py-4 text-brand-wine lg:gap-[calc(20.5*var(--u))] lg:rounded-[calc(19*var(--u))] lg:pb-[calc(15.5*var(--u))] lg:pl-[calc(32.5*var(--u))] lg:pr-0 lg:pt-[calc(14*var(--u))]">
              <li>
                <a href={`mailto:${site.contact.email}`} className={INFO_LINK}>
                  <span className={ICON_SLOT}>
                    <MailCheck
                      aria-hidden
                      strokeWidth={2.5}
                      className="size-7 lg:size-[calc(29*var(--u))]"
                    />
                  </span>
                  <span className="underline decoration-1 underline-offset-[0.12em]">
                    {site.contact.email}
                  </span>
                </a>
              </li>
              <li>
                <a href={site.contact.whatsappUrl} className={INFO_LINK}>
                  <span className={ICON_SLOT}>
                    <SmartphoneIcon className="size-8 lg:size-[calc(33*var(--u))]" />
                  </span>
                  {site.contact.phoneDisplay}
                </a>
              </li>
            </ul>
          </aside>

          <ContactForm />
        </div>
      </div>
    </section>
  )
}
