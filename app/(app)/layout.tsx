import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { ClientShell } from '@/components/layout/ClientShell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex bg-space" style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar userEmail={user.email ?? ''} />
      <ClientShell>{children}</ClientShell>
    </div>
  )
}
