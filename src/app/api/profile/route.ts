import { cookies } from "next/headers";

import { fetchWithThrow } from "@/lib/fetcher";
import { withErrorHandling } from "@/lib/with-error-handling";

export const GET = withErrorHandling(async () => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("dashboard-auth-token")?.value;
  if (!authToken) {
    return new Response("Unauthorized", { status: 401 });
  }
  const apiRes = await fetchWithThrow(`${process.env.NEXT_PUBLIC_API_URL}profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!apiRes.ok) {
    return new Response("Failed to fetch profile", { status: apiRes.status });
  }
  const profileData = await apiRes.json();
  return new Response(JSON.stringify(profileData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
});
