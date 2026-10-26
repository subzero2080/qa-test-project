'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PageHeader } from '@/components/layout/PageHeader'
import { Loader2, ExternalLink, CreditCard, Save, Check } from 'lucide-react'

type Profile = {
  email: string | null
  full_name: string | null
  plan: string | null
  billing_cycle: string | null
  subscription_status: string | null
}

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)',
  color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Profile (name)
  const [name, setName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)

  // Password
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [savingPw, setSavingPw] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase
        .from('profiles')
        .select('email, full_name, plan, billing_cycle, subscription_status')
        .eq('user_id', user.id)
        .single()
      setProfile(data as Profile)
      setName((data as Profile)?.full_name ?? '')
      setLoading(false)
    }
    load()
  }, [])

  async function saveName() {
    setSavingName(true); setError(null)
    const res = await fetch('/api/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: name }),
    })
    setSavingName(false)
    if (res.ok) { setNameSaved(true); setTimeout(() => setNameSaved(false), 2000) }
    else setError('Failed to save name.')
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwMsg(null)
    if (password.length < 8) { setPwMsg({ type: 'error', text: 'Password must be at least 8 characters.' }); return }
    if (password !== confirm) { setPwMsg({ type: 'error', text: 'Passwords do not match.' }); return }
    setSavingPw(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setSavingPw(false)
    if (error) { setPwMsg({ type: 'error', text: error.message }); return }
    setPassword(''); setConfirm('')
    setPwMsg({ type: 'success', text: 'Password updated.' })
  }

  async function openPortal() {
    setPortalLoading(true); setError(null)
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const data = await res.json()
    setPortalLoading(false)
    if (res.ok && data.url) window.location.href = data.url
    else setError(data.error ?? 'Could not open the billing portal.')
  }

  const row = { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' } as const
  const label = { color: 'var(--text-muted)', fontSize: '14px' }
  const value = { color: 'var(--text-primary)', fontSize: '14px' }

  return (
    <>
      <PageHeader title="Settings" subtitle="Your account and billing" />
      <div style={{ padding: '32px', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
            <Loader2 size={22} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-secondary)' }} />
          </div>
        ) : (
          <>
            {/* Profile */}
            <div className="glass rounded-xl p-6">
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Profile</h2>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Name</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
                <button
                  onClick={saveName}
                  disabled={savingName}
                  className="btn-primary"
                  style={{ padding: '9px 14px', borderRadius: 8, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                >
                  {savingName ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : nameSaved ? <Check size={14} /> : <Save size={14} />}
                  {nameSaved ? 'Saved' : 'Save'}
                </button>
              </div>
              <p style={{ margin: '14px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                Email: <span style={{ color: 'var(--text-secondary)' }}>{profile?.email ?? '—'}</span>
              </p>
            </div>

            {/* Password */}
            <div className="glass rounded-xl p-6">
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Change password</h2>
              <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" style={inputStyle} />
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm new password" style={inputStyle} />
                {pwMsg && <p style={{ margin: 0, fontSize: 13, color: pwMsg.type === 'success' ? 'var(--status-published)' : 'var(--status-failed)' }}>{pwMsg.text}</p>}
                <button
                  type="submit"
                  disabled={savingPw || !password}
                  className="btn-primary"
                  style={{ alignSelf: 'flex-start', padding: '9px 16px', borderRadius: 8, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  {savingPw && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                  Update password
                </button>
              </form>
            </div>

            {/* Billing */}
            <div className="glass rounded-xl p-6">
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Billing</h2>
              <div style={row}>
                <span style={label}>Plan</span>
                <span style={{ ...value, textTransform: 'capitalize' }}>
                  {profile?.plan ?? 'Free'}{profile?.billing_cycle ? ` · ${profile.billing_cycle}` : ''}
                </span>
              </div>
              <div style={{ ...row, borderBottom: 'none' }}>
                <span style={label}>Subscription</span>
                <span style={{ ...value, textTransform: 'capitalize' }}>{profile?.subscription_status ?? 'none'}</span>
              </div>
              {error && <p style={{ color: 'var(--status-failed)', fontSize: 13, marginTop: 14 }}>{error}</p>}
              <button
                onClick={openPortal}
                disabled={portalLoading}
                className="btn-primary"
                style={{ marginTop: 18, padding: '10px 18px', borderRadius: 8, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                {portalLoading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CreditCard size={14} />}
                Manage billing <ExternalLink size={13} />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
