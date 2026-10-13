import { gsap } from './gsap.config'

/** Pausa (s) entre um pulinho do loop e o seguinte */
const CTA_EVERY = 4.5

/** Tamanho do botão com o mouse em cima (1 = não cresce) */
const CTA_HOVERED = 1.04

/** Quanto o botão afunda enquanto está pressionado (1 = não afunda) */
const CTA_PRESSED = 0.92

/** Inclinação (graus) do tranco que o botão dá quando o mouse entra */
const CTA_KICK = 1.5

/** Cores do confete que salta em volta do botão quando o mouse entra */
const CONFETTI_COLORS = ['pink', 'yellow', 'orange', 'pink-light'] as const

/** Pedaços de confete por entrada: poucos, é uma faísca e não uma festa (0 desliga) */
const CONFETTI_PIECES = 6

/** Intervalo mínimo (s) entre dois estouros: entrar e sair rápido não vira chuva de confete */
const CONFETTI_COOLDOWN = 1.5

/** Ponto do contorno do botão (uma pílula) e a direção para fora dele, para `t` de 0 a 1 */
function onOutline(box: DOMRect, t: number) {
  const radius = box.height / 2
  const straight = box.width - box.height
  const cap = Math.PI * radius
  const left = box.left + radius
  const middle = box.top + radius
  let along = t * (2 * straight + 2 * cap)

  // Lado de cima, tampa direita, lado de baixo e tampa esquerda, nessa ordem
  if (along < straight) return { x: left + along, y: box.top, angle: -Math.PI / 2 }
  along -= straight
  if (along < cap) {
    const angle = -Math.PI / 2 + along / radius
    return {
      x: left + straight + Math.cos(angle) * radius,
      y: middle + Math.sin(angle) * radius,
      angle,
    }
  }
  along -= cap
  if (along < straight) return { x: left + straight - along, y: box.bottom, angle: Math.PI / 2 }
  const angle = Math.PI / 2 + (along - straight) / radius
  return { x: left + Math.cos(angle) * radius, y: middle + Math.sin(angle) * radius, angle }
}

/**
 * Movimento do botão do header:
 * - parado, dá um pulinho de gelatina de tempos em tempos;
 * - quando o mouse entra, dá um tranco e cresce com elástico, as letras pulam em onda a partir
 *   do ponteiro, três cores se espalham em círculo do ponto de entrada (amarelo, rosa e por
 *   fim o laranja), salta um pouco de confete e a seta fica apontando enquanto o mouse está lá;
 * - no clique afunda, volta com elástico e a seta dispara para fora e reentra pelo outro lado.
 * `cta` é o wrapper do botão: o Button tem transition-all e brigaria com o GSAP.
 * Devolve a limpeza. Crie dentro de um contexto do GSAP, que desfaz o loop no revert.
 */
export function animateHeaderCta(cta: HTMLElement) {
  const arrow = cta.querySelector('svg')
  const fill = cta.querySelector<HTMLElement>('[data-cta-fill]')
  if (!arrow || !fill) return

  const letters = Array.from(cta.querySelectorAll<HTMLElement>('[data-cta-letter]'))
  // Do fundo para a frente: as ondas coloridas e, por cima, o laranja que fica
  const layers = [...cta.querySelectorAll<HTMLElement>('[data-cta-ripple]'), fill]
  const confetti = new Set<HTMLElement>()

  const loop = gsap
    .timeline({ repeat: -1, repeatDelay: CTA_EVERY, delay: 1.5 })
    .to(cta, { scaleX: 1.07, scaleY: 0.92, duration: 0.14, ease: 'power2.out' })
    .to(cta, { scaleX: 1, scaleY: 1, duration: 0.9, ease: 'elastic.out(1.1, 0.35)' })
    // A seta dá um bote para a frente junto com o pulinho
    .to(arrow, { x: 7, duration: 0.18, ease: 'power2.out' }, 0.05)
    .to(arrow, { x: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }, 0.23)

  // Uma animação por vez em cada parte: a nova mata a anterior, senão as duas disputam o quadro
  let body: gsap.core.Tween | gsap.core.Timeline | undefined
  let flood: gsap.core.Tween | undefined
  let wave: gsap.core.Timeline | undefined
  let arrowMove: gsap.core.Tween | undefined
  let launch: gsap.core.Timeline | undefined
  let hovered = false
  let pressed = false
  let lastBurst = -Infinity

  /** Volta ao tamanho de descanso, que depende de o mouse estar em cima */
  const settle = () => {
    const size = hovered ? CTA_HOVERED : 1
    body?.kill()
    body = gsap.to(cta, {
      scaleX: size,
      scaleY: size,
      rotation: 0,
      duration: 0.7,
      ease: 'elastic.out(1.2, 0.35)',
      // O pulinho do loop só volta com o botão livre, e depois de um descanso inteiro
      onComplete: () => {
        if (!hovered) loop.delay(CTA_EVERY).restart(true)
      },
    })
  }

  /** Tranco da entrada: achata e inclina para o lado de onde o mouse veio, e assenta maior */
  const kick = (side: number) => {
    body?.kill()
    body = gsap
      .timeline()
      .to(cta, {
        scaleX: 1.06,
        scaleY: 0.95,
        rotation: CTA_KICK * side,
        duration: 0.13,
        ease: 'power2.out',
      })
      .to(cta, {
        scaleX: CTA_HOVERED,
        scaleY: CTA_HOVERED,
        rotation: 0,
        duration: 0.7,
        ease: 'elastic.out(1.1, 0.4)',
      })
  }

  /** Leva a seta ao descanso: fora do hover fica parada; no hover fica apontando */
  const parkArrow = () => {
    // No topo da página o header sobe ao rolar e tira o botão de baixo do mouse logo depois
    // do clique: o disparo da seta não pode ser cortado por isso. Ele termina sozinho.
    if (launch) return
    arrowMove?.kill()
    arrowMove = hovered
      ? gsap.fromTo(
          arrow,
          { x: 3 },
          { x: 7, autoAlpha: 1, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }
        )
      : gsap.to(arrow, { x: 0, autoAlpha: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  /** Círculo de recorte das cores, em px do próprio botão */
  const circle = (radius: number, x: number, y: number) => `circle(${radius}px at ${x}px ${y}px)`

  /** Onde o ponteiro está dentro do botão, e o raio que cobre o botão inteiro a partir dali */
  const locate = (event: PointerEvent) => {
    const box = fill.getBoundingClientRect()
    // O wrapper pode estar ampliado; o recorte usa as medidas sem escala
    const unscale = fill.offsetWidth / box.width
    const x = (event.clientX - box.left) * unscale
    const y = (event.clientY - box.top) * unscale
    const reach = Math.hypot(Math.max(x, fill.offsetWidth - x), Math.max(y, fill.offsetHeight - y))
    return { x, y, reach, side: x < fill.offsetWidth / 2 ? -1 : 1 }
  }

  /** As letras pulam em onda, a partir da que está mais perto do ponteiro */
  const hopLetters = (clientX: number) => {
    if (!letters.length || wave?.isActive()) return

    const distances = letters.map((letter) => {
      const box = letter.getBoundingClientRect()
      return Math.abs(box.left + box.width / 2 - clientX)
    })
    const stagger = { each: 0.02, from: distances.indexOf(Math.min(...distances)) }
    wave = gsap
      .timeline()
      .to(letters, {
        yPercent: -22,
        rotation: (index: number) => (index % 2 ? 4 : -4),
        duration: 0.16,
        ease: 'power2.out',
        stagger,
      })
      .to(
        letters,
        {
          yPercent: 0,
          rotation: 0,
          duration: 0.4,
          ease: 'back.out(2)',
          stagger,
          clearProps: 'transform',
        },
        0.16
      )
  }

  /** Confete nas cores da marca, saindo do contorno do botão para fora */
  const burst = () => {
    const now = gsap.ticker.time
    if (!CONFETTI_PIECES || now - lastBurst < CONFETTI_COOLDOWN) return
    lastBurst = now

    const box = fill.getBoundingClientRect()
    for (let index = 0; index < CONFETTI_PIECES; index++) {
      const start = onOutline(box, (index + gsap.utils.random(0, 0.6)) / CONFETTI_PIECES)
      const angle = start.angle + gsap.utils.random(-0.5, 0.5)
      const distance = gsap.utils.random(14, 30)
      const duration = gsap.utils.random(0.5, 0.7)
      // Metade bolinhas, metade fitinhas
      const [width, height] = index % 2 ? [6, 6] : [4, 10]
      const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length]

      const piece = document.createElement('span')
      piece.setAttribute('aria-hidden', 'true')
      // `fixed` no body: o confete não herda o tranco do botão nem depende do header
      piece.style.cssText = `position:fixed;left:0;top:0;z-index:60;pointer-events:none;width:${width}px;height:${height}px;border-radius:999px;background:var(--color-${color})`
      document.body.append(piece)
      confetti.add(piece)

      gsap
        .timeline({
          onComplete: () => {
            piece.remove()
            confetti.delete(piece)
          },
        })
        .set(piece, {
          x: start.x,
          y: start.y,
          xPercent: -50,
          yPercent: -50,
          scale: 0,
          rotation: gsap.utils.random(0, 360),
        })
        .to(piece, { scale: 1, duration: 0.16, ease: 'back.out(3)' }, 0)
        .to(piece, { x: start.x + Math.cos(angle) * distance, duration, ease: 'power2.out' }, 0)
        .to(piece, { rotation: `+=${gsap.utils.random(-260, 260)}`, duration, ease: 'none' }, 0)
        // Vai com o impulso e depois cai um pouco, como confete de verdade
        .to(
          piece,
          {
            y: start.y + Math.sin(angle) * distance,
            duration: duration * 0.55,
            ease: 'power2.out',
          },
          0
        )
        .to(
          piece,
          { y: `+=${gsap.utils.random(6, 14)}`, duration: duration * 0.45, ease: 'power1.in' },
          duration * 0.55
        )
        .to(piece, { scale: 0, duration: 0.25, ease: 'power1.in' }, duration - 0.25)
    }
  }

  const onPointerEnter = (event: PointerEvent) => {
    // Toque não tem hover
    if (event.pointerType === 'touch') return
    hovered = true
    // O loop volta ao repouso e espera: com o mouse em cima, quem manda no botão é o hover
    loop.pause(0)

    const { x, y, reach, side } = locate(event)
    const spread = {
      clipPath: circle(reach, x, y),
      duration: 0.5,
      ease: 'power2.out',
      // Cada cor sai um pouco depois da anterior: é o que deixa as faixas visíveis à frente do laranja
      stagger: 0.05,
    }
    // Se as cores ainda estavam se recolhendo, continuam de onde estão em vez de recomeçar do zero
    const receding = flood?.isActive()
    flood?.kill()
    flood = receding
      ? gsap.to(layers, spread)
      : gsap.fromTo(layers, { clipPath: circle(0, x, y) }, spread)

    hopLetters(event.clientX)
    burst()
    parkArrow()
    if (!pressed) kick(side)
  }

  const press = () => {
    pressed = true
    loop.pause(0)
    body?.kill()
    body = gsap.to(cta, {
      scaleX: CTA_PRESSED,
      scaleY: CTA_PRESSED,
      rotation: 0,
      duration: 0.12,
      ease: 'power2.out',
    })
  }

  const release = () => {
    if (!pressed) return
    pressed = false
    settle()
  }

  const onPointerLeave = (event: PointerEvent) => {
    if (hovered) {
      hovered = false
      const { x, y } = locate(event)
      flood?.kill()
      // Na volta o laranja sai primeiro e as outras cores vão atrás dele
      flood = gsap.to(layers, {
        clipPath: circle(0, x, y),
        duration: 0.4,
        ease: 'power2.inOut',
        stagger: { each: 0.07, from: 'end' },
      })
      parkArrow()
    }
    // Saiu com o botão apertado: desfaz o afundado; senão só volta ao tamanho normal
    pressed = false
    settle()
  }

  const onPointerDown = (event: PointerEvent) => {
    if (event.button === 0) press()
  }

  const onClick = (event: MouseEvent) => {
    // Clique pelo teclado (Enter) não passa por pointerdown: afunda e solta aqui
    if (event.detail === 0) {
      press()
      body?.progress(1)
      release()
    }

    arrowMove?.kill()
    launch?.kill()
    launch = gsap
      .timeline({
        onComplete: () => {
          launch = undefined
          // O mouse pode ter entrado ou saído enquanto a seta voltava
          parkArrow()
        },
      })
      .to(arrow, { x: 16, autoAlpha: 0, duration: 0.18, ease: 'power2.in' })
      .set(arrow, { x: -12 })
      .to(arrow, { x: 0, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.5)' })
  }

  // Daqui em diante as cores são do GSAP; sem ele vale o fade do CSS (group-hover no Header)
  gsap.set(layers, { opacity: 1, transition: 'none', clipPath: circle(0, 0, 0) })
  // A entrada pode terminar com o mouse já em cima do botão
  if (cta.matches(':hover')) {
    hovered = true
    loop.pause(0)
    gsap.set(layers, { clipPath: circle(Math.hypot(fill.offsetWidth, fill.offsetHeight), 0, 0) })
    parkArrow()
    settle()
  }

  cta.addEventListener('pointerenter', onPointerEnter)
  cta.addEventListener('pointerleave', onPointerLeave)
  cta.addEventListener('pointerdown', onPointerDown)
  cta.addEventListener('pointerup', release)
  cta.addEventListener('pointercancel', release)
  cta.addEventListener('click', onClick)

  return () => {
    cta.removeEventListener('pointerenter', onPointerEnter)
    cta.removeEventListener('pointerleave', onPointerLeave)
    cta.removeEventListener('pointerdown', onPointerDown)
    cta.removeEventListener('pointerup', release)
    cta.removeEventListener('pointercancel', release)
    cta.removeEventListener('click', onClick)
    ;[body, flood, wave, arrowMove, launch].forEach((animation) => animation?.kill())
    confetti.forEach((piece) => {
      gsap.killTweensOf(piece)
      piece.remove()
    })
    gsap.set([cta, arrow, ...letters], { clearProps: 'transform,opacity,visibility' })
    gsap.set(layers, { clearProps: 'opacity,transition,clipPath' })
  }
}
