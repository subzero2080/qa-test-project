import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SignupForm } from './SignupForm'

export const dynamic = 'force-dynamic'

export default async function SignupPage() {
  // Already signed in → don't let them create a second account on top of
  // the live session. Send them into the app instead.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/app/dashboard')

  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
