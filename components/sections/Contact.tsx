import { Mail, Smartphone } from 'lucide-react'
import { contactContent } from '@/content/contact'
import { site } from '@/content/site'
import { Container, SectionHeading } from '@/components/ui'
import { ContactForm } from '@/components/forms/ContactForm'

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contact-title" className="relative">
      <Container className="py-section">
        <header className="text-center">
          <SectionHeading id="contact-title" className="text-brand-pink">
            {contactContent.title}
          </SectionHeading>
          <p>{contactContent.description}</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <ContactForm />

          <aside aria-labelledby="contact-info-title">
            <h3 id="contact-info-title" className="font-sans font-bold text-brand-red">
              {contactContent.infoTitle}
            </h3>
            <ul className="rounded-md bg-brand-yellow p-6 text-white">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="inline-flex items-center gap-2 underline"
                >
                  <Mail aria-hidden className="size-5" />
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a href={site.contact.whatsappUrl} className="inline-flex items-center gap-2">
                  <Smartphone aria-hidden className="size-5" />
                  {site.contact.phoneDisplay}
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </Container>
    </section>
  )
}
