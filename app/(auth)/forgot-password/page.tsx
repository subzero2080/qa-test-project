'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, Loader2, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', background: 'var(--bg-primary)',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Link
          href="/login"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'none',
            marginBottom: '24px',
          }}
        >
          <ArrowLeft size={14} /> Back to login
        </Link>

        <div className="glass" style={{ padding: '32px', borderRadius: '16px' }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <CheckCircle size={40} style={{ color: '#22c55e', margin: '0 auto 16px' }} />
              <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: 'var(--text-primary)' }}>Check your email</h2>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                We sent a password reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>. It expires in 1 hour.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Reset password
                </h2>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Enter your email and we&apos;ll send a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    placeholder="you@example.com"
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {error && (
                  <p style={{ margin: 0, fontSize: '13px', color: '#ef4444' }}>{error}</p>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || !email.trim()}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '11px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer',
                    opacity: loading || !email.trim() ? 0.7 : 1,
                  }}
                >
                  {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
                  Send Reset Link
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
