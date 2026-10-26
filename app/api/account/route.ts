export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET  /api/account  → the signed-in user's profile
// PATCH /api/account → update editable profile fields (extend as needed)
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id, email, full_name, plan, billing_cycle, subscription_status, created_at')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({ profile })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const body = await req.json()
  // Only allow a safe set of fields to be user-edited. Never let billing
  // fields (plan, stripe_*, subscription_status) be written from the client.
  const allowed: Record<string, unknown> = {}
  if (typeof body.full_name === 'string') allowed.full_name = body.full_name

  const { error } = await supabase.from('profiles').update(allowed).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })

  return NextResponse.json({ success: true })
}
