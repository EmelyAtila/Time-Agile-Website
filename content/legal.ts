import type { LegalDocument } from '@/types'
import { site } from './site'

// Modelo baseado no que o site faz hoje (formulário via Resend para o Gmail, sem cookies nem análise de visitas).
// Ao mudar isso, atualizar os textos e o updatedAt. Recomenda-se revisão jurídica antes de publicar
const { name, cnpj }: { name: string; cnpj: string } = site.legal
const registration = [name, cnpj && `CNPJ ${cnpj}`].filter(Boolean).join(', ')
const company = registration ? `${site.name} (${registration})` : site.name
const email = `[${site.contact.email}](mailto:${site.contact.email})`

export const privacyPolicy: LegalDocument = {
  path: '/privacidade',
  title: 'Política de Privacidade',
  description:
    'Como a Time Agile trata os dados pessoais enviados pelo site: o que recebemos, para que usamos, com quem compartilhamos e como exercer seus direitos pela LGPD.',
  updatedAt: '2026-11-01',
  intro:
    'Esta política explica quais dados pessoais a Time Agile recebe por este site, para que eles servem, com quem são compartilhados e como você pode exercer os seus direitos, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, a LGPD). Veja também os [Termos de Uso](/termos).',
  sections: [
    {
      id: 'responsavel',
      heading: 'Quem é o responsável pelos seus dados',
      body: [
        `A ${company}, com sede em Brasília – DF, é a controladora dos dados pessoais tratados por meio deste site, ou seja, é quem decide como eles são usados.`,
      ],
    },
    {
      id: 'dados-coletados',
      heading: 'Quais dados recebemos',
      body: [
        'Recebemos apenas os dados que você decide nos enviar e os registros técnicos que todo acesso a um site gera:',
        {
          list: [
            'Formulário de contato: nome, e-mail e a mensagem que você escrever.',
            'E-mail e WhatsApp: os dados que você nos mandar ao falar com a gente por esses canais, como nome, telefone e o conteúdo da conversa.',
            'Registros de acesso: endereço IP, data e hora de cada acesso ao site, guardados pelo serviço de hospedagem.',
          ],
        },
        'Não pedimos dados sensíveis, como informações de saúde, religião ou origem racial. Pedimos que você não os inclua na mensagem.',
      ],
    },
    {
      id: 'finalidades',
      heading: 'Para que usamos os seus dados',
      body: [
        {
          list: [
            'Responder ao seu contato, entender o seu projeto e preparar uma proposta. A base legal é a realização de procedimentos preliminares a um contrato, a seu pedido (art. 7º, V, da LGPD).',
            'Guardar os registros de acesso pelo prazo que a lei determina. A base legal é o cumprimento de obrigação legal (art. 7º, II, da LGPD, e art. 15 do Marco Civil da Internet).',
          ],
        },
        'Não usamos os seus dados para enviar publicidade que você não pediu nem para criar perfis de comportamento.',
      ],
    },
    {
      id: 'compartilhamento',
      heading: 'Com quem compartilhamos',
      body: [
        'Não vendemos nem alugamos dados pessoais. Eles passam apenas pelos serviços necessários para o site funcionar:',
        {
          list: [
            'Resend: entrega a mensagem do formulário na nossa caixa de e-mail.',
            'Google (Gmail): é onde as mensagens ficam guardadas.',
            'Empresa de hospedagem: mantém o site no ar e guarda os registros de acesso.',
          ],
        },
        'Alguns desses serviços guardam dados fora do Brasil, principalmente nos Estados Unidos. Essa transferência internacional segue o art. 33 da LGPD, com fornecedores que adotam garantias de proteção de dados.',
        'Também podemos fornecer dados quando uma autoridade pública ou uma ordem judicial exigir.',
        'Ao clicar nos links de WhatsApp, Instagram ou LinkedIn, você sai deste site e passa a usar o serviço de outra empresa, que tem a sua própria política de privacidade.',
      ],
    },
    {
      id: 'cookies',
      heading: 'Cookies e armazenamento no navegador',
      body: [
        'Este site não usa cookies, ferramentas de análise de visitas, anúncios nem qualquer tipo de rastreamento.',
        'Ele guarda apenas duas informações no armazenamento da sessão do seu navegador (sessionStorage): se a animação de abertura já foi exibida e em que ponto da página você estava, para voltar ao mesmo lugar se você recarregar. Nada disso é enviado para nós, e tudo é apagado quando você fecha a aba.',
        'Se passarmos a usar cookies ou ferramentas de análise, esta política será atualizada e, quando a lei exigir, pediremos o seu consentimento antes.',
      ],
    },
    {
      id: 'retencao',
      heading: 'Por quanto tempo guardamos',
      body: [
        {
          list: [
            'Mensagens do formulário e conversas por e-mail ou WhatsApp: até 12 meses depois do último contato. Se a conversa virar um contrato, os dados passam a seguir o prazo do contrato e das obrigações legais ligadas a ele.',
            'Registros de acesso: 6 meses, como determina o art. 15 do Marco Civil da Internet (Lei nº 12.965/2014).',
          ],
        },
        'Depois desses prazos, os dados são apagados, a menos que a lei exija guardá-los por mais tempo.',
      ],
    },
    {
      id: 'seguranca',
      heading: 'Como protegemos os seus dados',
      body: [
        'O site usa conexão criptografada (HTTPS), e o acesso às mensagens fica restrito à equipe da Time Agile.',
        'Nenhum sistema é totalmente imune a falhas. Se acontecer um incidente de segurança que possa trazer risco ou dano relevante a você, vamos avisar você e a Autoridade Nacional de Proteção de Dados (ANPD), como a LGPD determina.',
      ],
    },
    {
      id: 'direitos',
      heading: 'Seus direitos',
      body: [
        'A LGPD (art. 18) garante a você, a qualquer momento, o direito de:',
        {
          list: [
            'confirmar se tratamos os seus dados e ter acesso a eles;',
            'corrigir dados incompletos, inexatos ou desatualizados;',
            'pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários, excessivos ou tratados em desacordo com a lei;',
            'pedir a portabilidade dos seus dados a outro fornecedor;',
            'saber com quem compartilhamos os seus dados;',
            'pedir a eliminação dos seus dados, nos limites da lei;',
            'revogar o seu consentimento, quando ele for a base do tratamento.',
          ],
        },
        `Para exercer qualquer um deles, escreva para ${email}. Podemos pedir uma confirmação de identidade para proteger você. Respondemos em até 15 dias.`,
        'Se achar que os seus dados não foram bem tratados, você também pode reclamar à [ANPD](https://www.gov.br/anpd).',
      ],
    },
    {
      id: 'menores',
      heading: 'Crianças e adolescentes',
      body: [
        'O site é voltado a empresas e profissionais. Não coletamos de propósito dados de menores de 18 anos e, se isso acontecer, apagamos assim que soubermos.',
      ],
    },
    {
      id: 'canal-de-privacidade',
      heading: 'Canal de privacidade',
      body: [
        `Por ser um agente de tratamento de pequeno porte, a Time Agile não é obrigada a indicar um encarregado de dados (Resolução CD/ANPD nº 2/2022). O canal para qualquer assunto de privacidade é o e-mail ${email}.`,
      ],
    },
    {
      id: 'alteracoes',
      heading: 'Mudanças nesta política',
      body: [
        'Podemos atualizar esta política quando o site ou a lei mudarem. A data da última atualização fica no topo da página.',
      ],
    },
  ],
}

export const termsOfUse: LegalDocument = {
  path: '/termos',
  title: 'Termos de Uso',
  description:
    'Regras para usar o site da Time Agile, agência de marketing e gestão em Brasília – DF: uso permitido, propriedade intelectual, responsabilidades e foro.',
  updatedAt: '2026-11-01',
  intro: `Estes termos explicam as regras para usar o site da ${site.name} – ${site.tagline}.`,
  sections: [
    {
      id: 'aceitacao',
      heading: 'Aceitação',
      body: [
        'Ao acessar e navegar por este site, você concorda com estes Termos de Uso e com a [Política de Privacidade](/privacidade). Se não concordar com algum ponto, pedimos que não use o site.',
      ],
    },
    {
      id: 'sobre-o-site',
      heading: 'O que é este site',
      body: [
        `Este é o site institucional da ${company}, agência de marketing e gestão com sede em Brasília – DF. Ele apresenta a empresa, os serviços e trabalhos já realizados, e oferece canais para você falar com a gente.`,
        'Não há cadastro, venda nem pagamento pelo site. A contratação de qualquer serviço acontece por proposta comercial e contrato próprios, que trazem as condições de cada projeto.',
      ],
    },
    {
      id: 'uso',
      heading: 'Uso do site',
      body: [
        'Você pode navegar, ler e compartilhar os links do site à vontade. Não é permitido:',
        {
          list: [
            'enviar pelo formulário mensagens falsas, ofensivas, ilícitas ou propaganda não solicitada (spam);',
            'tentar acessar áreas restritas, interferir no funcionamento do site ou explorar falhas de segurança;',
            'copiar o conteúdo de forma automatizada para reproduzi-lo em outro lugar;',
            'usar o site de qualquer forma que viole a lei ou direitos de terceiros.',
          ],
        },
        'Mensagens que desrespeitem essas regras podem ser descartadas sem resposta.',
      ],
    },
    {
      id: 'propriedade-intelectual',
      heading: 'Propriedade intelectual',
      body: [
        'A marca Time Agile, a logo, as ilustrações, os textos e o design do site pertencem à Time Agile e são protegidos pela Lei de Direitos Autorais (Lei nº 9.610/1998) e pela Lei da Propriedade Industrial (Lei nº 9.279/1996). Não é permitido copiá-los ou usá-los sem autorização por escrito.',
        'Os trabalhos exibidos no portfólio e os depoimentos pertencem aos respectivos clientes e aparecem aqui como apresentação do nosso trabalho.',
        `Se você é titular de algum conteúdo publicado aqui e quer que ele seja retirado, escreva para ${email}.`,
      ],
    },
    {
      id: 'informacoes',
      heading: 'Informações do site',
      body: [
        'Os textos sobre serviços e resultados descrevem o nosso trabalho de forma geral. Prazos, valores, entregas e responsabilidades de cada projeto são definidos na proposta comercial e no contrato.',
        'Fazemos o possível para manter tudo correto e atualizado, mas o conteúdo pode mudar sem aviso.',
      ],
    },
    {
      id: 'links-externos',
      heading: 'Links para outros sites',
      body: [
        'O site tem links para WhatsApp, Instagram e LinkedIn, entre outros. Esses serviços são de outras empresas, têm termos e políticas próprios, e não temos controle sobre o conteúdo deles.',
      ],
    },
    {
      id: 'responsabilidade',
      heading: 'Limites de responsabilidade',
      body: [
        'Buscamos manter o site sempre no ar e funcionando, mas ele pode ficar indisponível por manutenção, falhas técnicas ou motivos fora do nosso controle. Dentro do que a lei permite, a Time Agile não responde por prejuízos causados por essa indisponibilidade, por decisões tomadas apenas com base no conteúdo do site ou pelo uso de sites de terceiros.',
        'Nada nestes termos limita os direitos que o Código de Defesa do Consumidor garante a você.',
      ],
    },
    {
      id: 'privacidade',
      heading: 'Privacidade',
      body: [
        'O tratamento dos dados que você nos envia está explicado na [Política de Privacidade](/privacidade).',
      ],
    },
    {
      id: 'alteracoes',
      heading: 'Mudanças nestes termos',
      body: [
        'Podemos atualizar estes termos a qualquer momento. A versão em vigor é sempre a publicada nesta página, com a data da última atualização no topo.',
      ],
    },
    {
      id: 'lei-e-foro',
      heading: 'Lei aplicável e foro',
      body: [
        'Estes termos seguem as leis brasileiras. Fica eleito o foro de Brasília – DF para resolver qualquer questão sobre eles, ressalvado o direito do consumidor de propor a ação no foro do seu domicílio (art. 101, I, do Código de Defesa do Consumidor).',
      ],
    },
    {
      id: 'contato',
      heading: 'Contato',
      body: [
        `Dúvidas sobre estes termos? Fale com a gente pelo e-mail ${email} ou pelo [WhatsApp](${site.contact.whatsappUrl}).`,
      ],
    },
  ],
}
