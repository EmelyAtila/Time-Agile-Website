import { TAGS } from '@/content/services'
import { cn } from '@/lib/utils'
import { TagLoop } from './tags/TagLoop'

// Classes completas (não interpolar) para o Tailwind detectá-las
const tagColors = ['bg-brand-yellow', 'bg-brand-orange', 'bg-brand-pink', 'bg-brand-pink-light']

/**
 * Faixa de tags em loop infinito: anda sozinha, acelera e segue o sentido da rolagem e para
 * com o mouse em cima (animations/useTagMarquee.ts).
 */
export function TagMarquee() {
  const renderList = (hidden: boolean) => (
    // pr igual ao gap: as duas cópias ficam com a mesma largura e o loop não dá salto
    <ul className="flex shrink-0 gap-8 pr-8" aria-hidden={hidden || undefined}>
      {TAGS.map((tag, i) => (
        // Com o mouse em cima a faixa para e a tag sobe inclinando, uma para cada lado
        <li
          key={tag}
          className={cn(
            'whitespace-nowrap rounded-full px-8 py-1 font-serif font-bold transition-transform duration-300 ease-brand [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:-rotate-3 [@media(hover:hover)]:even:hover:rotate-3',
            tagColors[i % tagColors.length]
          )}
        >
          {tag}
        </li>
      ))}
    </ul>
  )

  return (
    <TagLoop className="overflow-hidden py-12">
      <div data-marquee-track className="flex w-max">
        {renderList(false)}
        {/* Cópia para o loop contínuo — oculta de leitores de tela */}
        {renderList(true)}
      </div>
    </TagLoop>
  )
}
