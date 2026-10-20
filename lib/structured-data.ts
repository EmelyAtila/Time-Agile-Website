import { TEAM } from '@/content/about'
import { SERVICES } from '@/content/services'
import { site } from '@/content/site'

const businessId = `${site.url}/#empresa`

// Os perfis ainda são placeholders (content/site.ts): cada um só entra quando tiver o caminho do perfil
const profiles = Object.values(site.social).filter((url) => new URL(url).pathname.length > 1)

// Empresa local (schema.org) para o Google: o que faz, onde atende e como falar com ela. Sem avaliações
// enquanto os depoimentos não forem reais: avaliação inventada viola as regras do Google
export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': businessId,
      name: site.name,
      description: site.description,
      url: site.url,
      image: `${site.url}/opengraph-image`,
      email: site.contact.email,
      telephone: `+${site.contact.whatsappNumber}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.address.locality,
        addressRegion: site.address.region,
        addressCountry: site.address.country,
      },
      areaServed: [
        { '@type': 'City', name: site.address.locality },
        { '@type': 'AdministrativeArea', name: site.address.regionName },
      ],
      employee: TEAM.map(({ name, role }) => ({ '@type': 'Person', name, jobTitle: role })),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `Serviços de ${site.tagline.toLowerCase()}`,
        itemListElement: SERVICES.map(({ name, description }) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name,
            description: description.replace(/\n/g, ' '),
            provider: { '@id': businessId },
          },
        })),
      },
      ...(profiles.length > 0 && { sameAs: profiles }),
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#site`,
      url: site.url,
      name: site.name,
      inLanguage: 'pt-BR',
      publisher: { '@id': businessId },
    },
  ],
}

// "<" escapado: um texto com "</script>" nos dados não fecha a tag antes da hora
export const structuredDataJson = JSON.stringify(structuredData).replace(/</g, '\\u003c')
