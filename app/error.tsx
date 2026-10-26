'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="bg-space" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass rounded-2xl p-8 text-center" style={{ maxWidth: 420 }}>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Something went wrong</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          An unexpected error occurred. You can try again.
        </p>
        <button
          onClick={reset}
          className="btn-primary mt-6"
          style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
