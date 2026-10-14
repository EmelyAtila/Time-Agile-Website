import type { CSSProperties } from 'react'
import { SERVICES, servicesIntro } from '@/content/services'
import { SectionHeading } from '@/components/ui'
import { ServiceCard } from './services/ServiceCard'
import { ServiceFan } from './services/ServiceFan'
import { SERVICE_CARDS, STAGE } from './services/serviceCards'

/*
 * Quatro faixas de tela:
 * - celular (até md): cards em coluna;
 * - tablet (md): cards em duas colunas;
 * - notebook e monitor (lg em diante): o leque do mockup, com tudo proporcional a `--fan`,
 *   a largura do leque. Ela é a maior que cabe na largura e na ALTURA da janela: do topo da
 *   seção até a base dos cards o mockup mede 728.6px para 1480px de largura (1480 / 728.6 =
 *   2.0313), então num notebook a seção inteira aparece abaixo do header; num monitor maior
 *   ela para nos 1480px do mockup.
 */
export function Services() {
  return (
    <section id="servicos" aria-labelledby="services-title">
      <div className="mx-auto max-w-[92.5rem] pb-16 pt-12 md:pt-14 lg:pt-[calc(var(--fan)*0.05)] lg:[--fan:clamp(62rem,min(100vw_-_2rem,(100svh_-_var(--header-height)_-_1.5rem)_*_2.0313),92.5rem)]">
        {/* lg:pl: no mockup o leque fica um pouco à direita do centro, e o cabeçalho o acompanha */}
        <header className="px-6 text-center lg:pl-[calc(1.5rem+var(--fan)*0.0224)]">
          <SectionHeading
            id="services-title"
            className="text-[1.75rem] leading-tight tracking-[0.015em] text-brand-pink md:text-[1.875rem] lg:text-[length:calc(var(--fan)*0.02703)]"
          >
            {servicesIntro.title}
          </SectionHeading>
          <p className="mx-auto mt-[0.4em] max-w-[40em] text-[1rem] font-semibold leading-[1.54] md:text-[1.125rem] lg:text-[length:calc(var(--fan)*0.01622)]">
            {servicesIntro.description}
          </p>
        </header>

        {/* No leque cada card fica na posição e inclinação do mockup, o primeiro por cima do
            seguinte. Nas faixas menores os mesmos cards seguem inclinados, e os cantos se
            sobrepõem só pelo giro. Cada card tem um movimento próprio no hover (ServiceFan) */}
        <ServiceFan
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
