# Builder Template

A fast-start Next.js starter: Supabase auth (email/password + verification
codes), Stripe billing, Resend email, and a dark/light glassmorphism design
system with an authenticated app shell.

## Start a new project

1. Copy this folder.
2. Open it with Claude Code — it will run the **SETUP interview** (`SETUP.md`)
   and customize the template for your product.
3. `cp .env.example .env.local` and fill in the values.
4. Create a Supabase project and run `migrations/001_initial_schema.sql`.
5. `npm install && npm run build`, then deploy.

## Stack

- Next.js 16 (App Router, `proxy.ts`) + React 19
- Supabase (`@supabase/ssr`) — email/password + Google auth, single-user `profiles`
- Stripe — checkout, webhook, customer portal
- Resend — transactional email
- Tailwind v4 (PostCSS, no config file)
- `lib/app-config.ts` — feature-flag switchboard the SETUP interview fills in

## Layout

- `app/(auth)/` — login, signup, verify, forgot/reset password
- `app/(app)/` — protected app shell (Sidebar + content)
- `app/page.tsx`, `app/pricing/` — placeholder marketing
- `app/api/{auth,billing,account}/` — API routes
- `lib/{supabase,stripe,resend,app-config}` — integrations + branding
- `components/layout/`, `components/ui/` — design-system shell
- `migrations/` — SQL, run manually in Supabase

See `CLAUDE.md` for working rules and `SETUP.md` for the setup interview.
