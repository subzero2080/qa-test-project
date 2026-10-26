'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/lib/app-config'
import { OAuthButtons } from '@/components/auth/OAuthButtons'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    router.push('/app/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-space flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {APP_NAME}
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Sign in to your account
          </p>
        </div>

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
                className={cn(
                  'w-full px-3 py-2.5 rounded-lg text-sm transition-glass',
                  'glass border focus:outline-none',
                )}
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
              <div className="mt-1.5 text-right">
                <Link
                  href="/forgot-password"
                  className="text-xs transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-neon)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <p className="text-sm" style={{ color: 'var(--status-failed)' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 rounded-lg text-sm disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <OAuthButtons next="/app/dashboard" />
        </div>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium transition-colors" style={{ color: 'var(--accent-neon)' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
