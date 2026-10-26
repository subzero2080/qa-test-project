// ---------------------------------------------------------------------------
// App config — the single switchboard for a new project. The SETUP interview
// fills this in. Flags here drive what UI renders and how flows behave, so
// enabling a feature is flipping a boolean (+ setting its env), not adding code.
//
// This file is safe to import from both server and client components (plain
// constants only — no secrets, no server-only APIs).
// ---------------------------------------------------------------------------

export type BillingMode = 'signup_first' | 'pay_first' | 'trial_card' | 'none'

export const config = {
  /** Display name — used in metadata, nav brand, auth pages, emails. */
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Acme',
  /** Canonical app URL — used for OG metadata, sitemap, robots. */
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  /** Which sign-in methods are offered. Email/password is always on. */
  auth: {
    emailPassword: true,
    google: false,   // flip on → set the Google provider in Supabase Auth
    magicLink: false,
    apple: false,    // module — not scaffolded by default
  },

  /**
   * How signup relates to payment:
   *  - 'signup_first' (default): free account, upsell to a plan later
   *  - 'pay_first'   : require a completed Stripe checkout before signup
   *  - 'trial_card'  : card required up front, trial then charge
   *  - 'none'        : no billing (remove Stripe during setup)
   */
  billing: {
    mode: 'signup_first' as BillingMode,
  },

  /** Optional feature modules — SETUP offers to scaffold these. */
  features: {
    avatars: false,
    teams: false,
    analytics: false,
  },
} as const

// Back-compat / convenience export.
export const APP_NAME = config.name
