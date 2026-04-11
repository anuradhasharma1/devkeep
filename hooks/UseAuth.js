
"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const loading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user ?? null;

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  //  NextAuth handles login itself
  const login = () => {
    router.push("/dashboard");
  };

  return { user, loading, isAuthenticated, login, logout };
}