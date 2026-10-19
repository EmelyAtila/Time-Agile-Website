// No Safari não há requestIdleCallback
export const whenIdle = (callback: (deadline?: IdleDeadline) => void, timeout: number) =>
  typeof requestIdleCallback === 'function'
    ? requestIdleCallback(callback, { timeout })
    : window.setTimeout(callback, 1)

export const cancelIdle = (handle: number) =>
  typeof cancelIdleCallback === 'function' ? cancelIdleCallback(handle) : clearTimeout(handle)
