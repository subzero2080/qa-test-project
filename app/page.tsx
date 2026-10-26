import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { APP_NAME } from '@/lib/app-config'

export default function LandingPage() {
  return (
    <div className="bg-space" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {APP_NAME}
        </span>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Pricing
          </Link>
          <Link href="/login" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary text-sm" style={{ padding: '8px 16px', borderRadius: '8px' }}>
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-2xl">
          <h1
            className="font-bold tracking-tight"
            style={{ color: 'var(--text-primary)', fontSize: 'clamp(2.25rem, 6vw, 3.75rem)', lineHeight: 1.05 }}
          >
            {APP_NAME} starts here.
          </h1>
          <p className="mt-5 text-lg" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            This is a placeholder landing page from the builder template. Replace this copy with your
            product&apos;s story — then ship.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/signup"
              className="btn-primary inline-flex items-center gap-2"
              style={{ padding: '12px 22px', borderRadius: '10px', fontSize: '15px' }}
            >
              Get started <ArrowRight size={16} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2"
              style={{
                padding: '12px 22px', borderRadius: '10px', fontSize: '15px',
                color: 'var(--text-primary)', border: '1px solid var(--border-glass)',
                background: 'var(--container-glass)',
              }}
            >
              View pricing
            </Link>
          </div>
        </div>
      </main>

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
