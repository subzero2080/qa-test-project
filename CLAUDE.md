# Builder Template

This is a reusable starter. Copy the whole folder to begin a new project, then
customize it for the specific product.

## FIRST-OPEN BEHAVIOR (important)

When this project is opened for the **first time** and has NOT yet been set up
(i.e. `.env.local` is missing or `NEXT_PUBLIC_APP_NAME` is still empty), do this
before writing any feature code:

1. Open **`SETUP.md`** and run the interview — ask the user the numbered
   questions **one at a time**, waiting for each answer.
2. Apply each answer using the checklist in `SETUP.md` (branding, billing flow,
   plans, env, etc.).
3. When the interview is done, confirm the project builds (`npm run build`) and
   tell the user what to do next (fill `.env.local`, run `migrations/001`).

If setup already looks complete, skip the interview and just help with the task.

## What's already built (don't rebuild it)

- **Config switchboard** — `lib/app-config.ts` exports `config` (name, url, auth
  flags, `billing.mode`, `features`). Flipping a flag enables UI/behavior; this
  is the first thing setup fills in.
- **Auth** — email/password via Supabase, 6-digit email verification codes
  (Resend), password reset, and **flag-gated Google OAuth** (`config.auth.google`
  → `components/auth/OAuthButtons.tsx` + `app/auth/callback/route.ts`). Pages in
  `app/(auth)/`; API in `app/api/auth/`.
- **Single-user model** — one auth user = one `profiles` row (incl. `full_name`).
  Schema in `migrations/001_initial_schema.sql`.
- **Billing** — Stripe checkout (`app/checkout/route.ts`,
  `app/api/billing/create-checkout`), webhook (`app/api/billing/webhook`), portal
  (`app/api/billing/portal`). Plans in `lib/stripe/client.ts`. Signup is **free by
  default**; the paid flow is wired during setup per `config.billing.mode`.
- **Design system** — "Galactic Commander" glassmorphism with dark/light mode.
  Tokens + utilities in `app/globals.css` (Tailwind v4, no config file). Shell:
  `components/layout/{Sidebar,ClientShell,PageHeader,AppToast}.tsx`. Reuse the
  CSS variables (`--bg-*`, `--text-*`, `--accent-*`, `--container-glass`) and
  utility classes (`.glass`, `.btn-primary`, `.bg-space`).
- **Marketing + essentials** — placeholder `/` landing, `/pricing`,
  `/privacy`, `/terms`; `error.tsx` / `not-found.tsx` / `loading.tsx`;
  `robots.ts` + `sitemap.ts` + OG metadata.
- **Account settings** — name + password change + billing portal
  (`app/(app)/app/settings`).
- **Env safety** — `lib/env.ts` `requireEnv()` gives fail-loud errors; the
  Supabase-admin / Stripe / Resend clients are lazy so the template builds with
  no `.env`.
- **Next.js 16** — routing guard is **`proxy.ts`** (not `middleware.ts`); the
  exported function must be named `proxy`.

## Working rules (hard)

- **Never run a dev server or reference `localhost`.** Verify with
  `npm run build` + TypeScript only. Everything is tested in production.
- **Migrations are files.** Never paste SQL in chat — add
  `migrations/NNN_description.sql` and tell the user to run it in the Supabase
  SQL Editor.
- **Next.js production error sanitization:** server actions that `throw` get a
  generic message in prod. Return `{ success: false, error }` instead.
- Don't fire live webhook/email/OTP test sends without explicit confirmation.
- Keep the design clean — no tacky/amateur elements, no blue monospace code
  font in UI.
