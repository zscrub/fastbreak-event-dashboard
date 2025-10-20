// app/(auth)/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const response = NextResponse.redirect(new URL('/dashboard', request.url));

  if (!code) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll(cookies) {
          for (const { name, value, ...options } of cookies) {
            response.cookies.set({ name, value, ...options });
          }
        },
      },
    }
  );

  await supabase.auth.exchangeCodeForSession(code);
  return response;
}

