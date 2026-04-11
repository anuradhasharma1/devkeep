"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});


export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();


  const [mode, setMode] = useState("login");         // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Already logged in → redirect 
  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  const validate = () => {
    const e = {};
    if (mode === "register" && !name.trim()) e.name = "name is required";
    if (!email.trim()) e.email = "email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "enter a valid email";
    if (!password) e.password = "password is required";
    else if (password.length < 6) e.password = "minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      if (mode === "register") {
        // 1. Create account via register API
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrors({ submit: data.error });
          setLoading(false);
          return;
        }
        // 2. Auto sign in after register
      }

      // Sign in with NextAuth credentials
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({ submit: result.error });
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setErrors({ submit: "Network error. Please try again." });
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };


  const inputStyle = (field) => ({
    width: "100%",
    padding: ".7rem .9rem",
    border: `1px solid ${errors[field] ? "#e06c75" : "var(--border)"}`,
    borderRadius: 6,
    background: "var(--card)",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: ".75rem",
    color: "var(--text)",
    outline: "none",
    transition: "border-color .2s",
    letterSpacing: ".03em",
  });

  if (status === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", fontFamily: "'IBM Plex Mono', monospace", fontSize: ".8rem", color: "var(--accent)" }}>
      loading...
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)", color: "var(--text)",
      fontFamily: "'IBM Plex Mono', monospace", display: "flex",
      flexDirection: "column", position: "relative", overflow: "hidden",
    }}>

      {/* Grid bg  */}
      <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: .12 }}
        viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
        <style>{`.gl{stroke:var(--accent);stroke-width:.5;fill:none;stroke-dasharray:1;stroke-dashoffset:1;animation:draw 2.5s ease forwards}@keyframes draw{to{stroke-dashoffset:0}}`}</style>
        {[[0, 175, 1000, 175, .1], [0, 350, 1000, 350, .25], [0, 525, 1000, 525, .4], [200, 0, 200, 700, .55], [500, 0, 500, 700, .7], [800, 0, 800, 700, .85]]
          .map(([x1, y1, x2, y2, d], i) => (
            <line key={i} className="gl" x1={x1} y1={y1} x2={x2} y2={y2} style={{ animationDelay: `${d}s` }} />
          ))}
        <circle cx="500" cy="350" r="200" fill="var(--accent)" fillOpacity=".06"
          stroke="var(--accent)" strokeWidth=".5"
          style={{ strokeDasharray: 1260, strokeDashoffset: 1260, animation: "draw 3s 1s ease forwards" }} />
        <circle cx="500" cy="350" r="320" fill="var(--accent)" fillOpacity=".03"
          stroke="var(--accent)" strokeWidth=".5"
          style={{ strokeDasharray: 2010, strokeDashoffset: 2010, animation: "draw 3.5s 1.2s ease forwards", opacity: .5 }} />
        <line className="gl" x1="340" y1="190" x2="660" y2="510"
          style={{ strokeDasharray: 1, strokeDashoffset: 1, animation: "draw 2s 1.8s ease forwards" }} />
        <line className="gl" x1="660" y1="190" x2="340" y2="510"
          style={{ strokeDasharray: 1, strokeDashoffset: 1, animation: "draw 2s 2s ease forwards" }} />
      </svg>


      {/* Centered form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Heading */}
          <motion.div {...fadeUp(0)} style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".6rem", fontSize: ".62rem", letterSpacing: ".18em", color: "var(--accent)", marginBottom: ".75rem" }}>
              <span style={{ display: "inline-block", width: 20, height: 1, background: "var(--accent)" }} />
              {mode === "login" ? "welcome back" : "create account"}
              <span style={{ display: "inline-block", width: 20, height: 1, background: "var(--accent)" }} />
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, lineHeight: 1.1 }}>
              {mode === "login" ? (
                <>Open your <em style={{ fontStyle: "italic", color: "var(--accent)" }}>vault.</em></>
              ) : (
                <>Start your <em style={{ fontStyle: "italic", color: "var(--accent)" }}>journey.</em></>
              )}
            </h1>
          </motion.div>

          {/* Card */}
          <motion.div {...fadeUp(0.1)} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "2rem", }}>

            {/* Google button */}
            <button onClick={handleGoogle} disabled={loading}
              style={{
                width: "100%", padding: ".75rem", marginBottom: "1.25rem",
                background: "var(--bg)", border: "1px solid var(--border)",
                borderRadius: 6, cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", gap: ".65rem",
                fontFamily: "'IBM Plex Mono', monospace", fontSize: ".72rem",
                color: "var(--text)", letterSpacing: ".06em", transition: "border-color .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
              {/* Google G icon */}
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              continue with google
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: ".6rem", color: "var(--accent)", opacity: .6, letterSpacing: ".1em" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            {/* Mode tabs */}
            <div style={{ display: "flex", gap: "1px", background: "var(--border)", borderRadius: 6, overflow: "hidden", marginBottom: "1.75rem" }}>
              {["login", "register"].map(m => (
                <button key={m} onClick={() => { setMode(m); setErrors({}); }}
                  style={{
                    flex: 1, padding: ".6rem", border: "none", cursor: "pointer",
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: ".7rem",
                    letterSpacing: ".08em", transition: "all .2s",
                    background: mode === m ? "var(--text)" : "var(--card)",
                    color: mode === m ? "var(--bg)" : "var(--accent)",
                  }}>
                  {m}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

              {/* Name — register only */}
              {mode === "register" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
                  <label style={{ display: "block", fontSize: ".62rem", letterSpacing: ".14em", color: "var(--accent)", marginBottom: ".4rem" }}>name</label>
                  <input value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                    placeholder="Anuradha Sharma" style={inputStyle("name")}
                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                    onBlur={e => e.target.style.borderColor = errors.name ? "#e06c75" : "var(--border)"}
                  />
                  {errors.name && <div style={{ fontSize: ".62rem", color: "#e06c75", marginTop: ".3rem" }}>{errors.name}</div>}
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: ".62rem", letterSpacing: ".14em", color: "var(--accent)", marginBottom: ".4rem" }}>email</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                  placeholder="you@example.com" style={inputStyle("email")}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = errors.email ? "#e06c75" : "var(--border)"}
                />
                {errors.email && <div style={{ fontSize: ".62rem", color: "#e06c75", marginTop: ".3rem" }}>{errors.email}</div>}
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", fontSize: ".62rem", letterSpacing: ".14em", color: "var(--accent)", marginBottom: ".4rem" }}>password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPass ? "text" : "password"} value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
                    placeholder="minimum 6 characters" style={{ ...inputStyle("password"), paddingRight: "2.5rem" }}
                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                    onBlur={e => e.target.style.borderColor = errors.password ? "#e06c75" : "var(--border)"}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: "absolute", right: ".75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--accent)", opacity: .6, fontSize: ".7rem" }}>
                    {showPass ? "hide" : "show"}
                  </button>
                </div>
                {errors.password && <div style={{ fontSize: ".62rem", color: "#e06c75", marginTop: ".3rem" }}>{errors.password}</div>}
              </div>

              {/* Submit error */}
              {errors.submit && (
                <div style={{ fontSize: ".68rem", color: "#e06c75", padding: ".7rem .9rem", border: "1px solid #e06c75", borderRadius: 5, background: "rgba(224,108,117,.06)" }}>
                  {errors.submit}
                </div>
              )}

              {/* Submit button */}
              <button type="submit" disabled={loading}
                style={{
                  width: "100%", padding: ".85rem", background: "var(--text)", color: "var(--bg)",
                  border: "none", borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: ".75rem", letterSpacing: ".1em", cursor: loading ? "default" : "pointer",
                  opacity: loading ? .7 : 1, transition: "background .2s", marginTop: ".25rem",
                }}>
                {loading ? "please wait..." : mode === "login" ? "sign in →" : "create account →"}
              </button>
            </form>


            {/* Switch mode */}
            <p style={{ textAlign: "center", fontSize: ".68rem", color: "var(--accent)", opacity: .75 }}>
              {mode === "login" ? "no account yet? " : "already have one? "}
              <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setErrors({}); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontFamily: "'IBM Plex Mono', monospace", fontSize: ".68rem", textDecoration: "underline", textUnderlineOffset: 3 }}>
                {mode === "login" ? "register here" : "sign in instead"}
              </button>
            </p>
          </motion.div>

          {/* Bottom note */}
          <motion.p {...fadeUp(0.2)} style={{ textAlign: "center", fontSize: ".62rem", color: "var(--accent)", opacity: .5, marginTop: "1.25rem", letterSpacing: ".06em" }}>
            free to use · no credit card · your data stays yours
          </motion.p>
        </div>
      </div>

      <style>{`
        @keyframes draw { to { stroke-dashoffset: 0; } }
        input::placeholder { color: var(--accent); opacity: .45; }
      `}</style>
    </div>
  );
}