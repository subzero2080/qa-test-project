export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getStripe, PLANS, type PlanKey } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

// POST /api/billing/create-checkout  { plan }
// Authenticated upsell (flow "b": signup-then-pay). Returns { url } for the
// client to redirect to. For the signed-out pricing CTA, use GET /checkout.
export async function POST(req: NextRequest) {
  const { plan } = await req.json() as { plan: PlanKey }

  if (!PLANS[plan]) {
    return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin

  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
    success_url: `${appUrl}/app/dashboard?checkout=success`,
    cancel_url: `${appUrl}/app/settings?cancelled=true`,
    metadata: { plan, userId: user.id },
    client_reference_id: user.id,
    customer_email: user.email ?? undefined,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  })

  return NextResponse.json({ url: session.url })
}
