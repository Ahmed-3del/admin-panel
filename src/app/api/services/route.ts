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
    `${process.env.NEXT_PUBLIC_API_URL}services`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  if (!apiRes.ok) {
    return new Response("Failed to fetch services", { status: apiRes.status });
  }
  const servicesData = await apiRes.json();
  console.log("Fetched services data:", servicesData);
  return new Response(JSON.stringify(servicesData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
});

export const POST = withErrorHandling(async (req: Request) => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("dashboard-auth-token")?.value;

  if (!authToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.formData();

  const apiRes = await fetchWithThrow(
    `${process.env.NEXT_PUBLIC_API_URL}services`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: body,
    }
  );

  if (!apiRes.ok) {
    return new Response("Failed to create service", { status: apiRes.status });
  }

  const createdService = await apiRes.json();
  console.log("Created service:", createdService);
  return new Response(JSON.stringify(createdService), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
});
