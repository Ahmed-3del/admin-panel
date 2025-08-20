import { ApiError } from "./api-error";

export const fetchWithThrow = async (
  url: string,
  options: RequestInit = {}
) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new ApiError(res.status, res.statusText, await res.json());
  }

  return res;
};
