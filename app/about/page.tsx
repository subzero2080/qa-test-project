import Link from 'next/link'
import { config } from '@/lib/app-config'
import SiteHeader from '@/components/layout/SiteHeader'

export const metadata = { title: `About — ${config.name}` }

export default function AboutPage() {
  return (
    <div className="bg-space" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader />

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
