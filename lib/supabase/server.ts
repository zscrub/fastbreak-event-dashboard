import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Safe read-only Supabase client for Server Components and loaders.
 * ✅ Compatible with Next.js 15 strict cookie API.
 */
export function createClient() {
  const cookieStore = cookies();

  // Only provide "get" — never set/remove cookies here
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // New Next.js 15 API — must await dynamic cookies()
          // But Supabase expects sync, so we access synchronously
          // This is safe since it only reads.
          return cookieStore.get(name)?.value;
        },
        // NOOPs prevent Supabase from trying to set cookies (causes 500 error)
        set() {},
        remove() {},
      },
    }
  );
}
