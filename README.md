# Time Agile — Landing Page

Landing page da **Time Agile · Marketing e Gestão**.
Identidade visual em [`docs/Identidade visual - Time Agile.pdf`](docs/Identidade%20visual%20-%20Time%20Agile.pdf), mockup em [`docs/Desktop - 1.svg`](docs/Desktop%20-%201.svg) e resumo da marca em [`docs/BRAND.md`](docs/BRAND.md).

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3**, com tokens da marca em CSS vars
- **GSAP** (`@gsap/react`) + **Lenis** para animações e rolagem suave
- **Embla Carousel** para os depoimentos
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
app/                 layout, page (compõe as seções), robots, sitemap
  actions/           server actions (contact.ts)
components/
  layout/            Header, Footer, Logo, WhatsAppButton
  sections/          Hero, About, Services, TagMarquee, Projects, Testimonials, Contact
    hero/            HeroIntro (wrapper client), HeroRibbons, heroPaths (curvas das fitas), useFluidArt
    about/           AboutTeam (adesivos da equipe sobre os blobs)
    services/        ServiceCard, serviceCards (posições, inclinações e movimento de hover de cada card), ServiceFan (wrapper client)
    tags/            TagLoop (wrapper client do loop da faixa de tags), TagRibbon (fita laranja por trás das tags)
    projects/        ProjectsPortrait (Iranides sobre os blobs), ProjectsArrow (seta na borda da faixa rosa), ProjectShowcase + showcaseLayout (faixa rosa com os projetos e as fotos), ProjectsRibbon (fita rosa que se desenha com a rolagem)
  forms/             ContactForm
  ui/                Button, Container, SectionHeading, Carousel  (barrel em index.ts)
  decor/             Ribbon (fitas), Smiley, InstagramIcon, WhatsAppIcon — elementos puramente visuais
  providers/         SmoothScrollProvider (Lenis + GSAP)
content/             TODO o texto e os dados do site (edite aqui, não nos componentes)
animations/          gsap.config.ts, useScrollReveal, useHeroIntro, heroLoops, headerCta (botão do header), useNavScrollSpy (barra do menu), useHeaderDock (fundo do header), useSmileyLoop (balanço dos smileys), useServiceCardsHover (hover dos cards de serviço), useTagMarquee (faixa de tags em loop), useScrollDraw (fita que se desenha com a rolagem)
hooks/               useMediaQuery, useScrollPosition, useSmoothScroll
lib/                 metadata, validations (zod), escape-html, utils (cn)
styles/              tokens.css (fonte da verdade do design), base.css
types/               tipos compartilhados
public/images/       about/, services/, projects/, testimonials/
public/fonts/        fontes locais (Handelson One)
docs/                identidade visual e mockup (fora do build Docker)
```

## Estilização

- **Tokens** ficam em `styles/tokens.css` e o `tailwind.config.ts` apenas os mapeia para utilitários:
  - cores: `bg-brand-pink`, `text-brand-wine`, `bg-brand-cream`, etc.;
  - fontes: `font-serif` (Noto Serif, texto), `font-sans` (Satoshi, títulos/UI) e `font-script` (Handelson One, destaques);
  - medidas: `max-w-container`, `px-gutter`, `py-section`, `shadow-cta`, `rounded-{sm,md,lg}`.
- Os componentes já têm markup semântico e classes mínimas de layout. A estilização visual é a próxima etapa.
- Classes condicionais precisam ser **strings completas** (ex.: mapa `cardColors` em `Services.tsx`). Não use interpolação do tipo `` `bg-brand-${cor}` ``, porque o Tailwind não detecta essas classes.
- Para animar, marque os elementos com `data-reveal` e use `const ref = useScrollReveal()` no container.
- A entrada do Hero usa `data-intro` e a timeline de `animations/useHeroIntro.ts`. Tempos, funcionamento e ideias adiadas estão em `docs/HERO-ANIMATIONS.md`.

### Fonte Handelson One

A Handelson One é comercial e não está no Google Fonts. Coloque o arquivo em `public/fonts/HandelsonOne.woff2`; o `@font-face` já está em `styles/base.css`. Sem o arquivo, o site usa o fallback `cursive`.

## Pendências de conteúdo

Procure por `TODO` no código:

- Logo oficial em SVG.
- Links reais de Instagram e LinkedIn.
- Depoimentos reais.
- `og-image.jpg`.
- Páginas `/privacidade` e `/termos`.

## Docker

```bash
docker compose up --build
```
