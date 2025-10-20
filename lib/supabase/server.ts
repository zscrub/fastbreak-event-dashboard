import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type Cookie = { name: string; value: string; [key: string]: unknown };

/** Server-only Supabase client with cookie adapter */
export async function createClient() {
  // ✅ cookies() is async in Next.js 15+
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          // ✅ must return an array of { name, value }
          return Array.from(cookieStore.getAll()).map((c) => ({
            name: c.name,
            value: c.value,
          }));
        },
        async setAll(cookiesToSet: Cookie[]) {
          try {
            for (const { name, value, ...options } of cookiesToSet) {
              cookieStore.set({ name, value, ...options });
            }
          } catch {
            // ignore if outside writable context (e.g., RSC)
          }
        },
      },
    }
  );
}
