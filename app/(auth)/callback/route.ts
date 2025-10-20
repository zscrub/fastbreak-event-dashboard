// app/(auth)/callback/route.ts
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  console.log("➡️ Callback route hit:", request.url);

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    console.log("❌ No code found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Prepare redirect and response
  const redirectTo = new URL("/dashboard", request.url);
  const response = NextResponse.redirect(redirectTo);

  // Create Supabase server client (Node runtime only)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, ...options }) => {
            console.log("🍪 Setting cookie:", name);
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  console.log("🔄 Exchanging code for session...");
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("❌ Supabase exchange error:", error.message);
    return NextResponse.redirect(new URL("/login?error=auth", request.url));
  }

  console.log("✅ Session exchange successful!");
  console.log("👤 User email:", data?.session?.user?.email);

  if (!data?.session) {
    console.error("⚠️ No session returned — possible cookie issue");
  }

  return response;
}
