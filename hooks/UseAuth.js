"use client";

import { useState } from "react";

const STORAGE_KEY = "devkeep_user";

export function useAuth() {
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

  const [loading, setLoading] = useState(false); // no async now

  const login = (userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}