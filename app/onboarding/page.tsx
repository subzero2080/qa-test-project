import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { APP_NAME } from '@/lib/app-config'

export const metadata = { title: `Welcome — ${APP_NAME}` }

export default function OnboardingPage() {
  return (
    <div className="bg-space min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-5 flex items-center justify-center rounded-full"
            style={{ width: 56, height: 56, background: 'var(--accent-soft)' }}
          >
            <CheckCircle2 size={28} style={{ color: 'var(--accent-neon)' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Welcome to {APP_NAME}
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your account is verified and your subscription is active. Let&apos;s get you set up.
          </p>
        </div>

        <div className="glass rounded-xl p-6">
          <ol className="space-y-4">
            {[
              { title: 'Account created', body: 'Your login is ready to go.' },
              { title: 'Email verified', body: 'We confirmed your email address.' },
              { title: 'Subscription active', body: 'Your plan is live — full access unlocked.' },
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{step.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <Link
            href="/app/dashboard"
            className="btn-primary mt-7 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm"
          >
            Go to dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
