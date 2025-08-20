export const withErrorHandling = (
  handler: (req: Request) => Promise<Response>
): ((req: Request) => Promise<Response>) => {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req);
    } catch (error: any) {
      // Optional: log error to external service or console
      console.error("API Error:", error);

      const statusCode = error?.statusCode || error?.status || 500;
      const message = error?.message || "Internal Server Error";
      const details = error?.errors || null;

      return new Response(
        JSON.stringify({
          success: false,
          message,
          ...(details && { errors: details }),
        }),
        {
          status: statusCode,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  };
};


// export function withErrorHandling<
//   T extends (req: Request, context: any) => Promise<Response>
// >(handler: T): T {
//   return (async (req: Request, context: any) => {
//     try {
//       return await handler(req, context);
//     } catch (error: any) {
//       const statusCode = error?.statusCode ?? error?.status ?? 500;
//       const message = error?.message ?? "Internal Server Error";

//       return new Response(JSON.stringify({ success: false, message }), {
//         status: statusCode,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     }
//   }) as T;
// }
