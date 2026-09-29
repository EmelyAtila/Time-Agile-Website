import type { Person } from '@/types'

export const about = {
  title: 'Estratégia, criatividade e gestão para marcas que querem',
  highlight: 'Crescer!',
  paragraphs: [
    'A Time Agile nasceu para mostrar que marketing vai muito além de criar posts bonitos.',
    'Somos uma agência que une estratégia, criatividade e gestão para transformar empresas em marcas fortes, organizadas e preparadas para crescer.',
  ],
}

export const TEAM: Person[] = [
  {
    name: 'Mariana Gomes',
    role: 'Gestora da Marca',
    photo: {
      src: '/images/about/mariana-gomes.png',
      alt: 'Mariana Gomes segurando um celular',
      width: 1109,
      height: 1418,
    },
  },
  {
    name: 'Iranides Souza',
    role: 'Sócia e gestora empresarial',
    photo: {
      src: '/images/about/iranides-souza.png',
      alt: 'Iranides Souza sorrindo com um celular nas mãos',
      width: 1272,
      height: 1236,
    },
  },
]
