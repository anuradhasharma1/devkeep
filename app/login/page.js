"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useAuth } from "@/hooks/UseAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const handleEmailLogin = () => {
    if (!email) return alert("Enter email");

    // TEMP login (replace with backend later)
    login({ name: email.split("@")[0], email });

    router.push("/dashboard");
  };

  const handleLogin = () => {
    login({ name: "Anuradha" }); // temporary
    router.push("/dashboard");
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          color: "var(--accent)",
          fontFamily: "'IBM Plex Mono', monospace"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "1rem" }}>
            Welcome to DevKeep
          </h2>

          <p style={{ fontSize: ".75rem", opacity: 0.7, marginBottom: "1.5rem" }}>
            Login to access your snippets
          </p>

          <button
            onClick={handleLogin}
            style={{
              padding: "8px 18px",
              border: "1px solid var(--accent)",
              background: "transparent",
              color: "var(--accent)",
              cursor: "pointer",
              letterSpacing: ".08em"
            }}
          >
            SIGN IN →
          </button>
        </div>
      </div>
    </>
  );
}