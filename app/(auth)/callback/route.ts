export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) return NextResponse.redirect(new URL("/login", request.url));

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
            request.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  console.log("🔐 exchangeCodeForSession:", {
    user: sessionData?.session?.user?.email,
    access_token: !!sessionData?.session?.access_token,
    error: error?.message ?? null,
  });

  // ✅ Redirect *after* cookies are available
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  sessionData?.session?.access_token && response.cookies.set(
    "sb-access-token",
    sessionData.session.access_token,
    { path: "/", httpOnly: true, sameSite: "lax" }
  );

  return response;
}
