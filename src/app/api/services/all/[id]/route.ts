import { cookies } from "next/headers";

import { fetchWithThrow } from "@/lib/fetcher";
import { withErrorHandling } from "@/lib/with-error-handling";

export const PUT = withErrorHandling(async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return new Response("service ID is required", { status: 400 });
  }
  const cookieStore = await cookies();
  const authToken = cookieStore.get("dashboard-auth-token")?.value;

  if (!authToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.formData();

  const apiRes = await fetchWithThrow(
    `${process.env.NEXT_PUBLIC_API_URL}services/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: body,
    }
  );

  if (!apiRes.ok) {
    return new Response("Failed to update service", { status: apiRes.status });
  }

  const updatedServiceData = await apiRes.json();
  return new Response(JSON.stringify(updatedServiceData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
});

export const GET = withErrorHandling(async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return new Response("service ID is required", { status: 400 });
  }
  const cookieStore = await cookies();
  const authToken = cookieStore.get("dashboard-auth-token")?.value;

  if (!authToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const apiRes = await fetchWithThrow(
    `${process.env.NEXT_PUBLIC_API_URL}services/all/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!apiRes.ok) {
    return new Response("Failed to fetch service", { status: apiRes.status });
  }

  const serviceData = await apiRes.json();
  return new Response(JSON.stringify(serviceData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
});
