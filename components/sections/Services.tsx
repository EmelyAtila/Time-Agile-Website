import Image from 'next/image'
import { SERVICES, servicesIntro } from '@/content/services'
import { Container, SectionHeading } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BrandColor } from '@/types'

// Classes completas (não interpolar) para o Tailwind conseguir detectá-las
const cardColors: Record<BrandColor, string> = {
  'pink-light': 'bg-brand-pink-light',
  yellow: 'bg-brand-yellow',
  orange: 'bg-brand-orange',
  pink: 'bg-brand-pink',
}

export function Services() {
  return (
    <section id="servicos" aria-labelledby="services-title">
      <Container className="py-section">
        <header className="text-center">
          <SectionHeading id="services-title" className="text-brand-pink">
            {servicesIntro.title}
          </SectionHeading>
          <p>{servicesIntro.description}</p>
        </header>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <li key={service.number}>
              <article className={cn('relative rounded-lg p-6', cardColors[service.color])}>
                <span aria-hidden>{service.number}</span>
                <h3 className="font-sans font-semibold">{service.title}</h3>
                <p>{service.description}</p>
                <Image
                  src={service.image.src}
                  alt={service.image.alt}
                  width={service.image.width}
                  height={service.image.height}
                  sizes="(min-width: 1024px) 12vw, 30vw"
                  className="h-auto w-32"
                />
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
