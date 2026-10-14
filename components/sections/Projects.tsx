import { projectsIntro } from '@/content/projects'
import { SectionHeading } from '@/components/ui'
import { ProjectShowcase } from './projects/ProjectShowcase'
import { ProjectsPortrait } from './projects/ProjectsPortrait'

export function Projects() {
  return (
    // overflow-x-clip: blobs, faixa, fita, seta e smiley passam das bordas da tela.
    // No desktop tudo é proporcional a --stage-width, na mesma escala de Serviços, menos o texto da
    // introdução: em janelas baixas (palco mais estreito que a tela) ele cresce e vai um pouco para a esquerda
    <section id="projetos" aria-labelledby="projects-title" className="overflow-x-clip">
      <div className="relative mx-auto max-w-[92.5rem] lg:min-h-[calc(var(--stage-width)*0.3882)] lg:w-[var(--stage-width)] lg:max-w-none">
        <div className="px-6 pt-6 md:px-12 md:pt-10 lg:ml-[calc((var(--stage-width)_-_var(--page-width))/3)] lg:pl-[calc(var(--text-stage)*0.0986)] lg:pr-0 lg:pt-[calc(var(--stage-width)*0.0649)] lg:[--text-stage:calc(var(--stage-width)_+_(var(--page-width)_-_var(--stage-width))/4)]">
          <SectionHeading
            id="projects-title"
            className="max-w-[15.5em] text-[1.75rem] font-black leading-[1.35] text-brand-orange md:text-[2rem] lg:text-[length:calc(var(--text-stage)*0.02703)]"
          >
            {projectsIntro.title}
          </SectionHeading>

          {/* max-w em `em` para as linhas quebrarem como no mockup em qualquer tamanho de letra */}
          <div className="mt-[1.55em] max-w-[29.8em] text-[1.0625rem] font-semibold leading-[1.54] md:text-[1.125rem] lg:text-[length:calc(var(--text-stage)*0.01622)]">
            {projectsIntro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center lg:absolute lg:bottom-0 lg:left-[50.27%] lg:mt-0 lg:block lg:w-[52.64%]">
          <ProjectsPortrait className="w-[min(38rem,112%)] shrink-0 lg:w-full" />
        </div>
      </div>

      <ProjectShowcase />
    </section>
  )
}
