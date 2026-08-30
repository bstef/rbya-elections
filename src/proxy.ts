import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Route guards here are UX-layer convenience only. The real enforcement is
// RLS (is_admin() / delegates_self_read policies) on every table and RPC,
// so a stolen or bypassed middleware can't be used to mutate data.
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const { data: adminRow } = await supabase
      .from("admins")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (!adminRow) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/ballot") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
