'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import type { ContactFormData } from '@/lib/validations'
import { sendContactEmail, type ContactActionResult } from '@/app/actions/contact'
import { contactContent } from '@/content/contact'
import { cn } from '@/lib/utils'
import { PaperPlaneIcon } from '@/components/decor/PaperPlaneIcon'

const { fields } = contactContent

// No desktop as medidas são px de docs/Desktop - 1.svg (--u vem da seção de contato)
const FIELD = 'flex flex-col gap-1.5 lg:gap-[calc(4.5*var(--u))]'
const LABEL =
  'ml-2.5 font-serif text-[1rem] leading-[1.2] lg:ml-[calc(11.6*var(--u))] lg:text-[length:max(0.875rem,calc(20*var(--u)))]'
// O texto digitado é vinho: branco sobre o campo claro ficaria ilegível
const INPUT =
  'w-full rounded-[0.875rem] bg-white/30 px-[1.125rem] font-serif text-[0.9375rem] font-semibold text-brand-wine outline-none transition-shadow placeholder:text-white/70 focus-visible:ring-2 focus-visible:ring-brand-wine aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-brand-wine/70 lg:rounded-[calc(14*var(--u))] lg:px-[calc(22*var(--u))] lg:text-[length:max(0.8125rem,calc(16*var(--u)))]'
const ERROR =
  'ml-2.5 font-serif text-[0.875rem] font-semibold text-brand-wine lg:ml-[calc(11.6*var(--u))]'

// A validação (zod) só é baixada quando o formulário é usado, fora do JS inicial da página.
// Se o download falhar, a próxima tentativa baixa de novo
let validation: Promise<Resolver<ContactFormData>> | undefined
const loadValidation = () =>
  (validation ??= Promise.all([import('@hookform/resolvers/zod'), import('@/lib/validations')])
    .then(([{ zodResolver }, { contactSchema }]) => zodResolver(contactSchema))
    .catch((error: unknown) => {
      validation = undefined
      throw error
    }))

const resolver: Resolver<ContactFormData> = async (values, context, options) =>
  (await loadValidation())(values, context, options)

export function ContactForm() {
  const [result, setResult] = useState<ContactActionResult | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver })

  const onSubmit = async (data: ContactFormData) => {
    const response = await sendContactEmail(data)
    setResult(response)
    if (response.success) reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      // Adianta o download da validação no primeiro foco, para o envio não esperar por ela
      onFocus={() => void loadValidation().catch(() => undefined)}
      noValidate
      aria-labelledby="contact-form-title"
      data-reveal="lift"
      data-reveal-at="0"
      className="relative rounded-[1.25rem] bg-brand-orange px-5 pb-7 pt-8 text-white md:px-8 lg:rounded-[calc(19*var(--u))] lg:pb-[calc(30.6*var(--u))] lg:pl-[calc(48*var(--u))] lg:pr-[calc(60.5*var(--u))] lg:pt-[calc(32.3*var(--u))]"
    >
      <h3
        id="contact-form-title"
        data-reveal="rise"
        className="ml-1 font-sans text-[1.625rem] font-black leading-[1.2] lg:ml-[calc(6.4*var(--u))] lg:text-[length:calc(36*var(--u))]"
      >
        {contactContent.formTitle}
      </h3>

      <div className="mt-4 flex flex-col gap-4 lg:mt-[calc(17.7*var(--u))] lg:gap-[calc(19.5*var(--u))]">
        <div data-reveal="rise" className={FIELD}>
          <label htmlFor="contact-name" className={LABEL}>
            {fields.name.label}
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder={fields.name.placeholder}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={cn(INPUT, 'h-12 lg:h-[calc(47.9*var(--u))]')}
            {...register('name')}
          />
          {errors.name && (
            <p id="contact-name-error" className={ERROR}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div data-reveal="rise" className={FIELD}>
          <label htmlFor="contact-email" className={LABEL}>
            {fields.email.label}
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder={fields.email.placeholder}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={cn(INPUT, 'h-12 lg:h-[calc(47.9*var(--u))]')}
            {...register('email')}
          />
          {errors.email && (
            <p id="contact-email-error" className={ERROR}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div data-reveal="rise" className={FIELD}>
          <label htmlFor="contact-message" className={LABEL}>
            {fields.message.label}
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder={fields.message.placeholder}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={cn(
              INPUT,
              'h-40 resize-none py-3 leading-[1.5] lg:h-[calc(158.7*var(--u))] lg:py-[calc(10*var(--u))]'
            )}
            {...register('message')}
          />
          {errors.message && (
            <p id="contact-message-error" className={ERROR}>
              {errors.message.message}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot anti-spam: invisível para humanos, bots costumam preencher */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
      </div>

      <div data-reveal="rise" className="mt-5 flex flex-col items-center lg:mt-[calc(14*var(--u))]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex h-10 min-w-[10rem] items-center justify-center gap-2.5 rounded-md bg-white/40 px-5 font-serif text-[1rem] font-semibold transition-colors hover:bg-white/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-wine disabled:pointer-events-none disabled:opacity-60 lg:h-[max(1.75rem,calc(30.1*var(--u)))] lg:min-w-[calc(164.5*var(--u))] lg:gap-[calc(16*var(--u))] lg:rounded-[calc(6*var(--u))] lg:text-[length:max(0.875rem,calc(20*var(--u)))]"
        >
          {isSubmitting ? contactContent.submitting : contactContent.submit}
          <PaperPlaneIcon className="size-4 opacity-90 transition-transform duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 lg:size-[calc(17*var(--u))]" />
        </button>

        {/* Fica sempre no DOM para o leitor de tela anunciar; sem mensagem não ocupa espaço */}
        <p
          role="status"
          aria-live="polite"
          className="text-center font-serif text-[0.9375rem] font-semibold text-brand-wine [&:not(:empty)]:mt-3"
        >
          {result?.message}
        </p>
      </div>
    </form>
  )
}
