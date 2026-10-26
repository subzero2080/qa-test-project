import Link from 'next/link'
import { config } from '@/lib/app-config'

export const metadata = { title: `Privacy Policy — ${config.name}` }

export default function PrivacyPage() {
  return (
    <div className="bg-space" style={{ minHeight: '100vh' }}>
      <header className="px-6 py-5 md:px-10">
        <Link href="/" className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {config.name}
        </Link>
      </header>
      <main className="mx-auto px-6 pb-20" style={{ maxWidth: 720, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Privacy Policy</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mt-6">
          This is a placeholder privacy policy for {config.name}. Replace it with your real policy
          before launch — Stripe and Google OAuth verification both require a published privacy policy.
        </p>
        <h2 className="mt-8 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Information we collect</h2>
        <p className="mt-2">Describe the data you collect (account email, usage, payment metadata via Stripe).</p>
        <h2 className="mt-8 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>How we use it</h2>
        <p className="mt-2">Describe how data is used and who it is shared with (Supabase, Stripe, Resend).</p>
        <h2 className="mt-8 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Contact</h2>
        <p className="mt-2">How users can reach you about their data.</p>
      </main>
    </div>
  )
}
