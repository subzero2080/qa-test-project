'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { APP_NAME } from '@/lib/app-config'
import { OAuthButtons } from '@/components/auth/OAuthButtons'

export function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Present only when a billing flow sends the user here after paying
  // (flow "a": pay-first). Harmless/absent for the default free signup.
  const sessionToken = searchParams.get('session')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, sessionToken }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong.')
      setLoading(false)
      return
    }

    // Redirect to verify with email pre-filled
    router.push(`/verify?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="min-h-screen bg-space flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {APP_NAME}
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {sessionToken ? 'Payment successful — now create your login' : 'Create your account'}
          </p>
        </div>

        {sessionToken && (
          <div
            className="mb-5 flex items-center gap-2.5 rounded-xl px-4 py-3"
            style={{
              background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.3)',
            }}
          >
            <CheckCircle2 size={18} style={{ color: 'var(--status-published)', flexShrink: 0 }} />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
              Payment successful. Create your login below to get started.
            </span>
          </div>
        )}

        <div className="glass rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-lg text-sm transition-glass glass border focus:outline-none"
                style={{
                  color: 'var(--text-primary)',
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: 'var(--border-glass)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent-neon)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-glass)')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-3 py-2.5 rounded-lg text-sm transition-glass glass border focus:outline-none"
                style={{
                  color: 'var(--text-primary)',
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: 'var(--border-glass)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent-neon)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-glass)')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg text-sm transition-glass glass border focus:outline-none"
                style={{
                  color: 'var(--text-primary)',
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: 'var(--border-glass)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent-neon)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-glass)')}
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: 'var(--status-failed)' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 rounded-lg text-sm disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <OAuthButtons next="/app/dashboard" />
        </div>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-medium" style={{ color: 'var(--accent-neon)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
