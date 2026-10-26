-- Builder Template — Initial Schema
-- Run in the Supabase SQL Editor.
--
-- Single-user model: one auth user = one profile. Add your product's own
-- tables below / in later migrations (002_*, 003_*, ...).

-- ============================================================
-- PROFILES  (one row per auth user)
-- ============================================================
create table public.profiles (
  user_id                uuid primary key references auth.users(id) on delete cascade,
  email                  text,
  full_name              text,
  plan                   text,
  billing_cycle          text check (billing_cycle in ('monthly', 'yearly')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  subscription_status    text,
  created_at             timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read and update their own profile. Billing fields are written by
-- the Stripe webhook via the service-role client (which bypasses RLS).
create policy "users can read their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create index on public.profiles (stripe_customer_id);

-- ============================================================
-- VERIFICATION CODES  (email verify + password reset)
-- Accessed via the service-role client only — no RLS policies needed.
-- ============================================================
create table public.verification_codes (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  code        text not null,
  expires_at  timestamptz not null,
  used_at     timestamptz,
  attempts    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index on public.verification_codes (email, used_at);
