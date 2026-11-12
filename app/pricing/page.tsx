import Link from 'next/link'
import { Check } from 'lucide-react'
import { PLANS } from '@/lib/stripe/client'
import { APP_NAME } from '@/lib/app-config'

// Placeholder features per plan — edit during setup.
const FEATURES: string[] = [
  'Everything in the template',
  'Supabase auth + profiles',
  'Stripe billing wired',
  'Email via Resend',
]

function formatPrice(cents: number) {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export default function PricingPage() {
  const plans = Object.entries(PLANS)

  return (
    <div className="bg-space" style={{ minHeight: '100vh' }}>
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-5">
          <Link href="/" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <Link href="/about" className="text-sm" style={{ color: 'var(--text-secondary)' }}>About</Link>
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--text-primary)' }}>Pricing</Link>
          <Link href="/login" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sign in</Link>
        </nav>
      </header>

      <main className="px-6 pt-10 pb-20 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>
          Simple pricing
        </h1>
        <p className="mt-3 text-center" style={{ color: 'var(--text-secondary)' }}>
          Pick a plan to get started. You&apos;ll create your account right after checkout.
        </p>

        <div className="mt-12 grid gap-6" style={{ gridTemplateColumns: `repeat(${Math.min(plans.length, 3)}, minmax(260px, 1fr))` }}>
          {plans.map(([key, plan]) => (
            <div key={key} className="glass rounded-2xl p-7 flex flex-col">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{plan.name}</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {formatPrice(plan.monthly.amount)}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/mo</span>
              </div>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                or {formatPrice(plan.yearly.amount)} billed yearly
              </p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Check size={15} style={{ color: 'var(--accent-neon)', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/checkout?plan=${key}&cycle=monthly`}
                className="btn-primary mt-7 text-center"
                style={{ padding: '11px', borderRadius: '10px', fontSize: '14px' }}
              >
                Choose {plan.name}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--text-primary)' }}>Sign in</Link>
        </p>
      </main>
    </div>
  )
}
