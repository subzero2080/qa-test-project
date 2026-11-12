import Link from 'next/link'
import { config } from '@/lib/app-config'

export const metadata = { title: `About — ${config.name}` }

export default function AboutPage() {
  return (
    <div className="bg-space" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {config.name}
        </Link>
        <nav className="flex items-center gap-5">
          <Link href="/" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <Link href="/about" className="text-sm" style={{ color: 'var(--text-primary)' }}>About</Link>
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sign in</Link>
          <Link href="/pricing" className="btn-primary text-sm" style={{ padding: '8px 16px', borderRadius: '8px' }}>
            Sign up
          </Link>
        </nav>
      </header>

      <main className="mx-auto px-6 pb-20 pt-6" style={{ maxWidth: 720, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>About {config.name}</h1>
        <p className="mt-6">
          {config.name} is a simple, no-frills subscription product. We keep the interface clean —
          silver, grey, and black — so you can focus on the work instead of the chrome.
        </p>
        <h2 className="mt-8 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>What you get</h2>
        <p className="mt-2">
          A single plan, a fast sign-up, and a gated workspace. Choose a plan on the pricing page,
          complete checkout, create your login, verify your email, and you&apos;re in.
        </p>
        <h2 className="mt-8 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Our approach</h2>
        <p className="mt-2">
          Do one thing well. No clutter, no upsells, no dark patterns — just a straightforward
          account and a tidy dashboard.
        </p>

        <div className="mt-10">
          <Link
            href="/pricing"
            className="btn-primary inline-flex items-center"
            style={{ padding: '11px 22px', borderRadius: '10px', fontSize: '14px' }}
          >
            See pricing
          </Link>
        </div>
      </main>
    </div>
  )
}
