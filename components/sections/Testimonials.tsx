import { TESTIMONIALS, testimonialsIntro } from '@/content/testimonials'
import { Marquee, SectionHeading } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BrandColor } from '@/types'

const cardColors: Record<BrandColor, string> = {
  yellow: 'bg-brand-yellow',
  orange: 'bg-brand-orange',
  pink: 'bg-brand-pink',
  'pink-light': 'bg-brand-pink-light',
}

// Cada cópia da faixa precisa ser mais larga que a tela, senão abre um buraco no loop
const MIN_CARDS = 8
const REPEAT = Math.ceil(MIN_CARDS / TESTIMONIALS.length)
const CARDS = Array.from({ length: REPEAT }, () => TESTIMONIALS).flat()

// O título fica na faixa --strip; os cards correm de borda a borda da tela
export function Testimonials() {
  const renderList = (hidden: boolean) => (
    // pr igual ao gap: as duas cópias ficam com a mesma largura e o loop não dá salto.
    // Sem animação: só os depoimentos, uma vez, quebrando linha em vez de virar uma rolagem na mão
    <ul
      aria-hidden={hidden || undefined}
      className={cn(
        'flex shrink-0 gap-[var(--gap)] pr-[var(--gap)] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-6',
        hidden && 'motion-reduce:hidden'
      )}
    >
      {CARDS.map((item, index) => (
        // As repetições só enchem a faixa: o leitor de tela lê cada depoimento uma vez
        <li
          key={index}
          aria-hidden={index >= TESTIMONIALS.length || undefined}
          className={cn(
            'w-[var(--card)] shrink-0',
            index >= TESTIMONIALS.length && 'motion-reduce:hidden'
          )}
        >
          <figure
            data-reveal="card-up"
            className={cn(
              // Topo, não centro: com depoimentos de tamanhos diferentes, nome e texto ficam na mesma linha em todos os cards
              'flex h-full flex-col items-center justify-start rounded-[1.125rem] px-5 py-6 text-center',
              cardColors[item.color]
            )}
          >
            <figcaption className="font-sans text-[1.0625rem] font-bold leading-tight text-brand-wine">
              {item.author}
            </figcaption>
            <blockquote className="mt-3 font-serif text-[0.875rem] font-semibold leading-[1.5] text-black">
              <p>“{item.quote}”</p>
            </blockquote>
          </figure>
        </li>
      ))}
    </ul>
  )

  return (
    <section
      id="depoimentos"
      aria-labelledby="testimonials-title"
      className="pb-16 pt-6 [--card:17rem] [--gap:1rem] [--strip:calc(100%_-_3rem)] md:[--card:20rem] md:[--gap:1.5rem] md:[--strip:min(100%_-_6rem,44rem)] lg:pb-[calc(var(--stage-width)*0.04)] lg:pt-[calc(var(--stage-width)*0.0128)] lg:[--card:calc(var(--stage-width)*0.26)] lg:[--gap:calc(var(--stage-width)*0.03)] lg:[--strip:min(100%_-_8rem,var(--stage-width)*1.135)]"
    >
      {/* overflow-x-clip: as linhas do título entram pela direita sem passar da borda da tela.
          Laranja escuro e rosa: o amarelo e o rosa-claro do mockup dão 1,6:1 e 1,8:1 sobre o creme */}
      <div data-reveal-group className="mx-auto w-[var(--strip)] overflow-x-clip">
        <SectionHeading
          id="testimonials-title"
          className="text-right text-[1.75rem] font-black leading-[1.35] md:text-[2rem] lg:text-[length:calc(var(--stage-width)*0.02703)]"
        >
          <span data-reveal="slide" className="block text-brand-orange-dark">
            {testimonialsIntro.title}
          </span>
          <span data-reveal="slide" className="block text-brand-pink lg:mr-[0.27em]">
            {testimonialsIntro.highlight}
          </span>
        </SectionHeading>
      </div>

      {/* overflow-x-clip, não hidden: os cards sobem girando sem serem cortados em cima e embaixo.
          A entrada toca no tempo dela (data-reveal-mode): presa à rolagem, brigaria com a faixa andando.
          Sem animação, os cards ficam parados em linhas */}
      <Marquee
        role="region"
        aria-label="Depoimentos de clientes"
        data-reveal-group
        data-reveal-mode="play"
        className="mt-8 overflow-x-clip lg:mt-[calc(var(--stage-width)*0.0298)]"
      >
        <div data-marquee-track className="flex w-max motion-reduce:w-auto">
          {renderList(false)}
          {renderList(true)}
        </div>
      </Marquee>
    </section>
  )
}
