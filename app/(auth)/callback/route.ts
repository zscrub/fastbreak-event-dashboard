// app/(auth)/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    // No code in URL — just go back to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // We’ll redirect the user here after successful login
  const redirectUrl = new URL("/dashboard", request.url);
  const response = NextResponse.redirect(redirectUrl);

  // Create a Supabase client bound to this request/response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Required for Vercel’s Edge runtime
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, ...options }) => {
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Supabase exchangeCodeForSession error:", error.message);
      return NextResponse.redirect(new URL("/login?error=auth", request.url));
    }
  } catch (err) {
    console.error("Callback error:", err);
  }

  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  console.log('🔐 Supabase session response:', {
    user: sessionData?.session?.user?.email,
    access_token: sessionData?.session?.access_token ? '✅ received' : '❌ missing',
    error: error?.message ?? null,
  });


  return response;
}
