import { fetchWithThrow } from "@/lib/fetcher";
import { withErrorHandling } from "@/lib/with-error-handling";

export const GET = withErrorHandling(async () => {
  const res = await fetchWithThrow(
    `${process.env.NEXT_PUBLIC_API_URL}contact`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch contacts: ${res.statusText}`);
  }
  console.log("GET /api/contacts response:", res);
  const data = await res.json();
  return new Response(
    JSON.stringify({
      status: "success",
      data: data,
    })
  );
});
