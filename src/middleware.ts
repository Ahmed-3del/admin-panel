import { NextRequest, NextResponse } from "next/server";

import { authMiddleware } from "./middleware/auth-middleware";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return authMiddleware(req);
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/"],
};
