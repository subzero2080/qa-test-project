export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { token, email, newPassword } = await req.json()

  if (!token || !email || !newPassword) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: code } = await admin
    .from('verification_codes')
    .select('id, expires_at, used_at')
    .eq('email', email.toLowerCase().trim())
    .eq('code', token)
    .single()

  if (!code) return NextResponse.json({ error: 'Invalid or expired reset link.' }, { status: 400 })
  if (code.used_at) return NextResponse.json({ error: 'This reset link has already been used.' }, { status: 400 })
  if (new Date(code.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Reset link has expired. Request a new one.' }, { status: 400 })
  }

  // Find user by email
  const { data: users } = await admin.auth.admin.listUsers()
  const user = users?.users?.find((u) => u.email === email.toLowerCase().trim())
  if (!user) return NextResponse.json({ error: 'Account not found.' }, { status: 404 })

  const { error } = await admin.auth.admin.updateUserById(user.id, { password: newPassword })
  if (error) return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 })

  await admin.from('verification_codes').update({ used_at: new Date().toISOString() }).eq('id', code.id)

  return NextResponse.json({ success: true })
}
