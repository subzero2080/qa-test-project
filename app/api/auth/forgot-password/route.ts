export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPasswordReset } from '@/lib/resend/client'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required.' }, { status: 400 })

  const admin = createAdminClient()

  // Look up user — don't reveal whether account exists (security best practice)
  const { data: users } = await admin.auth.admin.listUsers()
  const user = users?.users?.find((u) => u.email === email.toLowerCase().trim())

  if (user) {
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour

    // Reuse verification_codes table: email = user email, code = reset token
    await admin.from('verification_codes').insert({
      email: email.toLowerCase().trim(),
      code: token,
      expires_at: expiresAt,
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const resetUrl = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(email.toLowerCase().trim())}`

    await sendPasswordReset(email, resetUrl)
  }

  // Always return success to prevent email enumeration
  return NextResponse.json({ success: true })
}
