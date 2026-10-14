import Image from 'next/image'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import type { BrandColor, Service } from '@/types'
import { CARD_TEXT, CARD_TITLE, type ServiceCardArt } from './serviceCards'

// Classes completas (não interpolar) para o Tailwind conseguir detectá-las
const cardColors: Record<BrandColor, string> = {
  'pink-light': 'bg-brand-pink-light',
  yellow: 'bg-brand-yellow',
  orange: 'bg-brand-orange',
  pink: 'bg-brand-pink',
}

type ServiceCardProps = {
  service: Service
  art: ServiceCardArt
  className?: string
  style?: CSSProperties
}

/**
 * Card de serviço. É uma peça só: tudo dentro dele é posicionado em % do card e a letra em
 * `cqw`, então a composição do mockup se mantém em qualquer largura.
 * O card gira por fora (quem posiciona é o pai, em Services.tsx) e recorta o que passa da
 * borda; por dentro, uma camada desfaz o giro para as peças usarem as medidas da página.
 * No hover, o `<article>` e o adesivo fazem o movimento de `art.hover` (ServiceFan.tsx).
 */
export function ServiceCard({ service, art, className, style }: ServiceCardProps) {
  const left = (x: number) => `${(x / art.width) * 100}%`
  const top = (y: number) => `${(y / art.height) * 100}%`
  const size = (px: number) => `${(px / art.width) * 100}cqw`

  const picture = ({ x, y, width }: { x: number; y: number; width: number }) => ({
    left: left(x),
    top: top(y),
    width: left(width),
  })

  const text = (
    block: ServiceCardArt['title'],
    font: { size: number; leading: number }
  ): CSSProperties => {
    // O bloco gira em torno do canto por onde as linhas alinham
    const anchor: CSSProperties =
      block.align === 'right'
        ? { right: left(art.width - block.x), textAlign: 'right', transformOrigin: 'top right' }
        : { left: left(block.x), transformOrigin: 'top left' }

    return {
      top: top(block.y),
      ...anchor,
      transform: `rotate(${block.angle}deg)`,
      fontSize: size(font.size),
      lineHeight: font.leading / font.size,
    }
  }

  return (
    <li
      data-card-hover={art.hover}
      className={cn('group [container-type:inline-size]', className)}
      style={{ aspectRatio: `${art.width} / ${art.height}`, ...style }}
    >
      <article
        className={cn(
          'relative size-full overflow-hidden rounded-[8.1cqw] transition-shadow duration-500 [@media(hover:hover)]:group-hover:shadow-card-hover',
          cardColors[service.color]
        )}
      >
        <div
          className="absolute inset-0 origin-top-left"
          style={{ transform: `rotate(${-art.angle}deg)` }}
        >
          <Image
            src={art.emoji.src}
            alt=""
            width={art.emoji.width}
            height={art.emoji.height}
            className="absolute h-auto max-w-none"
            style={picture(art.emoji)}
          />
          <Image
            data-card-sticker
            src={service.image.src}
            alt={service.image.alt}
            width={service.image.width}
            height={service.image.height}
            sizes="(min-width: 1480px) 270px, (min-width: 1024px) 19vw, 70vw"
            className="absolute h-auto max-w-none"
            style={picture({ ...art.sticker, width: service.image.width })}
          />
          <Image
            src={art.badge.src}
            alt=""
            width={art.badge.width}
            height={art.badge.height}
            className="absolute h-auto max-w-none"
            style={picture(art.badge)}
          />

          {/* whitespace-pre: as quebras de linha são as do mockup (\n no conteúdo) */}
          <h3
            className="absolute whitespace-pre font-sans font-bold text-white"
            style={text(art.title, CARD_TITLE)}
          >
            {service.title}
          </h3>
          <p
            className="absolute whitespace-pre font-extrabold tracking-[0.005em] text-black"
            style={text(art.description, CARD_TEXT)}
          >
            {service.description}
          </p>
        </div>
      </article>
    </li>
  )
}
