// app/(auth)/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // Always redirect to dashboard (or wherever)
  const redirectUrl = new URL('/dashboard', request.url);
  const response = NextResponse.redirect(redirectUrl);

  if (!code) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          // ✅ Properly sets returned session cookies on response
          cookies.forEach(({ name, value, ...options }) => {
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) console.error('Auth exchange error:', error);
    else console.log('✅ Session exchange success:', data?.session?.user?.email);
  } catch (err) {
    console.error('Callback handler error:', err);
  }

  return response;
}
