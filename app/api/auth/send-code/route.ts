export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendVerificationCode } from '@/lib/resend/client'

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email required.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const code = generateCode()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  // Invalidate any existing unused codes for this email
  await supabase
    .from('verification_codes')
    .update({ used_at: new Date().toISOString() })
    .eq('email', email.toLowerCase())
    .is('used_at', null)

  const { error } = await supabase.from('verification_codes').insert({
    email: email.toLowerCase(),
    code,
    expires_at: expiresAt,
  })

  if (error) {
    return NextResponse.json({ error: 'Failed to create code.' }, { status: 500 })
  }

  const emailResult = await sendVerificationCode(email, code)
  if (emailResult.error) {
    console.error('[send-code] Resend error:', emailResult.error)
    return NextResponse.json({ error: `Failed to send verification email: ${emailResult.error.message}` }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
