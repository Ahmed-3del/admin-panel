import { cookies } from "next/headers";

import { fetchWithThrow } from "@/lib/fetcher";
import { withErrorHandling } from "@/lib/with-error-handling";

export const GET = withErrorHandling(async () => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("dashboard-auth-token")?.value;

  if (!authToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const apiRes = await fetchWithThrow(
    `${process.env.NEXT_PUBLIC_API_URL}client`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

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

export const POST = withErrorHandling(async (req: Request) => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("dashboard-auth-token")?.value;

  if (!authToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.formData();

  const apiRes = await fetchWithThrow(
    `${process.env.NEXT_PUBLIC_API_URL}client`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: body,
    }
  );

  if (!apiRes.ok) {
    return new Response("Failed to create client", { status: apiRes.status });
  }

  const clientData = await apiRes.json();

  return new Response(
    JSON.stringify({
      status: "success",
      data: clientData.data,
    }),
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
});
