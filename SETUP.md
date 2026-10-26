# Project Setup Interview

Claude: ask these **one at a time**, wait for each answer, then apply it using
the "How to apply" notes. Don't dump all questions at once.

Most answers land in **`lib/app-config.ts`** (the `config` switchboard) + env.
Start there.

---

### 1. What is this project about?
One-liner + who it's for.
**Apply:** landing hero (`app/page.tsx`), metadata, tone of placeholder copy.

### 2. What is the sign-up / billing flow?
Set `config.billing.mode`:
- **`signup_first`** (default) — free account, upgrade later. Works out of the box.
- **`pay_first`** — require a completed Stripe checkout before signup. Enable the
  commented "FLOW a" gate in `app/api/auth/signup/route.ts` and add a
  `pending_checkouts` table (migration) the webhook writes the paid token into;
  point the pricing CTA's `success_url` at `/signup?session=<token>`.
- **`trial_card`** — add `subscription_data: { trial_period_days: N }` in
  `app/checkout/route.ts` + `create-checkout`.
- **`none`** — delete `app/checkout`, `app/api/billing/*`, `lib/stripe`,
  `/pricing`, and the Stripe fields from `profiles` + `.env`.

### 3. Which sign-in methods?
Set `config.auth.*`:
- **Email/password** — always on.
- **Google** — flip `config.auth.google = true`, then in the Supabase dashboard
  (Authentication → Providers → Google) add the OAuth client ID/secret and set
  the redirect to `https://<project>.supabase.co/auth/v1/callback`. The button
  and `/auth/callback` route are already built.
- **Magic link / Apple** — magic link flips on similarly; Apple is a module
  (needs a paid Apple dev account + key) — ask before scaffolding.

### 4. Site name?
**Apply:** set `NEXT_PUBLIC_APP_NAME` in `.env.local` (feeds `config.name` →
metadata, nav brand, auth pages, emails).

### 5. Logo?
**Apply:** replace `public/logo.svg` (favicon rewrite in `next.config.ts` and the
Sidebar `Image` both point at `/logo.svg`).

### 6. Brand color / accent?
**Apply:** override `--accent-neon` / `--accent-violet` (+ `.light` variants) in
`app/globals.css`. Check contrast on both themes.

### 7. Plans & prices?
**Apply:** edit `PLANS` in `lib/stripe/client.ts` (names + display amounts) and
set the matching `STRIPE_PRICE_*` env vars. The pricing page renders whatever is
in `PLANS`.

### 8. API keys / services beyond the base?
Base already uses Supabase, Stripe, Resend. Anything else (OpenAI, FAL, etc.)?
**Apply:** add env vars to `.env.example`, create a `lib/<service>/` client (use
`requireEnv()` from `lib/env.ts`), install the package.

### 9. Domains?
**Apply:** set `NEXT_PUBLIC_APP_URL` (used for OG metadata, sitemap, robots,
password-reset links) and `NEXT_PUBLIC_MARKETING_URL`.

### 10. Core app pages/features to scaffold?
Which screens live under `app/(app)/app/`?
**Apply:** add a route folder per screen and a nav item in
`components/layout/Sidebar.tsx` (`NAV`).

### 11. Any optional modules? (`config.features.*`)
Offer, scaffold only if wanted:
- **avatars** — Supabase Storage bucket + upload on the settings page.
- **teams** — re-add an `accounts` + `account_members` model (multi-seat).
- **analytics** — GTM/GA4 wiring in the root layout.
- Welcome email, AI-provider client, admin area, rate limiting.

---

## Finish checklist

- [ ] Fill `lib/app-config.ts` from the answers above.
- [ ] `cp .env.example .env.local` and fill every value.
- [ ] Create a Supabase project; run `migrations/001_initial_schema.sql` (+ any
      new migrations) in the SQL Editor. If using Google, configure the provider.
- [ ] Set the Stripe webhook endpoint to `/api/billing/webhook`; copy its signing
      secret into `STRIPE_WEBHOOK_SECRET`.
- [ ] Replace `public/logo.svg`; set name + accent color.
- [ ] Write real `/privacy` and `/terms` content.
- [ ] `npm install && npm run build` — must pass clean.
- [ ] Delete this `SETUP.md` and trim `CLAUDE.md`'s first-open section once set up.
