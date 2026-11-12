import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Gated: onboarding lives behind auth (also enforced by proxy.ts). A freshly
// verified user lands here before entering the main app shell.
export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <>{children}</>
}
