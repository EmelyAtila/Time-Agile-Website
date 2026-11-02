// Sem caixa (display: none, como hidden lg:block). Sem checkVisibility (Safari < 17.4), via getClientRects
export const isRendered = (el: Element) =>
  typeof el.checkVisibility === 'function' ? el.checkVisibility() : el.getClientRects().length > 0
