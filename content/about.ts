import type { Person } from '@/types'

export const about = {
  title: 'Estratégia, criatividade e gestão para marcas que querem',
  highlight: 'Crescer!',
  // O \n só quebra a linha no desktop (About.tsx), para o texto não encostar no nome da
  // Mariana ao lado; no celular ele vira um espaço comum
  paragraphs: [
    'A Time Agile nasceu para mostrar que\nmarketing vai muito além de criar posts bonitos.',
    'Somos uma agência que une estratégia, criatividade e gestão para transformar empresas em marcas fortes, organizadas e preparadas para crescer.',
  ],
}

// As fotos são os adesivos do mockup, exportados em SVG: contorno branco em vetor e a
// foto original em alta embutida
export const TEAM: Person[] = [
  {
    name: 'Mariana Gomes',
    role: 'Gestora da Marca',
    photo: {
      src: '/images/Syicker-Mari.svg',
      alt: 'Mariana Gomes segurando um celular',
      width: 340,
      height: 429,
    },
  },
  {
    name: 'Iranides Souza',
    role: 'Sócia e gestora empresarial',
    photo: {
      src: '/images/Sticker-Iranides.svg',
      alt: 'Iranides Souza sorrindo com um celular nas mãos',
      width: 329,
      height: 434,
    },
  },
]
