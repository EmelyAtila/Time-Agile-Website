import { z } from 'zod'

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nome deve ter ao menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string().trim().email('Email inválido').max(254, 'Email muito longo'),
  message: z
    .string()
    .trim()
    .min(10, 'Mensagem deve ter ao menos 10 caracteres')
    .max(5000, 'Mensagem deve ter no máximo 5000 caracteres'),
  // Honeypot anti-spam: campo invisível que humanos deixam vazio
  website: z.string().max(0).optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
