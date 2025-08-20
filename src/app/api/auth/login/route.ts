import { cookies } from "next/headers";

import { fetchWithThrow } from "@/lib/fetcher";
import { withErrorHandling } from "@/lib/with-error-handling";

export const POST = withErrorHandling(async (req: Request) => {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const cookieStore = cookies();
  const apiRes = await fetchWithThrow(
    `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );
  if (!apiRes.ok) {
    console.error("Login failed:", apiRes);
    return new Response("Invalid credentials", { status: 401 });
  }

  const apiResJson = await apiRes.json();

  (await cookieStore).set("dashboard-auth-token", apiResJson.token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 604800,
  });

  return new Response(JSON.stringify(apiResJson), {
    status: 200,
  });
});
