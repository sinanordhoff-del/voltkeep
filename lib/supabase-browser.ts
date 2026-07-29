import { createBrowserClient } from '@supabase/ssr';

// Used in client components — respects the logged-in user's session and RLS policies.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
