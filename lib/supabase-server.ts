import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Used in API routes and server components — reads the user's session from cookies
// so Row Level Security policies apply correctly (a user only ever sees their own data).
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

// Used only by trusted backend jobs (the daily reminder cron) that need to read
// across ALL businesses, bypassing Row Level Security. Never expose this client
// to anything reachable by a logged-in user's browser.
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
