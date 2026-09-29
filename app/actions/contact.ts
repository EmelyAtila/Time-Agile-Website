'use server'

import { Resend } from 'resend'
import { contactSchema, type ContactFormData } from '@/lib/validations'
import { escapeHtml } from '@/lib/escape-html'

export type ContactActionResult = { success: boolean; message: string }

export async function sendContactEmail(data: ContactFormData): Promise<ContactActionResult> {
  const validation = contactSchema.safeParse(data)
  if (!validation.success) {
    return { success: false, message: 'Dados inválidos. Verifique os campos e tente novamente.' }
  }

  const { name, email, message, website } = validation.data

  // Honeypot preenchido → provavelmente bot. Responde sucesso para não dar pista.
  if (website) {
    return { success: true, message: 'Mensagem enviada com sucesso!' }
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL_TO
  const from = process.env.CONTACT_EMAIL_FROM ?? 'Time Agile <onboarding@resend.dev>'

  if (!apiKey || !to) {
    console.error('[contact] RESEND_API_KEY ou CONTACT_EMAIL_TO não configurados')
    return {
      success: false,
      message: 'O envio está indisponível no momento. Fale com a gente pelo WhatsApp.',
    }
  }

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    message: escapeHtml(message),
  }

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Nova mensagem de ${name} via site`,
      replyTo: email,
      text: `Nome: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #3C0513;">
          <h2 style="color: #FD4274;">Nova mensagem via site</h2>
          <hr />
          <p><strong>Nome:</strong> ${safe.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>
          <p><strong>Mensagem:</strong></p>
          <p style="background: #FBF2E1; padding: 16px; border-radius: 8px; white-space: pre-line;">${safe.message}</p>
        </div>
      `,
    })

    if (error) throw new Error(error.message)

    return { success: true, message: 'Mensagem enviada com sucesso!' }
  } catch (err) {
    console.error('[contact] falha ao enviar e-mail', err)
    return {
      success: false,
      message: 'Erro ao enviar a mensagem. Tente novamente mais tarde.',
    }
  }
}
