import Link from 'next/link'
import { ArrowRight, ShieldCheck, CreditCard, Palette, Sparkles } from 'lucide-react'
import { APP_NAME } from '@/lib/app-config'
import SiteHeader from '@/components/layout/SiteHeader'

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Secure auth built in',
    desc: 'Email + password with 6-digit verification codes, password reset, and optional Google sign-in.',
  },
  {
    icon: CreditCard,
    title: 'Stripe billing',
    desc: 'Checkout, the customer portal, and webhooks are wired up — pick a plan and start charging.',
  },
  {
    icon: Palette,
    title: 'Polished UI',
    desc: 'A clean silver-grey design system with dark and light modes, ready to make your own.',
  },
  {
    icon: Sparkles,
    title: 'Ship faster',
    desc: 'Sensible defaults, a gated workspace, and fail-loud env checks so you focus on your product.',
  },
]

export default function LandingPage() {
  return (
    <div className="bg-space" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="max-w-2xl">
          <h1
            className="font-bold tracking-tight"
            style={{ color: 'var(--text-primary)', fontSize: 'clamp(2.25rem, 6vw, 3.75rem)', lineHeight: 1.05 }}
          >
            A clean, silver-grey starting point.
          </h1>
          <p className="mt-5 text-lg" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {APP_NAME} is a minimal subscription app shell — pick a plan, create your account,
            and get started in minutes.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/pricing"
              className="btn-primary inline-flex items-center gap-2"
              style={{ padding: '12px 22px', borderRadius: '10px', fontSize: '15px' }}
            >
              Sign up <ArrowRight size={16} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2"
              style={{
                padding: '12px 22px', borderRadius: '10px', fontSize: '15px',
                color: 'var(--text-primary)', border: '1px solid var(--border-glass)',
                background: 'var(--container-glass)',
              }}
            >
              Learn more
            </Link>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="px-6 pb-24">
        <div className="mx-auto" style={{ maxWidth: 1040 }}>
          <h2 className="text-center text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Everything you need to launch
          </h2>
          <p className="mt-3 text-center" style={{ color: 'var(--text-secondary)' }}>
            A production-ready foundation so you can focus on your product, not the plumbing.
          </p>

          <div
            className="mt-10 grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass rounded-2xl p-6">
                <div
                  className="inline-flex items-center justify-center rounded-xl"
                  style={{ width: 40, height: 40, background: 'var(--container-glass)', border: '1px solid var(--border-glass)' }}
                >
                  <Icon size={18} style={{ color: 'var(--accent-neon)' }} />
                </div>
                <h3 className="mt-4 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 flex flex-col items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <div className="flex items-center gap-4">
          <Link href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy</Link>
          <Link href="/terms" style={{ color: 'var(--text-muted)' }}>Terms</Link>
        </div>
        <span>© {new Date().getFullYear()} {APP_NAME}</span>
      </footer>
    </div>
  )
}
