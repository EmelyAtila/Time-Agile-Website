/* eslint-disable @next/next/no-html-link-for-pages -- <a>, não next/link: a home depende dos scripts inline
   do <body> (pre-loader, intro do Hero), que não rodam numa navegação do cliente */
import { ArrowLeft } from 'lucide-react'
import type { LegalBlock, LegalDocument } from '@/types'
import { site } from '@/content/site'
import { Logo } from '@/components/layout/Logo'
import { Footer } from '@/components/layout/Footer'
import { ScrollReveals } from '@/components/providers/ScrollReveals'

const FOCUS =
  'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-wine'
const TEXT_LINK = `font-semibold underline decoration-brand-pink decoration-2 underline-offset-4 transition-colors hover:text-brand-pink ${FOCUS}`
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g

function InlineText({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(LINK_PATTERN)) {
    const [whole, label, href] = match
    parts.push(text.slice(last, match.index))
    const external = href.startsWith('http')
    parts.push(
      <a
        key={match.index}
        href={href}
        className={TEXT_LINK}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {label}
      </a>,
    )
    last = match.index + whole.length
  }
  parts.push(text.slice(last))
  return <>{parts}</>
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === 'string') {
    return (
      <p>
        <InlineText text={block} />
      </p>
    )
  }
  return (
    <ul className="list-disc space-y-2 pl-6 marker:text-brand-pink">
      {block.list.map((item) => (
        <li key={item} className="pl-1">
          <InlineText text={item} />
        </li>
      ))}
    </ul>
  )
}

export function LegalPage({ doc }: { doc: LegalDocument }) {
  const updatedAt = new Date(`${doc.updatedAt}T00:00:00Z`).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5 md:px-12 lg:py-8">
        <a href="/" aria-label={`Página inicial da ${site.name}`} className={`block ${FOCUS}`}>
          <Logo aria-hidden className="h-11 w-auto md:h-14" />
        </a>
        <a
          href="/"
          className={`flex items-center gap-2 font-sans text-[0.9375rem] font-bold transition-colors hover:text-brand-pink md:text-base ${FOCUS}`}
        >
          <ArrowLeft aria-hidden className="size-4" />
          Voltar ao site
        </a>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-6xl px-6 pb-20 pt-6 md:px-12 md:pb-28 md:pt-10 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-x-16 xl:gap-x-24"
      >
        <div className="max-w-[68ch] lg:col-start-2">
          <h1 className="font-sans text-[2.25rem] font-black leading-[1.05] md:text-5xl lg:text-6xl">
            {doc.title}
          </h1>
          {/* As quatro barras da logo */}
          <div aria-hidden className="mt-6 flex h-2 w-24 overflow-hidden rounded-full">
            <span className="flex-1 bg-brand-pink-light" />
            <span className="flex-1 bg-brand-yellow" />
            <span className="flex-1 bg-brand-orange" />
            <span className="flex-1 bg-brand-pink" />
          </div>
          <p className="mt-6 font-sans text-[0.9375rem] font-medium">
            Atualizada em <time dateTime={doc.updatedAt}>{updatedAt}</time>
          </p>
          <p className="mt-6 text-[1.0625rem] leading-[1.75] md:text-lg">
            <InlineText text={doc.intro} />
          </p>
        </div>

        <nav
          aria-labelledby="legal-toc"
          className="mt-10 rounded-lg bg-white/60 p-6 shadow-card lg:sticky lg:top-8 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:max-h-[calc(100vh-4rem)] lg:self-start lg:overflow-y-auto lg:bg-transparent lg:p-0 lg:shadow-none"
          data-lenis-prevent
        >
          <h2 id="legal-toc" className="font-sans text-lg font-bold">
            Nesta página
          </h2>
          <ol className="mt-4 space-y-2 font-sans text-[0.9375rem] leading-snug md:columns-2 md:gap-8 lg:columns-1">
            {doc.sections.map((section, index) => (
              <li key={section.id} className="break-inside-avoid">
                <a
                  href={`#${section.id}`}
                  className={`inline-block py-0.5 transition-colors hover:text-brand-pink ${FOCUS}`}
                >
                  {index + 1}. {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 max-w-[68ch] space-y-12 text-[1.0625rem] leading-[1.75] md:mt-16 md:text-lg lg:col-start-2">
          {doc.sections.map((section, index) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
              <h2
                id={`${section.id}-title`}
                className="font-sans text-[1.375rem] font-bold leading-tight md:text-2xl"
              >
                {index + 1}. {section.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {section.body.map((block, blockIndex) => (
                  <Block key={blockIndex} block={block} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer linkPrefix="/" />
      <ScrollReveals />
    </>
  )
}
