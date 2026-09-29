import { site } from '@/content/site'
import { WhatsAppIcon } from '@/components/decor/WhatsAppIcon'

export function WhatsAppButton() {
  return (
    <a
      href={site.contact.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com a Time Agile no WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid size-14 place-items-center rounded-full bg-brand-whatsapp text-white shadow-card"
    >
      <WhatsAppIcon className="size-8" />
    </a>
  )
}
