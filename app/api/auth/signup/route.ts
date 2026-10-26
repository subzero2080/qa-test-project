export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendVerificationCode } from '@/lib/resend/client'

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  // Refuse to create a new account while someone is already signed in.
  const session = await createClient()
  const { data: { user: currentUser } } = await session.auth.getUser()
  if (currentUser) {
    return NextResponse.json(
      { error: 'You are already signed in. Log out before creating a new account.' },
      { status: 409 },
    )
  }

  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required.' }, { status: 400 })
  }

  // ---------------------------------------------------------------------------
  // DEFAULT: free signup. The account is created immediately and billing (if
  // any) is handled separately.
  //
  // FLOW "a" (pay-first) — to require a completed Stripe checkout before an
  // account can be created, uncomment this block and have the billing webhook
  // record the paid `sessionToken` (e.g. in a `pending_checkouts` table). See
  // SETUP.md → "Billing flow".
  //
  //   const { sessionToken } = await req.json()
  //   if (!sessionToken) {
  //     return NextResponse.json({ error: 'A paid plan is required.' }, { status: 403 })
  //   }
  //   const { data: paid } = await admin
  //     .from('pending_checkouts').select('id').eq('session_token', sessionToken).single()
  //   if (!paid) {
  //     return NextResponse.json({ error: 'Please complete checkout first.' }, { status: 403 })
  //   }
  // ---------------------------------------------------------------------------

  const admin = createAdminClient()

  // Create Supabase auth user (email not confirmed — we verify via code).
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: email.toLowerCase(),
    password,
    email_confirm: false,
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 })
  }

  const userId = authData.user.id

  // Create the user's profile row (one user = one profile).
  await admin.from('profiles').insert({ user_id: userId, email: email.toLowerCase() })

  // Send verification code
  const code = generateCode()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  await admin.from('verification_codes').insert({
    email: email.toLowerCase(),
    code,
    expires_at: expiresAt,
  })

  const emailResult = await sendVerificationCode(email, code)
  if (emailResult.error) {
    console.error('[signup] Resend error:', emailResult.error)
    return NextResponse.json({ error: `Failed to send verification email: ${emailResult.error.message}` }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
