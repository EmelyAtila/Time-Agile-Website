# Entradas no scroll

Cada seção entra uma vez, quando chega à tela. As entradas animam só `transform`, `opacity` e `clip-path`; a única exceção é o `filter` das polaroides. O conteúdo já vem pronto do servidor, então o SEO e o leitor de tela não mudam. Com `prefers-reduced-motion` ou sem JavaScript, tudo aparece pronto.

- `animations/reveals.ts`: os presets (o que cada entrada faz) e `LEAD` (intervalo até o próximo elemento).
- `animations/useScrollReveals.ts`: acha os grupos, monta uma timeline e um ScrollTrigger por grupo e, no fim, devolve tudo ao CSS.
- `components/providers/ScrollReveals.tsx`: liga o hook. Está montado em `app/page.tsx`.
- `styles/base.css`: esconde `[data-reveal]` até o hook assumir. Tem um failsafe de 4s, caso o JS falhe.

## Como marcar um elemento

| Atributo | Onde | O que faz |
| --- | --- | --- |
| `data-reveal="<preset>"` | no elemento | anima com aquele preset |
| `data-reveal-group` | no bloco que dispara | os `[data-reveal]` de dentro entram juntos, na ordem do DOM, quando o topo do bloco passa de 80% da tela |
| `data-reveal-group="lg"` | idem | grupo só a partir do lg; abaixo dele, cada elemento dispara sozinho (blocos altos no celular) |
| `data-reveal-at="<posição>"` | no elemento | posição do GSAP na timeline do grupo (`"0"`, `"0.55"`, `"<"`, `">-0.35"`); sem ele, entra `LEAD` segundos depois do anterior |
| `data-reveal-from="center"` | com `wipe` | abre do meio em vez da esquerda |

Regras:
- Sem grupo, o elemento dispara sozinho.
- Quem está dentro de outro `[data-reveal]` entra sempre no grupo dele, como o "Crescer!" no título do Sobre e os campos no formulário.
- Grupo sem altura, com filhos todos absolutos (como os projetos no desktop), dispara pela posição do primeiro elemento.
- Perto do fim da página, o gatilho nunca passa do limite da rolagem: o rodapé também entra.
- Recarregar no meio da página deixa prontas as seções que já ficaram para trás.
- Cruzar o lg reconstrói as entradas, mas o que já tocou não toca de novo.

**Não animar elementos que outro hook já move**: `article` dos cards (hover), `<g data-face>` (rostos), o `<g>` do `useSmileyLoop`, paths das fitas e da seta. Em quem já tem `transform` do Tailwind, use um `<g data-pop>` por dentro (Smiley), `clip-path`, ou anime o pai.

## Presets

| Preset | Efeito |
| --- | --- |
| `heading` | palavras sobem de dentro de uma máscara, com um leve giro (SplitText) |
| `text` | palavras fluem de baixo, com fade (SplitText; mantém o `whitespace-pre-line`) |
| `stamp` | carimbo: cai grande e girado, bate e treme (precisa de `inline-block`) |
| `blob` | gelatina a partir do centro |
| `sticker` | adesivo colado: vem de cima, maior e girado, e assenta; alterna o lado |
| `handwrite` | escrita à mão: `clip-path` abrindo da esquerda para a direita |
| `pop` | cresce de 0 girando (em `[data-pop]` se houver) |
| `rise` | sobe com fade |
| `lift` | bloco grande que sobe com quique |
| `slide` | entra pela direita |
| `fade` | só opacidade |
| `wipe` | `clip-path` abrindo na horizontal |
| `card` | cartas dadas: no desktop, cada card sai do meio do leque e voa até o lugar, e o rosto do fundo se mexe ao assentar; abaixo do lg, sobe girando |
| `polaroid` | foto jogada na mesa, que revela de branco e cinza para a cor |
| `bubbles` | as `li` de dentro estouram como bolhas |
| `card-up` | card sobe girando um pouco |

No celular e no tablet, os presets com distância ou giro usam valores menores.

O SplitText divide em palavras, não em linhas, então um resize não quebra a divisão. Ele espera as fontes e faz `revert()` quando o grupo termina.

## Coreografia

| Seção | Entrada |
| --- | --- |
| Sobre | título palavra a palavra, "Crescer!" carimbado; parágrafos fluem; blobs em gelatina; fotos coladas; nomes escritos à mão; smiley com pop |
| Serviços | título e descrição; cartas dadas a partir do meio do leque; cada rosto reage ao assentar |
| Tags | pílulas estouram em sequência enquanto a faixa corre |
| Projetos | título e texto; blobs; Iranides colada; faixa rosa abrindo; títulos escritos à mão; polaroides caindo e revelando |
| Depoimentos | as duas linhas do título entram pela direita; cards sobem; setas aparecem |
| Contato | título e texto; formulário sobe e os campos em sequência; card amarelo colado sobre o canto; smileys, Beijinho e Sorrizinho com pop |
| Rodapé | logo, texto, redes e colunas sobem; a linha da barra abre do meio |
