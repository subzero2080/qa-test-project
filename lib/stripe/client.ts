import Stripe from 'stripe'
import { requireEnv } from '@/lib/env'

// Lazy — don't construct at import time (env isn't available during
// `next build`, and the template ships without a .env).
let _stripe: Stripe | null = null
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
      apiVersion: '2026-08-26.dahlia',
    })
  }
  return _stripe
}

// ---------------------------------------------------------------------------
// PLACEHOLDER PLANS — the SETUP interview replaces these with the real plans
// and their Stripe price IDs. Add/remove plans freely; keep the shape.
// `amount` is in cents and used only for display on the pricing page.
// ---------------------------------------------------------------------------
export const PLANS = {
  pro: {
    name: 'Pro',
    monthly: { priceId: process.env.STRIPE_PRICE_PRO_MONTHLY!, amount: 2900 },
    yearly:  { priceId: process.env.STRIPE_PRICE_PRO_YEARLY!,  amount: 29000 },
  },
} as const

export type PlanKey = keyof typeof PLANS
export type BillingCycle = 'monthly' | 'yearly'

export function getPlanByPriceId(priceId: string): { plan: PlanKey; cycle: BillingCycle } | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.monthly.priceId === priceId) return { plan: key as PlanKey, cycle: 'monthly' }
    if (plan.yearly.priceId === priceId)  return { plan: key as PlanKey, cycle: 'yearly' }
  }
  return null
}
