import type { Person } from '@/types'

export const about = {
  title: 'Estratégia, criatividade e gestão para marcas que querem',
  highlight: 'Crescer!',
  // O \n só quebra a linha no desktop (About.tsx); no celular vira espaço
  paragraphs: [
    'A Time Agile nasceu para mostrar que\nmarketing vai muito além de criar posts bonitos.',
    'Somos uma agência que une estratégia, criatividade e gestão para transformar empresas em marcas fortes, organizadas e preparadas para crescer.',
  ],
}

export const TEAM: Person[] = [
  {
    name: 'Mariana Gomes',
    role: 'Gestora da Marca',
    photo: {
      src: '/images/about/sticker-mariana.svg',
      alt: 'Mariana Gomes segurando um celular',
      width: 340,
      height: 429,
    },
  },
  {
    name: 'Iranides Souza',
    role: 'Sócia e gestora empresarial',
    photo: {
      src: '/images/about/sticker-iranides.svg',
      alt: 'Iranides Souza sorrindo com um celular nas mãos',
      width: 329,
      height: 434,
    },
  },
]
