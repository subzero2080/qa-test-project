export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getStripe, PLANS, type PlanKey, type BillingCycle } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

// GET /checkout?plan=pro&cycle=monthly
// Entry point for the pricing-page CTA. Builds a Stripe subscription checkout.
//  - Signed-in user  → attaches to their account; success returns to the app.
//  - Signed-out user → success sends them to /signup to create their login
//    (the webhook links the subscription to their profile by email).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const plan = searchParams.get('plan') as PlanKey
  const cycle = (searchParams.get('cycle') ?? 'monthly') as BillingCycle
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin

  if (!plan || !PLANS[plan] || !['monthly', 'yearly'].includes(cycle)) {
    return NextResponse.redirect(new URL('/pricing', appUrl))
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: PLANS[plan][cycle].priceId, quantity: 1 }],
    success_url: user ? `${appUrl}/app/dashboard?checkout=success` : `${appUrl}/signup`,
    cancel_url: `${appUrl}/pricing?cancelled=true`,
    metadata: { plan, cycle, userId: user?.id ?? '' },
    client_reference_id: user?.id,
    customer_email: user?.email ?? undefined,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  })

  return NextResponse.redirect(session.url!)
}
