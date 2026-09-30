'use client'

import Image from 'next/image'
import { TESTIMONIALS, testimonialsIntro } from '@/content/testimonials'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Container,
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

export function Testimonials() {
  return (
    <section id="depoimentos" aria-labelledby="testimonials-title" className="py-section">
      <Container>
        <SectionHeading id="testimonials-title" className="text-right">
          <span className="block text-brand-yellow">{testimonialsIntro.title}</span>
          <span className="block text-brand-pink-light">{testimonialsIntro.highlight}</span>
        </SectionHeading>
      </Container>

      <Carousel opts={{ loop: true, align: 'center' }} aria-label="Depoimentos de clientes">
        <CarouselContent>
          {TESTIMONIALS.map((item, i) => (
            <CarouselItem key={i} className="basis-full md:basis-1/2 lg:basis-1/3">
              <figure
                className={cn('flex gap-4 rounded-md p-6 text-white', cardColors[item.color])}
              >
                <div>
                  <figcaption className="font-sans font-bold">{item.author}</figcaption>
                  <blockquote>
                    <p>“{item.quote}”</p>
                  </blockquote>
                </div>
                <Image
                  src={item.photo.src}
                  alt={item.photo.alt}
                  width={item.photo.width}
                  height={item.photo.height}
                  sizes="120px"
                  className="h-auto w-28 rounded-md"
                />
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Carrossel ocupa a largura toda: setas ficam dentro da tela para não gerar scroll horizontal */}
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  )
}
