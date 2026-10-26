export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getStripe, getPlanByPriceId } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

// Links Stripe subscriptions to the single-user `profiles` row. The checkout
// sets `client_reference_id` to the Supabase user id when the buyer is signed
// in; otherwise we fall back to matching the customer email.
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature invalid.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as Stripe.Checkout.Session
      const { plan, cycle } = s.metadata ?? {}
      const userId = s.client_reference_id || s.metadata?.userId || null
      const email = s.customer_details?.email ?? s.customer_email ?? null

      const update = {
        stripe_customer_id: s.customer as string,
        stripe_subscription_id: s.subscription as string,
        plan: plan ?? null,
        billing_cycle: cycle ?? null,
        subscription_status: 'active',
      }

      if (userId) {
        await supabase.from('profiles').update(update).eq('user_id', userId)
      } else if (email) {
        await supabase.from('profiles').update(update).eq('email', email.toLowerCase())
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const priceId = sub.items.data[0]?.price.id
      const planInfo = priceId ? getPlanByPriceId(priceId) : null
      await supabase
        .from('profiles')
        .update({
          subscription_status: sub.status,
          ...(planInfo ? { plan: planInfo.plan, billing_cycle: planInfo.cycle } : {}),
        })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from('profiles')
        .update({ subscription_status: 'canceled' })
        .eq('stripe_subscription_id', sub.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
