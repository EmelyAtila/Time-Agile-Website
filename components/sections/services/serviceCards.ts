/*
 * Arte dos cards de serviço, medida em docs/Desktop - 1.svg. Tudo em px do mockup.
 * O leque ocupa o trecho de 1480×484 que começa em y 1677; `x` e `y` do card são o canto
 * de cima à esquerda nesse trecho, e é em torno dele que o card gira.
 * O que vai dentro do card (emoji, número, adesivo e textos) é medido a partir desse mesmo
 * canto, com os eixos da página — no mockup cada peça tem a própria inclinação, e os
 * arquivos exportados já vêm inclinados.
 */
import type { CardHover } from '@/animations/useServiceCardsHover'

export const STAGE = { width: 1480, height: 484 }

/** Tipografia dos cards: [tamanho, entrelinha] em px do mockup */
export const CARD_TITLE = { size: 24, leading: 32 }
export const CARD_TEXT = { size: 18, leading: 28 }

type Placed = { x: number; y: number }

type Picture = Placed & { src: string; width: number; height: number }

type TextBlock = Placed & {
  /** Giro em graus em torno do ponto (x, y) */
  angle: number
  /** `right`: (x, y) é o canto de cima à direita e as linhas alinham por ele */
  align: 'left' | 'right'
}

export type ServiceCardArt = Placed & {
  width: number
  height: number
  angle: number
  /** Movimento do card quando o mouse passa (animations/useServiceCardsHover.ts) */
  hover: CardHover
  /** Carinha de fundo, já branca e translúcida no arquivo */
  emoji: Picture
  /** Etiqueta com o número do card */
  badge: Picture
  /** Posição do adesivo; o arquivo e o tamanho vêm de content/services.ts */
  sticker: Placed
  title: TextBlock
  description: TextBlock
}

const IMAGES = '/images/services'

// Na ordem de SERVICES (content/services.ts)
export const SERVICE_CARDS: ServiceCardArt[] = [
  {
    x: 158,
    y: 54.29,
    width: 295.922,
    height: 402.695,
    angle: -7.374,
    hover: 'pop',
    emoji: { src: `${IMAGES}/Beijinho.svg`, x: 0, y: 45.09, width: 342, height: 355 },
    badge: { src: `${IMAGES}/numero-card-1.svg`, x: 237.96, y: -17.32, width: 37, height: 32 },
    sticker: { x: 0, y: -37.98 },
    title: { x: 274.26, y: 48.47, angle: -7.76, align: 'right' },
    description: { x: 51.25, y: 272.6, angle: -8.55, align: 'left' },
  },
  {
    x: 472.008,
    y: 0,
    width: 295.922,
    height: 402.695,
    angle: 4.161,
    hover: 'draw',
    emoji: { src: `${IMAGES}/sorrizinho.svg`, x: -29.22, y: 0, width: 325, height: 340 },
    badge: { src: `${IMAGES}/numero-card-2.svg`, x: 235.4, y: 32.23, width: 37, height: 32 },
    sticker: { x: 10.99, y: 222 },
    title: { x: 28.39, y: 55.14, angle: 5.34, align: 'left' },
    description: { x: 30, y: 101.94, angle: 5.19, align: 'left' },
  },
  {
    x: 728,
    y: 36.7,
    width: 299.099,
    height: 408.721,
    angle: -4.545,
    hover: 'pull',
    emoji: { src: `${IMAGES}/piscadinha.svg`, x: 0, y: 23.3, width: 331, height: 380 },
    badge: { src: `${IMAGES}/numero-card-3.svg`, x: 241, y: -3.7, width: 36, height: 31 },
    sticker: { x: 0, y: 207.93 },
    title: { x: 43.99, y: 52.6, angle: -5.04, align: 'left' },
    description: { x: 283.6, y: 156.09, angle: -4.65, align: 'right' },
  },
  {
    x: 1058.32,
    y: 40.98,
    width: 299.099,
    height: 408.721,
    angle: 7.014,
    hover: 'swing',
    // O smile exportado veio pequeno e rosa: este foi tirado do mockup, como os outros
    emoji: { src: `${IMAGES}/smile-card.svg`, x: -44.32, y: -15.98, width: 292, height: 288 },
    badge: { src: `${IMAGES}/numero-card-4.svg`, x: 233.74, y: 49.09, width: 37, height: 31 },
    sticker: { x: 28.68, y: 235.03 },
    title: { x: 15.53, y: 59.84, angle: 7.6, align: 'left' },
    description: { x: 247.3, y: 210.1, angle: 6.97, align: 'right' },
  },
]
