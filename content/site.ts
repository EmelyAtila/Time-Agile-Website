// || e não ??: no build do Docker a variável não definida chega como texto vazio
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5561992656020'

export const site = {
  name: 'Time Agile',
  tagline: 'Marketing e Gestão',
  // Em produção precisa ser o domínio real (https): canonical, Open Graph, sitemap e dados estruturados usam
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002',
  // O que aparece no Google: o título corta perto de 60 caracteres e a descrição perto de 155
  seoTitle: 'Agência de Marketing e Gestão em Brasília – DF | Time Agile',
  description:
    'Agência de marketing e gestão em Brasília – DF: redes sociais, branding, identidade visual, fotos e vídeos, tráfego pago e consultoria para empresas.',
  keywords: [
    'agência de marketing em Brasília',
    'agência de marketing digital DF',
    'marketing digital Brasília',
    'gestão de redes sociais Brasília',
    'social media Brasília',
    'branding Brasília',
    'identidade visual Brasília',
    'produção de conteúdo Brasília',
    'tráfego pago Brasília',
    'consultoria de gestão Brasília',
    'Time Agile',
  ],
  // TODO: rua e CEP, se houver escritório que atenda no local (melhora a busca no mapa)
  address: { locality: 'Brasília', region: 'DF', regionName: 'Distrito Federal', country: 'BR' },
  footerDescription:
    'Criamos identidades visuais e soluções de design pensadas para comunicar a essência de cada marca com clareza, personalidade e consistência.',
  contact: {
    email: 'timeagile@gmail.com',
    phoneDisplay: '(61) 9-9265-6020',
    whatsappNumber,
    whatsappUrl: `https://wa.me/${whatsappNumber}`,
    location: 'Brasília – DF',
  },
  social: {
    instagram: 'https://www.instagram.com/timeagile_/',
    // TODO: substituir pelo perfil real
    linkedin: 'https://linkedin.com/',
  },
  // TODO: razão social e CNPJ. Vazios, a Política de Privacidade e os Termos de Uso citam só a marca
  legal: { name: '', cnpj: '' },
} as const
