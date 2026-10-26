import { createClient } from '@supabase/supabase-js'
import { requireEnv } from '@/lib/env'

// Service role client — bypasses RLS. Only use in API routes.
export function createAdminClient() {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
