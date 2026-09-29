import { TAGS } from '@/content/services'
import { cn } from '@/lib/utils'

const tagColors = ['bg-brand-yellow', 'bg-brand-orange', 'bg-brand-pink', 'bg-brand-pink-light']

/** Faixa de tags em loop. A animação (CSS keyframes ou GSAP) fica para a etapa de estilização. */
export function TagMarquee() {
  const renderList = (hidden: boolean) => (
    <ul className="flex shrink-0 gap-8" aria-hidden={hidden || undefined}>
      {TAGS.map((tag, i) => (
        <li
          key={tag}
          className={cn(
            'rounded-full px-8 py-1 font-serif font-bold',
            tagColors[i % tagColors.length]
          )}
        >
          {tag}
        </li>
      ))}
    </ul>
  )

  return (
    <div className="flex gap-8 overflow-hidden py-12">
      {renderList(false)}
      {/* Cópia para o loop contínuo — oculta de leitores de tela */}
      {renderList(true)}
    </div>
  )
}
