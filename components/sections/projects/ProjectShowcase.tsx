import type { CSSProperties } from 'react'
import Image from 'next/image'
import { PROJECTS } from '@/content/projects'
import { Smiley } from '@/components/decor/Smiley'
import { cn } from '@/lib/utils'
import { ProjectsArrow } from './ProjectsArrow'
import { ProjectsRibbon } from './ProjectsRibbon'
import { SHOWCASE, STAGE, type Gallery } from './showcaseLayout'

const pct = (part: number, whole: number) => `${+((part / whole) * 100).toFixed(3)}%`

const TEXT =
  'text-[1.0625rem] font-semibold leading-[1.54] md:text-[1.125rem] lg:text-[length:max(1rem,calc(24*var(--u)))]'

export function ProjectShowcase() {
  return (
    <div className="relative">
      {/* --frame: largura das molduras de uma foto abaixo do lg; --u: 1px do mockup */}
      <div
        className="relative isolate mx-auto max-w-[92.5rem] px-6 pb-[calc(300*var(--u))] [--frame:min(16rem,62vw)] [--u:calc(max(100vw,40rem)/1480)] [container-type:inline-size] md:grid md:grid-cols-2 md:items-start md:gap-x-10 md:px-12 md:[--frame:17.5rem] lg:block lg:aspect-[var(--aspect)] lg:w-[var(--stage-width)] lg:max-w-none lg:p-0 lg:[--u:calc(100cqw/1480)]"
        style={{ '--aspect': `${STAGE.width} / ${STAGE.height}` } as CSSProperties}
      >
        <ProjectsRibbon />

        {PROJECTS.map((project, index) => {
          const art = SHOWCASE[index]

          return (
            <article key={project.title} className={art.article}>
              {/* Abaixo do lg a faixa termina no meio da primeira foto, como no mockup */}
              {art.band && (
                <div
                  aria-hidden
                  className="absolute bottom-[calc(var(--frame)*0.5)] left-1/2 top-0 -z-10 w-screen -translate-x-1/2 bg-brand-pink lg:bottom-auto lg:h-[calc(503.45*var(--u))]"
                />
              )}

              <header className={art.header}>
                <h3 className={art.title}>{project.title}</h3>
                {project.subtitle && art.subtitle && (
                  <p className={art.subtitle}>{project.subtitle}</p>
                )}
              </header>

              {project.description && (
                <>
                  <p className={cn(TEXT, art.description)}>{project.description}</p>
                  {art.afterBand && (
                    <p
                      aria-hidden
                      className={cn(TEXT, 'hidden select-none lg:absolute lg:block', art.afterBand)}
                    >
                      {project.description}
                    </p>
                  )}
                </>
              )}

              {art.gallery && project.images.length > 0 && (
                <ProjectGallery gallery={art.gallery} images={project.images} />
              )}
            </article>
          )
        })}
      </div>

      <ProjectsArrow className="absolute left-0 top-0 w-[clamp(6.5rem,15.95vw,14.75rem)] -translate-x-[11.86%] -translate-y-[19.85%] lg:w-[calc(var(--stage-width)*0.1595)]" />
      <Smiley
        color="yellow"
        className="absolute right-0 top-0 w-[clamp(6rem,14.65vw,13.55rem)] -translate-y-[15.05%] translate-x-[11.12%] -rotate-[44.4deg] lg:w-[calc(var(--stage-width)*0.1465)]"
      />
    </div>
  )
}

type ProjectGalleryProps = {
  gallery: Gallery
  images: (typeof PROJECTS)[number]['images']
}

function ProjectGallery({ gallery, images }: ProjectGalleryProps) {
  return (
    <ul
      className={cn(
        'relative lg:absolute lg:left-[calc(var(--x)*var(--u))] lg:top-[calc(var(--y)*var(--u))] lg:w-[calc(var(--w)*var(--u))]',
        gallery.className
      )}
      style={
        {
          aspectRatio: `${gallery.width} / ${gallery.height}`,
          '--x': gallery.x,
          '--y': gallery.y,
          '--w': gallery.width,
        } as CSSProperties
      }
    >
      {images.map((image, index) => {
        const frame = gallery.frames[index]
        if (!frame) return null
        const { photo } = frame
        const below = Math.round((gallery.widthBelowLg * photo.width) / gallery.width)

        return (
          <li
            key={image.src}
            className="absolute z-[var(--z)] bg-white transition-transform duration-500 ease-brand motion-reduce:transition-none [@media(hover:hover)]:hover:z-10 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:-rotate-2 [@media(hover:hover)]:even:hover:rotate-2"
            style={
              {
                left: pct(frame.x, gallery.width),
                top: pct(frame.y, gallery.height),
                width: pct(frame.width, gallery.width),
                aspectRatio: `${frame.width} / ${frame.height}`,
                '--z': frame.z,
              } as CSSProperties
            }
          >
            <div
              className="absolute"
              style={{
                left: pct(photo.x, frame.width),
                top: pct(photo.y, frame.height),
                width: pct(photo.width, frame.width),
                height: pct(photo.height, frame.height),
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={`(min-width: 1480px) ${photo.width}px, (min-width: 1024px) ${+(photo.width / 14.8).toFixed(2)}vw, ${below}px`}
                className="object-cover"
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
