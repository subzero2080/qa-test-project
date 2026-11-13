import { config } from '@/lib/app-config'
import SiteHeader from '@/components/layout/SiteHeader'

export const metadata = { title: `Terms of Service — ${config.name}` }

export default function TermsPage() {
  return (
    <div className="bg-space" style={{ minHeight: '100vh' }}>
      <SiteHeader />
      <main className="mx-auto px-6 pb-20" style={{ maxWidth: 720, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Terms of Service</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mt-6">
          This is a placeholder terms of service for {config.name}. Replace it with your real terms
          before launch.
        </p>
        <h2 className="mt-8 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Using the service</h2>
        <p className="mt-2">Describe acceptable use, account responsibilities, and termination.</p>
        <h2 className="mt-8 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Billing</h2>
        <p className="mt-2">Describe subscription terms, renewals, and refunds.</p>
        <h2 className="mt-8 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Contact</h2>
        <p className="mt-2">How users can reach you with questions.</p>
      </main>
    </div>
  )
}
