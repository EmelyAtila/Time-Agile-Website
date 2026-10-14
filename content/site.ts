const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5561992656020'

export const site = {
  name: 'Time Agile',
  tagline: 'Marketing e Gestão',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  description:
    'Ajudamos empresas a crescerem com estratégia, posicionamento e consistência empresarial. Marketing, branding e gestão com agilidade.',
  keywords: [
    'Time Agile',
    'marketing',
    'gestão',
    'branding',
    'identidade visual',
    'gestão de redes sociais',
    'tráfego pago',
    'consultoria ágil',
  ],
  footerDescription:
    'Criamos identidades visuais e soluções de design pensadas para comunicar a essência de cada marca com clareza, personalidade e consistência.',
  contact: {
    email: 'timeagile@gmail.com',
    phoneDisplay: '(61) 9-9265-6020',
    whatsappNumber,
    whatsappUrl: `https://wa.me/${whatsappNumber}`,
    location: 'Brasil',
  },
  social: {
    // TODO: substituir pelos perfis reais
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
  },
} as const
