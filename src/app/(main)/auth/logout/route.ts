// /app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect("/auth/login");

  // Remove the cookie
  response.cookies.set("dashboard-auth-token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}
