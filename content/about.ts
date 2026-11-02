import { imageAsset } from '@/lib/image-asset'
import type { Person } from '@/types'
import stickerIranides from '@/public/images/about/sticker-iranides.webp'
import stickerMariana from '@/public/images/about/sticker-mariana.webp'

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
    photo: imageAsset(stickerMariana, 'Mariana Gomes segurando um celular'),
  },
  {
    name: 'Iranides Souza',
    role: 'Sócia e gestora empresarial',
    photo: imageAsset(stickerIranides, 'Iranides Souza sorrindo com um celular nas mãos'),
  },
]
