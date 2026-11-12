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
// PLANS — three monthly subscription tiers. `amount` is in cents and used only
// for display; `priceId` is the Stripe recurring price. Keep the shape.
// ---------------------------------------------------------------------------
export const PLANS = {
  developer: {
    name: 'Developer',
    tagline: 'For solo developers',
    priceId: process.env.STRIPE_PRICE_DEVELOPER_MONTHLY!,
    amount: 1999,
    popular: false,
    features: [
      '1 user, 3 projects',
      'Unlimited local test runs',
      'Browser + API debugging, MCP, Chrome connect',
      'Screenshots & traces · 7-day retention',
    ],
  },
  pro: {
    name: 'Pro',
    tagline: 'For growing products',
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    amount: 4999,
    popular: true,
    features: [
      '1 user, 10 projects',
      'Everything in Developer',
      'Scheduled & regression suites · visual regression',
      'GitHub / deploy triggers',
      '10 cloud browser hours/mo · 90-day retention',
    ],
  },
  team: {
    name: 'Team',
    tagline: 'For teams',
    priceId: process.env.STRIPE_PRICE_TEAM_MONTHLY!,
    amount: 9999,
    popular: false,
    features: [
      '5 users, unlimited projects',
      'Everything in Pro',
      'Shared history, roles & approvals',
      'Team reporting',
      '50 cloud browser hours/mo · 1-year retention',
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS

export function getPlanByPriceId(priceId: string): { plan: PlanKey } | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) return { plan: key as PlanKey }
  }
  return null
}
