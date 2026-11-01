# Time Agile — Landing Page

Landing page da **Time Agile · Marketing e Gestão**.
Identidade visual em [`docs/Identidade visual - Time Agile.pdf`](docs/Identidade%20visual%20-%20Time%20Agile.pdf), mockup em [`docs/Desktop - 1.svg`](docs/Desktop%20-%201.svg) e resumo da marca em [`docs/BRAND.md`](docs/BRAND.md).

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3**, com tokens da marca em CSS vars
- **GSAP** (`@gsap/react`) + **Lenis** para animações e rolagem suave
- **react-hook-form** + **zod** + **Resend** para o formulário de contato (Server Action)
- **lucide-react** para os ícones

## Scripts

| Comando              | O que faz                          |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento        |
| `npm run build`      | Build de produção (`standalone`)   |
| `npm run start`      | Sobe o build de produção           |
| `npm run lint`       | ESLint                             |
| `npm run type-check` | Checagem de tipos                  |
| `npm run format`     | Prettier (ordena classes Tailwind) |

Copie `.env.example` para `.env.local` e preencha as variáveis.

## Estrutura

```
app/                 layout, page (compõe as seções), robots, sitemap, opengraph-image (imagem de compartilhamento)
  actions/           server actions (contact.ts)
  privacidade/       Política de Privacidade
  termos/            Termos de Uso
components/
  layout/            Header, Footer, Logo, WhatsAppButton, Preloader (tela vinho da primeira visita da sessão)
  sections/          Hero, About, Services, TagMarquee, Projects, Testimonials, Contact
    hero/            HeroIntro (wrapper client), HeroRibbons, heroPaths (curvas das fitas), useFluidArt
    about/           AboutTeam (adesivos da equipe sobre os blobs)
    services/        ServiceCard, serviceCards (posições, inclinações e movimento de hover de cada card), CardFace (rostos de fundo dos cards, animados no hover), ServiceFan (wrapper client)
    tags/            TagRibbon (fita laranja por trás das tags)
    projects/        ProjectsPortrait (Iranides sobre os blobs), ProjectsArrow (seta na borda da faixa rosa, que se desenha ao entrar na tela e balança no hover), ProjectShowcase + showcaseLayout (faixa rosa com os projetos e as fotos), ProjectsRibbon (fita rosa que se desenha com a rolagem)
    contact/         ContactSmileys (os quatro smileys na borda esquerda), ContactFacesLoop (wrapper client do beijo e da risada)
  forms/             ContactForm
  legal/             LegalPage (layout da Política de Privacidade e dos Termos de Uso)
  ui/                Button, SectionHeading, Marquee (wrapper client das faixas em loop: tags e depoimentos)  (barrel em index.ts)
  decor/             Smiley, Beijinho, Sorrizinho, InstagramIcon, LinkedInIcon, WhatsAppIcon, PaperPlaneIcon, SmartphoneIcon — elementos puramente visuais
  providers/         SmoothScrollProvider (Lenis + GSAP), ScrollReveals (liga as entradas no scroll)
content/             TODO o texto e os dados do site (edite aqui, não nos componentes); legal.ts tem a Política de Privacidade e os Termos de Uso
animations/          gsap.config.ts, reveals + useScrollReveals (entradas no scroll), preloaderBoot (script inline do pre-loader), heroBoot (script inline que começa a entrada do Hero antes do React), useHeroIntro (liga os loops do Hero), heroLoops, headerCta (botão do header), useNavScrollSpy (barra do menu), useHeaderDock (fundo do header), faceMotions (beijo, risada, piscadinha e balanço dos rostos, também no hover), useSmileyLoop (balanço dos smileys), useContactFaces (beijo do Beijinho e risada do Sorrizinho), useServiceCardsHover (hover dos cards de serviço), useMarquee (faixas em loop: tags e depoimentos), useScrollDraw (fita que se desenha com a rolagem), useArrowDraw (seta que se desenha ao entrar na tela e balança no hover)
hooks/               useSmoothScroll, useLateScriptFont (Handelson depois do load)
lib/                 metadata, structured-data (JSON-LD da busca local), validations (zod), escape-html, utils (cn), idle (requestIdleCallback com alternativa)
styles/              tokens.css (fonte da verdade do design), base.css, hero-intro.css (entrada do Hero), preloader.css
types/               tipos compartilhados
public/images/       about/, services/, projects/ e a logo branca do rodapé (logo-footer)
public/fonts/        fontes locais (Satoshi e Handelson One)
docs/                identidade visual e mockup (fora do build Docker)
```

## Estilização

- **Tokens** ficam em `styles/tokens.css` e o `tailwind.config.ts` apenas os mapeia para utilitários:
  - cores: `bg-brand-pink`, `text-brand-wine`, `bg-brand-cream`, etc.;
  - fontes: `font-serif` (Noto Serif, texto), `font-sans` (Satoshi, títulos/UI) e `font-script` (Handelson One, destaques);
  - medidas e efeitos: `h-header`, `rounded-{sm,md,lg}`, `shadow-card`, `shadow-card-hover`, `shadow-cta`.
- Os componentes já têm markup semântico e classes mínimas de layout. A estilização visual é a próxima etapa.
- Classes condicionais precisam ser **strings completas** (ex.: mapa `cardColors` em `Services.tsx`). Não use interpolação do tipo `` `bg-brand-${cor}` ``, porque o Tailwind não detecta essas classes.
- As cores da marca são CSS vars, e o Tailwind 3 não gera o modificador de opacidade para elas: `text-brand-wine/75` sai sem CSS nenhum, sem aviso. Para transparência, use `color-mix`, como no fundo do header e no anel de erro do formulário.
- As entradas no scroll usam `data-reveal="<preset>"` nos elementos e `data-reveal-group` no bloco que dispara. Não precisa de hook no componente: `ScrollReveals` (montado em `app/page.tsx`) cuida de tudo. Presets e regras estão em `docs/SCROLL-ANIMATIONS.md`.
- A entrada do Hero usa `data-intro`, o CSS de `styles/hero-intro.css` e o script inline de `animations/heroBoot.ts`, que começa sem esperar o JS da página. Na primeira visita da sessão, ela espera o pre-loader (`animations/preloaderBoot.ts` + `styles/preloader.css`). Tempos, funcionamento e ideias adiadas estão em `docs/HERO-ANIMATIONS.md`.

### Fonte Handelson One

A Handelson One é comercial e não está no Google Fonts: o arquivo fica em `public/fonts/handelson-one-maisfontes.086c/` (WOFF2 com o subset latin do Google Fonts, gerado do .otf original; um caractere fora do latin cai na fonte reserva) e é carregado com `next/font/local` em `app/layout.tsx`, como a Satoshi. Como só aparece abaixo da dobra, não tem preload e só entra depois do load da página (`hooks/useLateScriptFont.ts`). Até lá vale o fallback que o next/font ajusta às medidas dela, e sem JS ela entra direto.

## SEO e busca local

O site é otimizado para quem procura uma agência de marketing em Brasília – DF.

- **Título, descrição e palavras-chave:** `content/site.ts` (`seoTitle`, `description`, `keywords`). O título corta perto de 60 caracteres no Google e a descrição perto de 155.
- **Metadados:** `lib/metadata.ts`. Gera canonical, Open Graph, Twitter/X, as diretivas do Googlebot (prévia grande de imagem), as metas `geo.*` e a verificação do Search Console.
- **Dados estruturados (JSON-LD):** `lib/structured-data.ts`, renderizado em `app/page.tsx`. Descreve a empresa como `ProfessionalService` do schema.org: endereço em Brasília – DF, área atendida, contato, serviços (o `name` de cada item de `content/services.ts`) e equipe.
  - Os perfis de `site.social` entram em `sameAs` quando deixarem de ser placeholder.
  - Não há avaliações nos dados: avaliação que não seja real viola as regras do Google.
- **Imagem de compartilhamento:** `app/opengraph-image.tsx`, gerada no build (1200×630).
- **Robots e sitemap:** `app/robots.ts` e `app/sitemap.ts`.

Para publicar:

1. Defina `NEXT_PUBLIC_SITE_URL` com o domínio real (https). Sem ele, canonical, sitemap e dados estruturados apontam para localhost.
2. Cadastre o domínio no Google Search Console, coloque o código em `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` e envie o `/sitemap.xml`.
3. Crie o Perfil da Empresa no Google (categoria "Agência de marketing", Brasília – DF), com o mesmo nome, telefone e site. É ele que coloca a empresa no mapa da busca local.
4. Confira os dados no [Teste de pesquisa aprimorada](https://search.google.com/test/rich-results) do Google.

## Pendências de conteúdo

Procure por `TODO` no código:

- Logo oficial em SVG.
- Link real do LinkedIn (também entra nos dados estruturados).
- Rua e CEP em `content/site.ts`, se houver escritório que atenda no local.
- Razão social e CNPJ em `content/site.ts` (`legal`): entram sozinhos na Política de Privacidade e nos Termos de Uso.
- Revisão jurídica dos textos de `content/legal.ts`. Eles descrevem o que o site faz hoje (formulário via Resend para o Gmail, sem cookies nem análise de visitas); se isso mudar, atualize os textos e o `updatedAt`.

## Docker

```bash
docker compose up --build
```

As variáveis `NEXT_PUBLIC_*` do `.env` entram como argumentos do build (`docker-compose.yml`): elas são gravadas no código na hora do build, e sem `NEXT_PUBLIC_SITE_URL` o site sai apontando para localhost. Sem o compose:

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br -t time-agile-site .
```
