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
    `${process.env.NEXT_PUBLIC_API_URL}portfolio`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  if (!apiRes.ok) {
    return new Response("Failed to fetch projects", { status: apiRes.status });
  }
  const projectsData = await apiRes.json();
  return new Response(JSON.stringify(projectsData), {
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

  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}portfolio`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body,
  });
  const projectData = await apiRes.json();

  if (!apiRes.ok) {
    return new Response(JSON.stringify(projectData), {
      status: apiRes.status,
      statusText: "Failed to create project",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify(projectData), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
});
