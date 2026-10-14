import Image from 'next/image'
import { PROJECTS, projectsIntro } from '@/content/projects'
import { Container, SectionHeading } from '@/components/ui'
import { Smiley } from '@/components/decor/Smiley'
import { ProjectsArrow } from './projects/ProjectsArrow'
import { ProjectsPortrait } from './projects/ProjectsPortrait'

export function Projects() {
  return (
    // overflow-x-clip: os blobs, a seta e o smiley passam das bordas da tela
    <section id="projetos" aria-labelledby="projects-title" className="overflow-x-clip">
      <div className="relative mx-auto max-w-[92.5rem] lg:min-h-[min(38.82vw,35.91rem)]">
        <div className="px-6 pt-6 md:px-12 md:pt-10 lg:px-[clamp(3rem,9.86vw,9.125rem)] lg:pt-[min(6.49vw,6rem)]">
          <SectionHeading
            id="projects-title"
            className="max-w-[15.5em] text-[1.75rem] leading-[1.35] tracking-[0.015em] text-brand-orange md:text-[2rem] lg:text-[clamp(1.75rem,2.703vw,2.5rem)]"
          >
            {projectsIntro.title}
          </SectionHeading>

          {/* max-w em `em` para as linhas quebrarem como no mockup em qualquer tamanho de letra */}
          <div className="mt-[1.55em] max-w-[29.8em] text-[1.0625rem] font-semibold leading-[1.54] md:text-[1.125rem] lg:text-[clamp(1.0625rem,1.622vw,1.5rem)]">
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

function ProjectShowcase() {
  return (
    <div className="relative bg-brand-pink">
      <ProjectsArrow className="absolute left-0 top-0 w-[clamp(6.5rem,15.95vw,14.75rem)] -translate-x-[11.86%] -translate-y-[19.85%]" />
      <Smiley
        color="yellow"
        className="absolute right-0 top-0 w-[clamp(6rem,14.65vw,13.55rem)] -translate-y-[15.05%] translate-x-[11.12%] -rotate-[44.4deg]"
      />
      <Container className="grid gap-section py-section">
        {PROJECTS.map((project) => (
          <article key={project.title} className="grid gap-6 md:grid-cols-2">
            <header>
              <h3 className="font-script">{project.title}</h3>
              {project.subtitle && <p className="font-script">{project.subtitle}</p>}
            </header>

            {project.description && <p>{project.description}</p>}

            {project.images.length > 0 && (
              <ul className="flex flex-wrap gap-4">
                {project.images.map((img) => (
                  <li key={img.src} className="bg-white p-6">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      sizes="(min-width: 768px) 25vw, 80vw"
                      className="h-auto w-64"
                    />
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </Container>
    </div>
  )
}
