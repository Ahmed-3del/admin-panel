import { cookies } from "next/headers";

import { withErrorHandling } from "@/lib/with-error-handling";

export const GET = withErrorHandling(async () => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("dashboard-auth-token")?.value;

  if (!authToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!apiRes.ok) {
    return new Response("Failed to fetch clients", { status: apiRes.status });
  }

  const clientsData = await apiRes.json();

  return new Response(
    JSON.stringify({
      status: "success",
      data: clientsData.data,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
});
