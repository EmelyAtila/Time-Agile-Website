import Image from 'next/image'
import { PROJECTS, projectsIntro } from '@/content/projects'
import { Container, SectionHeading } from '@/components/ui'

export function Projects() {
  const { image } = projectsIntro

  return (
    <section id="projetos" aria-labelledby="projects-title">
      <Container className="grid items-center gap-12 py-section lg:grid-cols-2">
        <div>
          <SectionHeading id="projects-title" className="text-brand-orange">
            {projectsIntro.title}
          </SectionHeading>
          {projectsIntro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </Container>

      <ProjectShowcase />
    </section>
  )
}

function ProjectShowcase() {
  return (
    <div className="bg-brand-pink">
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
