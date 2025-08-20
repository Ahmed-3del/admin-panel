/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchWithThrow } from "@/lib/fetcher";
import { withErrorHandling } from "@/lib/with-error-handling";

export const GET = withErrorHandling(async (req: Request) => {
  const response = await fetchWithThrow(
    `${process.env.NEXT_PUBLIC_API_URL}about`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch about: ${response.statusText}`);
  }

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await req.formData();

  const response = await fetchWithThrow(
    `${process.env.NEXT_PUBLIC_API_URL}about`,
    {
      method: "POST",
      body: body,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create about: ${response.statusText}`);
  }

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
});
