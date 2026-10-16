import type { CSSProperties } from 'react'
import { SERVICES, servicesIntro } from '@/content/services'
import { SectionHeading } from '@/components/ui'
import { ServiceCard } from './services/ServiceCard'
import { ServiceFan } from './services/ServiceFan'
import { SERVICE_CARDS, STAGE } from './services/serviceCards'

// `--fan` é a largura do leque: --stage-width (styles/tokens.css) o faz caber na altura da janela
export function Services() {
  return (
    <section id="servicos" aria-labelledby="services-title">
      <div className="mx-auto max-w-[92.5rem] pb-16 pt-12 md:pt-14 lg:pt-[calc(var(--fan)*0.05)] lg:[--fan:var(--stage-width)]">
        {/* lg:pl acompanha o leque, que fica um pouco à direita do centro */}
        <header
          data-reveal-group
          className="px-6 text-center lg:pl-[calc(1.5rem+var(--fan)*0.0224)]"
        >
          <SectionHeading
            id="services-title"
            data-reveal="heading"
            className="text-[1.75rem] leading-tight tracking-[0.015em] text-brand-pink md:text-[1.875rem] lg:text-[length:calc(var(--fan)*0.02703)]"
          >
            {servicesIntro.title}
          </SectionHeading>
          <p
            data-reveal="text"
            className="mx-auto mt-[0.4em] max-w-[40em] text-[1rem] font-semibold leading-[1.54] md:text-[1.125rem] lg:text-[length:calc(var(--fan)*0.01622)]">
            {servicesIntro.description}
          </p>
        </header>

        <ServiceFan
          data-reveal-group="lg"
          className="relative mt-8 flex flex-col items-center gap-4 md:grid md:grid-cols-[repeat(2,18.5rem)] md:justify-center md:gap-x-3 md:gap-y-6 lg:mx-auto lg:mt-[calc(var(--fan)*0.025)] lg:block lg:aspect-[var(--stage)] lg:w-[var(--fan)]"
          style={{ '--stage': `${STAGE.width} / ${STAGE.height}` } as CSSProperties}
        >
          {SERVICES.map((service, index) => {
            const art = SERVICE_CARDS[index]

            return (
              <ServiceCard
                key={service.number}
                service={service}
                art={art}
                className="w-[min(18.5rem,78vw)] rotate-[var(--r)] md:w-full lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:w-[var(--w)] lg:origin-top-left"
                style={
                  {
                    '--x': `${(art.x / STAGE.width) * 100}%`,
                    '--y': `${(art.y / STAGE.height) * 100}%`,
                    '--w': `${(art.width / STAGE.width) * 100}%`,
                    '--r': `${art.angle}deg`,
                    zIndex: SERVICES.length - index,
                  } as CSSProperties
                }
              />
            )
          })}
        </ServiceFan>
      </div>
    </section>
  )
}
