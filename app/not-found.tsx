import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-space" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass rounded-2xl p-8 text-center" style={{ maxWidth: 420 }}>
        <p className="text-4xl font-bold" style={{ color: 'var(--accent-neon)' }}>404</p>
        <h1 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Page not found</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          That page doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="btn-primary inline-block mt-6"
          style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}
        >
          Back home
        </Link>
      </div>
    </div>
  )
}
