import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const redirectTo = new URL("/dashboard", request.url);
  const response = NextResponse.redirect(redirectTo);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, ...options }) => {
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  // ✅ Only call exchangeCodeForSession ONCE
  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  console.log("🔐 Supabase session response:", {
    user: sessionData?.session?.user?.email,
    access_token: sessionData?.session?.access_token ? "✅ received" : "❌ missing",
    error: error?.message ?? null,
  });

  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth", request.url));
  }

  return response;
}
