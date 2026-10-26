import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <PageHeader title="Dashboard" subtitle="This is a placeholder — build your app here." />
      <div style={{ padding: '32px' }}>
        <div className="glass rounded-xl p-6">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Signed in as{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user?.email}</span>.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>
            Replace this page with your product&apos;s home screen.
          </p>
        </div>
      </div>
    </>
  )
}
