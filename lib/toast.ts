// Lightweight module-level toast event bus.
// Dispatch: dispatchToast({ message, type, link })
// Listen:   window.addEventListener('app:toast', handler)

export type ToastPayload = {
  id: string
  message: string
  type: 'info' | 'success' | 'error'
  link?: { href: string; label: string }
}

export function dispatchToast(payload: Omit<ToastPayload, 'id'>) {
  if (typeof window === 'undefined') return
  const id = Math.random().toString(36).slice(2)
  window.dispatchEvent(new CustomEvent('app:toast', { detail: { ...payload, id } }))
}
