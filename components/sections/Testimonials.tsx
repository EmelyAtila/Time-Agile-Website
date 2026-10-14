'use client'

import { TESTIMONIALS, testimonialsIntro } from '@/content/testimonials'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  SectionHeading,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BrandColor } from '@/types'

const cardColors: Record<BrandColor, string> = {
  yellow: 'bg-brand-yellow',
  orange: 'bg-brand-orange',
  pink: 'bg-brand-pink',
  'pink-light': 'bg-brand-pink-light',
}

// O loop do Embla precisa de bem mais cards que os visíveis (até 4): repete a lista até ter o dobro
const MIN_SLIDES = 8
const COPIES = Math.ceil(MIN_SLIDES / TESTIMONIALS.length)
const SLIDES = Array.from({ length: COPIES }, (_, copy) =>
  TESTIMONIALS.map((item, index) => ({ item, copy, key: `${copy}-${index}` }))
).flat()

// A faixa (--strip) vai quase até as bordas, deixando 4rem para cada seta; --n cards inteiros dividem a largura
export function Testimonials() {
  return (
    <section
      id="depoimentos"
      aria-labelledby="testimonials-title"
      className="pb-16 pt-6 [--gap:1rem] [--n:1] [--strip:calc(100%_-_8rem)] md:[--gap:1.5rem] md:[--n:2] md:[--strip:min(100%_-_8rem,44rem)] lg:pb-[calc(var(--stage-width)*0.04)] lg:pt-[calc(var(--stage-width)*0.0128)] lg:[--gap:calc(var(--stage-width)*0.03)] lg:[--n:3] lg:[--strip:min(100%_-_8rem,var(--stage-width)*1.135)] xl:[--n:4]"
    >
      <div className="mx-auto w-[var(--strip)]">
        <SectionHeading
          id="testimonials-title"
          className="text-right text-[1.75rem] font-black leading-[1.35] md:text-[2rem] lg:text-[length:calc(var(--stage-width)*0.02703)]"
        >
          <span className="block text-brand-yellow">{testimonialsIntro.title}</span>
          <span className="block text-brand-pink-light lg:mr-[0.27em]">
            {testimonialsIntro.highlight}
          </span>
        </SectionHeading>
      </div>

      <Carousel
        opts={{ loop: true, align: 'start' }}
        aria-label="Depoimentos de clientes"
        className="mx-auto mt-8 w-[var(--strip)] lg:mt-[calc(var(--stage-width)*0.0298)]"
      >
        <CarouselContent className="-ml-[var(--gap)]">
          {SLIDES.map(({ item, copy, key }) => (
            <CarouselItem
              key={key}
              aria-hidden={copy > 0 || undefined}
              className="basis-[calc(100%/var(--n))] pl-[var(--gap)]"
            >
              <figure
                className={cn(
                  'flex h-full flex-col items-center justify-center rounded-[1.125rem] px-5 py-6 text-center',
                  cardColors[item.color]
                )}
              >
                <figcaption className="font-sans text-[1.0625rem] font-bold leading-tight text-white">
                  {item.author}
                </figcaption>
                <blockquote className="mt-3 font-serif text-[0.875rem] font-semibold leading-[1.5] text-black">
                  <p>“{item.quote}”</p>
                </blockquote>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}
