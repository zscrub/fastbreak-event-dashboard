import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const response = NextResponse.redirect(new URL('/dashboard', url));

  // Let Supabase safely write cookies using response.cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { request, response },

  );

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return response;
}
