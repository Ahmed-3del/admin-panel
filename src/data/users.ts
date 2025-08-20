"use client";
import { useState, useEffect } from "react";

type UserType = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  isAdmin: boolean;
};

const fallbackUser: UserType = {
  id: "root",
  name: "Root User",
  email: "user",
  avatar: "/assets/avatare/arhamkhnz.png",
  role: "user",
  isAdmin: false,
};

export const useCurrentUser = (): UserType => {
  const [user, setUser] = useState<UserType>(fallbackUser);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin-profile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed?.data ?? fallbackUser);
        } catch (err) {
          console.error("Invalid JSON in admin-profile:", err);
        }
      }
    }
  }, []);

  return user;
};
