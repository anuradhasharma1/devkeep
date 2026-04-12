"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { copyToClipboard } from "@/utils/copyToclipboard";
import { formatDate } from "@/utils/formatDate";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

export default function SnippetViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchSnippet = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/snippets/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Not found");
        setSnippet(data.snippet);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSnippet();
  }, [id]);

  const handleCopy = async () => {
    await copyToClipboard(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOwner = session?.user?.id && snippet?.author &&
    (typeof snippet.author === "string"
      ? snippet.author === session.user.id
      : snippet.author.toString() === session.user.id);

  // ── Loading ──
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", fontFamily: "'IBM Plex Mono', monospace", fontSize: ".8rem", color: "var(--accent)" }}>
      loading snippet...
    </div>
  );

  // ── Error / Not found / Private ──
  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", background: "var(--bg)", fontFamily: "'IBM Plex Mono', monospace" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--text)" }}>
        {error === "Unauthorized" ? "this snippet is private" : "snippet not found"}
      </div>
      <div style={{ fontSize: ".75rem", color: "var(--accent)", opacity: .7 }}>
        {error === "Unauthorized" ? "you don't have access to this snippet." : error}
      </div>
      <Link href="/" style={{ fontSize: ".75rem", color: "var(--accent)", textDecoration: "underline", marginTop: ".5rem" }}>
        ← back to home
      </Link>
    </div>
  );

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'IBM Plex Mono', monospace", minHeight: "100vh", position: "relative" }}>

      {/* Grid bg */}
      <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: .1 }}
        viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
        <style>{`.gl{stroke:var(--accent);stroke-width:.5;fill:none;stroke-dasharray:1;stroke-dashoffset:1;animation:draw 2.5s ease forwards}@keyframes draw{to{stroke-dashoffset:0}}`}</style>
        {[[0,175,1000,175,.1],[0,350,1000,350,.25],[0,525,1000,525,.4],[200,0,200,700,.55],[500,0,500,700,.7],[800,0,800,700,.85]]
          .map(([x1,y1,x2,y2,d],i) => <line key={i} className="gl" x1={x1} y1={y1} x2={x2} y2={y2} style={{animationDelay:`${d}s`}}/>)}
        <circle cx="500" cy="350" r="200" fill="var(--accent)" fillOpacity=".06" stroke="var(--accent)" strokeWidth=".5"
          style={{strokeDasharray:1260,strokeDashoffset:1260,animation:"draw 3s 1s ease forwards"}}/>
      </svg>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Back link */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: "2rem" }}>
          <Link href={session ? "/dashboard" : "/"}
            style={{ fontSize: ".7rem", letterSpacing: ".08em", color: "var(--accent)", opacity: .7, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
            ← {session ? "back to dashboard" : "back to home"}
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".62rem", letterSpacing: ".18em", color: "var(--accent)", marginBottom: ".6rem" }}>
                <span style={{ display: "inline-block", width: 20, height: 1, background: "var(--accent)" }} />
                {snippet.isPublic ? "public snippet" : "private snippet"}
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: ".5rem" }}>
                {snippet.title}
              </h1>
              {snippet.description && (
                <p style={{ fontSize: ".78rem", color: "var(--accent)", opacity: .8, lineHeight: 1.7, maxWidth: "60ch" }}>
                  {snippet.description}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: ".6rem", flexShrink: 0 }}>
              <button onClick={handleCopy}
                style={{
                  display: "flex", alignItems: "center", gap: ".5rem",
                  padding: ".6rem 1.1rem", border: "1px solid var(--border)",
                  borderRadius: 5, background: copied ? "var(--accent)" : "var(--card)",
                  color: copied ? "var(--bg)" : "var(--accent)",
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: ".7rem",
                  letterSpacing: ".06em", cursor: "pointer", transition: "all .2s",
                }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {copied
                    ? <polyline points="20 6 9 17 4 12" />
                    : <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>}
                </svg>
                {copied ? "copied!" : "copy code"}
              </button>

              {isOwner && (
                <Link href={`/edit/${snippet._id}`}
                  style={{
                    display: "flex", alignItems: "center", gap: ".5rem",
                    padding: ".6rem 1.1rem", border: "1px solid var(--border)",
                    borderRadius: 5, background: "var(--card)", color: "var(--accent)",
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: ".7rem",
                    letterSpacing: ".06em", textDecoration: "none", transition: "border-color .2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  edit
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Meta row */}
        <motion.div {...fadeUp(0.15)}
          style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {/* Language badge */}
          <span style={{ fontSize: ".65rem", letterSpacing: ".1em", padding: "4px 12px", borderRadius: 999, border: "1px solid var(--border)", color: "var(--accent)", textTransform: "uppercase" }}>
            {snippet.language}
          </span>
          {/* Tags */}
          {(snippet.tags || []).map(t => (
            <span key={t} style={{ fontSize: ".62rem", padding: "3px 10px", borderRadius: 999, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--accent)" }}>
              #{t}
            </span>
          ))}
          {/* Date */}
          <span style={{ fontSize: ".62rem", color: "var(--accent)", opacity: .5, marginLeft: "auto" }}>
            saved {formatDate(snippet.createdAt)}
          </span>
        </motion.div>

        {/* Code block */}
        <motion.div {...fadeUp(0.2)}>
          <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            {/* Terminal bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".6rem 1rem", background: "var(--border)" }}>
              <div style={{ display: "flex", gap: ".4rem" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#e06c75" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#e5c07b" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#98c379" }} />
              </div>
              <span style={{ fontSize: ".62rem", letterSpacing: ".08em", color: "var(--accent)" }}>
                {snippet.title} · {snippet.language}
              </span>
              <button onClick={handleCopy}
                style={{ fontSize: ".62rem", color: "var(--accent)", background: "transparent", border: "none", cursor: "pointer", opacity: .7, letterSpacing: ".04em" }}>
                {copied ? "copied ✓" : "copy"}
              </button>
            </div>

            {/* Code */}
            <div style={{ background: "var(--bg)", overflowX: "auto" }}>
              <pre style={{
                padding: "1.5rem",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: ".78rem",
                lineHeight: 1.85,
                color: "var(--accent)",
                margin: 0,
                whiteSpace: "pre",
                minWidth: "fit-content",
              }}>
                {snippet.code}
              </pre>
            </div>
          </div>

          {/* Line count */}
          <div style={{ fontSize: ".6rem", color: "var(--accent)", opacity: .4, textAlign: "right", marginTop: ".5rem" }}>
            {snippet.code?.split("\n").length} lines
          </div>
        </motion.div>

        {/* Share box — only for public snippets */}
        {snippet.isPublic && (
          <motion.div {...fadeUp(0.3)} style={{ marginTop: "2rem", padding: "1.25rem", border: "1px solid var(--border)", borderRadius: 8, background: "var(--card)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".62rem", letterSpacing: ".18em", color: "var(--accent)", marginBottom: ".75rem" }}>
              <span style={{ display: "inline-block", width: 20, height: 1, background: "var(--accent)" }} />
              share this snippet
            </div>
            <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
              <input
                readOnly
                value={typeof window !== "undefined" ? window.location.href : ""}
                style={{ flex: 1, padding: ".55rem .75rem", border: "1px solid var(--border)", borderRadius: 5, background: "var(--bg)", fontFamily: "'IBM Plex Mono', monospace", fontSize: ".68rem", color: "var(--accent)", outline: "none" }}
              />
              <button
                onClick={() => {
                  copyToClipboard(window.location.href);
                  const btn = document.getElementById("share-btn");
                  if (btn) { btn.textContent = "copied!"; setTimeout(() => btn.textContent = "copy link", 2000); }
                }}
                id="share-btn"
                style={{ padding: ".55rem 1rem", background: "var(--text)", color: "var(--bg)", border: "none", borderRadius: 5, fontFamily: "'IBM Plex Mono', monospace", fontSize: ".68rem", cursor: "pointer", letterSpacing: ".06em", whiteSpace: "nowrap" }}>
                copy link
              </button>
            </div>
          </motion.div>
        )}

        {/* If not logged in — CTA */}
        {!session && (
          <motion.div {...fadeUp(0.35)} style={{ marginTop: "2rem", padding: "1.5rem", border: "1px solid var(--border)", borderRadius: 8, background: "var(--card)", textAlign: "center" }}>
            <p style={{ fontSize: ".75rem", color: "var(--accent)", marginBottom: "1rem", lineHeight: 1.7 }}>
              Want to save your own snippets?
            </p>
            <Link href="/login"
              style={{ padding: ".65rem 1.5rem", background: "var(--text)", color: "var(--bg)", borderRadius: 5, fontFamily: "'IBM Plex Mono', monospace", fontSize: ".72rem", letterSpacing: ".08em", textDecoration: "none" }}>
              get started — for Free
            </Link>
          </motion.div>
        )}
      </div>

      <style>{`@keyframes draw { to { stroke-dashoffset: 0; } }`}</style>
    </div>
  );
}