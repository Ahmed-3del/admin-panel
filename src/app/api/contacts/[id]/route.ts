import { cookies } from "next/headers";

import { withErrorHandling } from "@/lib/with-error-handling";

export const GET = withErrorHandling(async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop()
  const cookieStore = await cookies();
  const authToken = cookieStore.get("dashboard-auth-token")?.value;

  if (!authToken) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!id) {
    return new Response("Contact ID is required", { status: 400 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}contacts/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch contact");
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
});
