export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { email, code } = await req.json()

  if (!email || !code) {
    return NextResponse.json({ error: 'Email and code required.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: record } = await supabase
    .from('verification_codes')
    .select('*')
    .eq('email', email.toLowerCase())
    .is('used_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!record) {
    return NextResponse.json({ error: 'No active code found. Request a new one.' }, { status: 400 })
  }

  if (new Date(record.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Code expired. Request a new one.' }, { status: 400 })
  }

  if (record.attempts >= 5) {
    return NextResponse.json({ error: 'Too many attempts. Request a new code.' }, { status: 429 })
  }

  if (record.code !== code) {
    await supabase
      .from('verification_codes')
      .update({ attempts: record.attempts + 1 })
      .eq('id', record.id)
    return NextResponse.json({ error: 'Incorrect code.' }, { status: 400 })
  }

  // Mark code used
  await supabase
    .from('verification_codes')
    .update({ used_at: new Date().toISOString() })
    .eq('id', record.id)

  // Confirm the user's email in Supabase Auth
  const { data: users } = await supabase.auth.admin.listUsers()
  const user = users?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

  if (user) {
    await supabase.auth.admin.updateUserById(user.id, { email_confirm: true })

    // Mint a one-time token the client exchanges for a real session, so the
    // user is logged in immediately after verifying (no second login).
    const { data: sessionData } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email.toLowerCase(),
    })

    return NextResponse.json({
      success: true,
      tokenHash: sessionData?.properties?.hashed_token ?? null,
    })
  }

  return NextResponse.json({ error: 'User not found.' }, { status: 404 })
}
