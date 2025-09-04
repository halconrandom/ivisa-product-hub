// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl;

  // Public routes (never block)
  const publicPaths = ["/login", "/auth/callback", "/blocked", "/favicon.ico"];
  if (publicPaths.some((p) => url.pathname.startsWith(p))) {
    return res;
  }

  // Check session from Supabase cookies
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Not logged in -> /login (preserve "next" for post-login redirect)
  if (!session) {
    const loginUrl = url.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", url.pathname + url.search);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in -> fetch role from profiles
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  // If no profile yet or role is 'newbie', block
  if (error || !profile || profile.role === "newbie") {
    const blockedUrl = url.clone();
    blockedUrl.pathname = "/blocked";
    return NextResponse.redirect(blockedUrl);
  }

  // Otherwise, allow
  return res;
}

// Protect everything except static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
