import { fetchWithThrow } from "@/lib/fetcher";
import { withErrorHandling } from "@/lib/with-error-handling";

export const DELETE = withErrorHandling(async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return new Response("ID is required", { status: 400 });
  }

  const response = await fetchWithThrow(
    `${process.env.NEXT_PUBLIC_API_URL}about/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete about: ${response.statusText}`);
  }

  return new Response(null, { status: 204 });
});

export const PUT = withErrorHandling(async (req: Request) => {
  const body = await req.formData();
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return new Response("ID is required", { status: 400 });
  }

  const response = await fetchWithThrow(
    `${process.env.NEXT_PUBLIC_API_URL}about/${id}`,
    {
      method: "PUT",
      body: body,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update about: ${response.statusText}`);
  }

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
