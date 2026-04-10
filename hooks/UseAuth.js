"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "devkeep_user";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(() => {
    try {
      if (typeof window === "undefined") return null;
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("Auth init error:", err);
      return null;
    }
  });

  const [loading] = useState(false); 

  const login = (userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    router.push("/")
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}