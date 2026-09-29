import type { BrandColor, Testimonial } from '@/types'

export const testimonialsIntro = {
  title: 'Nossa melhor apresentação?',
  highlight: 'Nossos clientes!',
}

// TODO: substituir pelos depoimentos reais (o mockup repete o mesmo como placeholder)
const placeholder = {
  author: 'Dra. Mariana Oliveira',
  quote:
    'A Time Agile cuidou de toda nossa presença digital com muito profissionalismo, criatividade e atenção nos detalhes',
  photo: {
    src: '/images/testimonials/mariana-oliveira.png',
    alt: 'Dra. Mariana Oliveira',
    width: 1086,
    height: 1448,
  },
}

const colors: BrandColor[] = ['yellow', 'orange', 'pink', 'pink-light']

export const TESTIMONIALS: Testimonial[] = colors.map((color) => ({ ...placeholder, color }))
