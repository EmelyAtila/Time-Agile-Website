import Image from 'next/image'
import { about, TEAM } from '@/content/about'
import { Container, SectionHeading } from '@/components/ui'

export function About() {
  return (
    <section id="sobre" aria-labelledby="about-title" className="relative bg-brand-yellow">
      <Container className="grid items-center gap-12 py-section lg:grid-cols-2">
        <div>
          <SectionHeading id="about-title">
            {about.title}{' '}
            <em className="font-script not-italic text-brand-pink">{about.highlight}</em>
          </SectionHeading>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <ul className="grid grid-cols-2 items-end gap-4">
          {TEAM.map((person) => (
            <li key={person.name}>
              <figure>
                <Image
                  src={person.photo.src}
                  alt={person.photo.alt}
                  width={person.photo.width}
                  height={person.photo.height}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
                <figcaption>
                  <span className="block font-script">{person.name}</span>
                  <span className="block">{person.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
