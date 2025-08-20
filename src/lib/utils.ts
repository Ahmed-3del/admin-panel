/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (str: string | null): string => {
  if (typeof str !== "string" || !str.trim()) return "?";

  return (
    str
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
};
export const getUrlFromFile = (file: File | null): string | null => {
  if (!file) return null;
  return URL.createObjectURL(file);
};
export const getFileNameFromUrl = (url: string): string => {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1];
};
export function getUrlImage(url: string | File | null | any): string {
  if (!url) {
    return "";
  }

  if (typeof url === "string") {
    if (url.startsWith("http")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `https://backend.abwabdigital.com/uploads${url}`;
    }
    if (url.startsWith("profileImage")) {
      return `https://backend.abwabdigital.com/uploads/${url}`;
    }
    if (url.startsWith("uploads")) {
      return `https://backend.abwabdigital.com/${url}`;
    }
    return url;
  }

  if (url instanceof File || url instanceof Blob) {
    return URL.createObjectURL(url);
  }

  return "";
}
