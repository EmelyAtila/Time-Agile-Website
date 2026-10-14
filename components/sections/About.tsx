import { about } from '@/content/about'
import { SectionHeading } from '@/components/ui'
import { Smiley } from '@/components/decor/Smiley'
import { AboutTeam } from './about/AboutTeam'

export function About() {
  return (
    <section id="sobre" aria-labelledby="about-title" className="relative bg-brand-yellow">
      {/* Medidas fluidas como no Hero: no desktop reproduzem o mockup de 1480px e param de
          crescer nele. Abaixo de lg o texto e os adesivos ficam empilhados */}
      <div className="relative mx-auto max-w-[92.5rem] lg:min-h-[min(37.97vw,35.125rem)]">
        <div className="px-[clamp(1.5rem,5.54vw,5.125rem)] pt-14 lg:py-[clamp(2.75rem,4.43vw,4.125rem)]">
          {/* No destaque: font-normal porque a Handelson só tem o peso 400 — herdando o bold do
              título, o navegador engrossa a letra artificialmente; leading-[0] para a letra
              maior não abrir a entrelinha */}
          <SectionHeading
            id="about-title"
            className="max-w-[19em] text-[clamp(1.75rem,4.2vw,2.125rem)] leading-[1.3] tracking-[0.015em] text-white lg:text-[clamp(1.75rem,2.59vw,2.4rem)]"
          >
            {about.title}{' '}
            <em className="relative top-[0.04em] whitespace-nowrap font-script text-[1.67em] font-normal not-italic leading-[0] tracking-normal text-brand-pink">
              {about.highlight}
            </em>
          </SectionHeading>

          <div className="mt-[1.4em] max-w-[36em] text-[clamp(1.0625rem,2.6vw,1.375rem)] leading-[1.54] tracking-[0.01em] lg:max-w-[25.6em] lg:text-[clamp(1.0625rem,1.757vw,1.625rem)]">
            {about.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-[1.65em] text-white first:mt-0 first:text-brand-wine lg:whitespace-pre-line"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* No desktop os adesivos ficam soltos no canto, apoiados na base da seção */}
        <div className="mt-10 px-4 lg:absolute lg:bottom-0 lg:right-[2.97%] lg:mt-0 lg:w-[50.68%] lg:px-0">
          <AboutTeam className="mx-auto max-w-[46.875rem]" />
        </div>
      </div>

      {/* Cortado pela borda esquerda e vazando um pouco para a seção de baixo, como no mockup */}
      <Smiley
        color="pink"
        className="absolute bottom-0 left-0 hidden w-[clamp(6rem,9.32vw,8.625rem)] -translate-x-[23.2%] translate-y-[13.7%] lg:block"
      />
    </section>
  )
}
