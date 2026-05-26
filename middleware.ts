import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "lms_demo_admin_session";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get(COOKIE_NAME)?.value === "1";
  const path = request.nextUrl.pathname;
  const isLoginPage = path === "/admin/login";

  if (path.startsWith("/admin") && !isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
