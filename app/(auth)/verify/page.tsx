'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function VerifyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => { inputs.current[0]?.focus() }, [])

  function handleDigit(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...digits]
    next[index] = value.slice(-1)
    setDigits(next)
    if (value && index < 5) inputs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...digits]
    pasted.split('').forEach((d, i) => { next[i] = d })
    setDigits(next)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < 6) { setError('Enter the full 6-digit code.'); return }

    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Invalid code. Try again.')
      setLoading(false)
      return
    }

    // Exchange the one-time token for a real session so they land in the
    // app already logged in — no second login.
    if (data.tokenHash) {
      const supabase = createClient()
      const { error: otpErr } = await supabase.auth.verifyOtp({
        type: 'magiclink',
        token_hash: data.tokenHash,
      })
      if (otpErr) {
        router.push('/login')
        return
      }
    }

    router.refresh()
    router.push('/app/dashboard')
  }

  async function handleResend() {
    setResending(true)
    await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setResending(false)
    setResent(true)
    setTimeout(() => setResent(false), 5000)
  }

  return (
    <div className="min-h-screen bg-space flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Check your email
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            We sent a 6-digit code to{' '}
            <span style={{ color: 'var(--text-primary)' }}>{email}</span>
          </p>
        </div>

        <div className="glass rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => { inputs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleDigit(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-11 h-14 text-center text-xl font-bold rounded-lg glass border transition-glass focus:outline-none"
                  style={{
                    color: 'var(--text-primary)',
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: d ? 'var(--accent-neon)' : 'var(--border-glass)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent-neon)')}
                  onBlur={e => (e.target.style.borderColor = d ? 'var(--accent-neon)' : 'var(--border-glass)')}
                />
              ))}
            </div>

            {error && (
              <p className="text-sm text-center" style={{ color: 'var(--status-failed)' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || digits.join('').length < 6}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50"
              style={{ background: 'var(--accent-neon)', color: '#0b0e14' }}
            >
              {loading ? 'Verifying…' : 'Verify Email'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Didn&apos;t receive it?{' '}
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-medium transition-colors"
            style={{ color: resent ? 'var(--status-published)' : 'var(--accent-neon)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {resent ? 'Code sent!' : resending ? 'Sending…' : 'Resend code'}
          </button>
        </p>
        <p className="mt-3 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Wrong email?{' '}
          <a href="/login" className="font-medium" style={{ color: 'var(--text-secondary)' }}>
            Back to login
          </a>
        </p>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  )
}
