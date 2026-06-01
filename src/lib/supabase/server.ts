import { createServerClient as createSSRClient } from '@supabase/ssr'
import { createClient }                           from '@supabase/supabase-js'
import { cookies }                                from 'next/headers'

export async function createServerClient() {
  const cookieStore = await cookies()
  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:  ()       => cookieStore.getAll(),
        setAll: (toSet)   => toSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        ),
      },
    },
  )
}

/** Service-role client — bypasses RLS. Only use in API routes / webhooks. */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
