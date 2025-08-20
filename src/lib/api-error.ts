/* eslint-disable @typescript-eslint/no-explicit-any */
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string, details?: any) {
    super(message, { cause: details });
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}
