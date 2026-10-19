import Image from 'next/image'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import type { BrandColor, Service } from '@/types'
import { CardFace } from './CardFace'
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

// Por dentro, uma camada desfaz o giro do card para as peças usarem os eixos da página
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
      data-reveal="card"
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
          <CardFace name={art.emoji.name} className="absolute h-auto" style={picture(art.emoji)} />
          <Image
            data-card-sticker
            src={service.image.src}
            alt={service.image.alt}
            width={service.image.width}
            height={service.image.height}
            // A largura do mockup é o máximo: abaixo do lg o card não passa de 18,5rem, a largura dele no mockup
            sizes={`(min-width: 1480px) ${service.image.width}px, (min-width: 1024px) ${+(service.image.width / 14.8).toFixed(2)}vw, ${service.image.width}px`}
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
