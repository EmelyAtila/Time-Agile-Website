'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { contactSchema, type ContactFormData } from '@/lib/validations'
import { sendContactEmail, type ContactActionResult } from '@/app/actions/contact'
import { contactContent } from '@/content/contact'
import { Button } from '@/components/ui'

const { fields } = contactContent

export function ContactForm() {
  const [result, setResult] = useState<ContactActionResult | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (data: ContactFormData) => {
    const response = await sendContactEmail(data)
    setResult(response)
    if (response.success) reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="contact-form-title"
      className="relative rounded-md bg-brand-orange p-10 text-white"
    >
      <h3 id="contact-form-title" className="font-sans font-bold">
        {contactContent.formTitle}
      </h3>

      <div>
        <label htmlFor="contact-name">{fields.name.label}</label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          placeholder={fields.name.placeholder}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          {...register('name')}
        />
        {errors.name && <p id="contact-name-error">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-email">{fields.email.label}</label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          placeholder={fields.email.placeholder}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          {...register('email')}
        />
        {errors.email && <p id="contact-email-error">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-message">{fields.message.label}</label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder={fields.message.placeholder}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          {...register('message')}
        />
        {errors.message && <p id="contact-message-error">{errors.message.message}</p>}
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

      <Button type="submit" variant="outline" size="sm" disabled={isSubmitting}>
        {isSubmitting ? contactContent.submitting : contactContent.submit}
        <Send aria-hidden className="size-4" />
      </Button>

      <p role="status" aria-live="polite">
        {result?.message}
      </p>
    </form>
  )
}
