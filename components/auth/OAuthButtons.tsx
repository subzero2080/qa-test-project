'use client'

import { createClient } from '@/lib/supabase/client'
import { config } from '@/lib/app-config'

// Renders the enabled OAuth / passwordless options (config.auth.*). If none are
// enabled this renders nothing, so it's safe to drop into any auth page.
export function OAuthButtons({ next = '/app/dashboard' }: { next?: string }) {
  const anyEnabled = config.auth.google || config.auth.apple

  async function signInWith(provider: 'google' | 'apple') {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    })
  }

  if (!anyEnabled) return null

  return (
    <div className="mt-4">
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1" style={{ height: 1, background: 'var(--border-glass)' }} />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>
        <div className="flex-1" style={{ height: 1, background: 'var(--border-glass)' }} />
      </div>

      {config.auth.google && (
        <button
          type="button"
          onClick={() => signInWith('google')}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg text-sm font-medium transition-glass glass-hover"
          style={{ border: '1px solid var(--border-glass)', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.04)' }}
        >
          <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 5.1 29.6 3 24 3 16.3 3 9.7 7.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 43c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 34.1 26.7 35 24 35c-5.3 0-9.7-3.6-11.3-8.4l-6.5 5C9.6 38.6 16.2 43 24 43z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.4 36.1 44 30.5 44 23c0-1.3-.1-2.5-.4-3.5z"/>
          </svg>
          Continue with Google
        </button>
      )}
    </div>
  )
}
