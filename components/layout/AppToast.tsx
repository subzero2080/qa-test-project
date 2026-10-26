'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, AlertCircle, Info, X, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { ToastPayload } from '@/lib/toast'

const DURATION = 8000

export function AppToast() {
  const [toasts, setToasts] = useState<ToastPayload[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent<ToastPayload>).detail
      setToasts(prev => [...prev, detail])
      setTimeout(() => remove(detail.id), DURATION)
    }
    window.addEventListener('app:toast', onToast)
    return () => window.removeEventListener('app:toast', onToast)
  }, [remove])

  if (!toasts.length) return null

  return (
    <div style={{
      position: 'fixed', top: '16px', right: '20px', zIndex: 2000,
      display: 'flex', flexDirection: 'column', gap: '8px',
      pointerEvents: 'none',
    }}>
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success'
        const isError   = toast.type === 'error'
        const accent = isSuccess ? '#22c55e' : isError ? '#ef4444' : '#22d3ee'
        const border = isSuccess ? 'rgba(34,197,94,0.25)' : isError ? 'rgba(239,68,68,0.25)' : 'rgba(34,211,238,0.25)'
        const Icon   = isSuccess ? CheckCircle : isError ? AlertCircle : Info

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '12px 14px', borderRadius: '10px', minWidth: '280px', maxWidth: '380px',
              background: 'rgba(15,20,40,0.96)', border: `1px solid ${border}`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${border}`,
              backdropFilter: 'blur(12px)',
              animation: 'toastSlideIn 0.2s ease',
            }}
          >
            <Icon size={16} style={{ color: accent, flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#e2e8f0', lineHeight: 1.4 }}>{toast.message}</p>
              {toast.link && (
                <Link
                  href={toast.link.href}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '12px', fontWeight: 600, color: accent, textDecoration: 'none' }}
                >
                  {toast.link.label} <ExternalLink size={11} />
                </Link>
              )}
            </div>
            <button
              onClick={() => remove(toast.id)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0, flexShrink: 0, lineHeight: 1 }}
            >
              <X size={13} />
            </button>
          </div>
        )
      })}
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
