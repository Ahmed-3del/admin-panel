import { cookies } from "next/headers";

import { fetchWithThrow } from "@/lib/fetcher";
import { withErrorHandling } from "@/lib/with-error-handling";

export const GET = withErrorHandling(async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return new Response("Project ID is required", { status: 400 });
  }
  const cookieStore = await cookies();
  const token = cookieStore.get("dashboard-auth-token")?.value;
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const res = await fetchWithThrow(
      `${process.env.NEXT_PUBLIC_API_URL}portfolio/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Error fetching project: ${res.statusText}`);
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

export const DELETE = withErrorHandling(async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return new Response("Project ID is required", { status: 400 });
  }
  const cookieStore = await cookies();
  const token = cookieStore.get("dashboard-auth-token")?.value;
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}portfolio/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Error deleting project: ${res.statusText}`);
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
export const PUT = withErrorHandling(async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return new Response("Project ID is required", { status: 400 });
  }
  const cookieStore = await cookies();
  const token = cookieStore.get("dashboard-auth-token")?.value;
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.formData();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}portfolio/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      }
    );

    if (!res.ok) {
      throw new Error(`Error updating project: ${res.statusText}`);
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
