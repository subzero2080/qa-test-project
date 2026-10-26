import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="bg-space" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={26} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-secondary)' }} />
    </div>
  )
}
