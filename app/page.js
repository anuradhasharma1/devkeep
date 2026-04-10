"use client"
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Mail, } from "lucide-react";
import ScrollToTop from "@/components/Button";



const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

function useCountUp(ref, target, duration = 1200, startDelay = 800) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame;
    const timeout = setTimeout(() => {
      let start = 0;
      const step = target / (duration / 16);
      frame = setInterval(() => {
        start += step;
        if (start >= target) { el.textContent = target; clearInterval(frame); return; }
        el.textContent = Math.floor(start);
      }, 16);
    }, startDelay);
    return () => { clearTimeout(timeout); clearInterval(frame); };
  }, [ref, target, duration, startDelay]);
}

export default function Home() {
  const s1 = useRef(null), s2 = useRef(null), s3 = useRef(null);
  useCountUp(s1, 128, 1200);
  useCountUp(s2, 20, 900);
  useCountUp(s3, 47, 1000);
  return (
    <>
      <div className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'IBM Plex Mono', monospace" }}>

        {/* Animated grid background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice"
          style={{ opacity: 0.25 }}>
          <style>{`
          .gl { stroke: var(--accent); stroke-width: 0.5; fill: none; }
          .gl-draw { stroke-dasharray: 1; stroke-dashoffset: 1;
            animation: draw 2.5s ease forwards; }
          @keyframes draw { to { stroke-dashoffset: 0; } }
        `}</style>
          {[
            ["line", { x1: 0, y1: 175, x2: 1000, y2: 175, style: { animationDelay: ".1s" } }],
            ["line", { x1: 0, y1: 350, x2: 1000, y2: 350, style: { animationDelay: ".25s" } }],
            ["line", { x1: 0, y1: 525, x2: 1000, y2: 525, style: { animationDelay: ".4s" } }],
            ["line", { x1: 200, y1: 0, x2: 200, y2: 700, style: { animationDelay: ".55s" } }],
            ["line", { x1: 500, y1: 0, x2: 500, y2: 700, style: { animationDelay: ".7s" } }],
            ["line", { x1: 800, y1: 0, x2: 800, y2: 700, style: { animationDelay: ".85s" } }],
          ].map(([Tag, props], i) => <Tag key={i} className="gl gl-draw" {...props} />)}
          <circle className="gl" cx="500" cy="350" r="200"
            style={{
              fill: "var(--accent)", fillOpacity: 0.08,
              strokeDasharray: 1260, strokeDashoffset: 1260,
              animation: "draw 3s 1s ease forwards"
            }} />
          <circle className="gl" cx="500" cy="350" r="320" style={{
            fill: "var(--accent)", fillOpacity: 0.04, opacity: .5,
            opacity: .5,
            strokeDasharray: 2010, strokeDashoffset: 2010,
            animation: "draw 3.5s 1.2s ease forwards"
          }} />
          <line className="gl" x1="340" y1="190" x2="660" y2="510"
            style={{ strokeDasharray: 1, strokeDashoffset: 1, animation: "draw 2s 1.8s ease forwards" }} />
          <line className="gl" x1="660" y1="190" x2="340" y2="510"
            style={{ strokeDasharray: 1, strokeDashoffset: 1, animation: "draw 2s 2s ease forwards" }} />
        </svg>



        {/* Hero */}
        <div className="relative z-10 flex-1 grid md:grid-cols-2 items-center gap-8 px-8 py-12 max-w-5xl mx-auto w-full">
          {/* Left */}
          <div>
            <motion.div {...fadeUp(0)}
              className="flex items-center gap-2 text-xs tracking-widest mb-5"
              style={{ color: "var(--accent)" }}>
              <span style={{ display: "inline-block", width: 28, height: 1, background: "var(--accent)" }} />
              code snippet manager
            </motion.div>

            <motion.h1 {...fadeUp(0.2)}
              className="leading-tight mb-5"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem,5vw,3.8rem)", fontWeight: 700, lineHeight: 1.08 }}>
              Your cozy<br />
              <em style={{ color: "var(--accent)", fontStyle: "italic" }}>code vault</em><br />
              lives here.
            </motion.h1>

            <motion.p {...fadeUp(0.35)}
              className="text-sm mb-8 leading-relaxed"
              style={{ color: "var(--accent)", opacity: 0.85, maxWidth: "34ch", lineHeight: 1.8, fontSize: ".78rem" }}>
              Save, tag, and retrieve snippets in seconds. A calm, distraction-free workspace for developers who write good code.
            </motion.p>

            <motion.div {...fadeUp(0.5)} className="flex gap-3 flex-wrap">
              <Link href="/dashboard"
                className="px-6 py-2.5 text-xs tracking-widest rounded-sm transition-all hover:opacity-80"
                style={{ background: "var(--text)", color: "var(--bg)", fontFamily: "inherit" }}>
                open dashboard
              </Link>
              <Link href="/create"
                className="px-6 py-2.5 text-xs tracking-widest rounded-sm transition-all"
                style={{ border: "1px solid var(--border)", color: "var(--text)", fontFamily: "inherit" }}>
                create snippet
              </Link>
            </motion.div>
          </div>

          {/* Right: Terminal */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.8 }}>
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
              {/* terminal bar */}
              <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "var(--border)" }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#e06c75" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#e5c07b" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#98c379" }} />
                <span className="ml-2 text-xs tracking-widest" style={{ color: "var(--accent)" }}>
                  devkeep ~ snippet.js
                </span>
              </div>
              {/* code body */}
              <pre className="p-5 text-xs leading-loose overflow-x-auto"
                style={{ color: "var(--accent)", fontFamily: "inherit" }}>
                {`  1  `}<span style={{ color: "var(--border)" }}> auth utility — saved 3 days ago</span>{`
  2  
  3  `}<span style={{ color: "var(--accent)", fontWeight: 500 }}>const</span>{` hashPassword = `}<span style={{ color: "var(--accent)", fontWeight: 500 }}>async</span>{` (pwd) => {
  4    `}<span style={{ color: "var(--accent)", fontWeight: 500 }}>const</span>{` salt = `}<span style={{ color: "var(--accent)", fontWeight: 500 }}>await</span>{` bcrypt.genSalt(`}<span style={{ color: "var(--accent)" }}>12</span>{`);
  5    `}<span style={{ color: "var(--accent)", fontWeight: 500 }}>return</span>{` bcrypt.hash(pwd, salt);
  6  };
  7  
  8  `}<span style={{ color: "var(--border)" }}> tags: #auth #bcrypt #utils</span>{`
  9  module.exports = { hashPassword };`}
                <span style={{ display: "inline-block", width: 8, height: "1em", background: "var(--accent)", verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />
              </pre>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 mt-4 overflow-hidden rounded-lg"
              style={{ border: "1px solid var(--border)", gap: "1px", background: "var(--border)" }}>
              {[{ ref: s1, label: "snippets" }, { ref: s2, label: "languages" }, { ref: s3, label: "tags" }].map(({ ref, label }) => (
                <div key={label} className="text-center py-4" style={{ background: "var(--card)" }}>
                  <div ref={ref} className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>0</div>
                  <div className="text-xs tracking-widest mt-0.5" style={{ color: "var(--accent)", fontSize: ".6rem" }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Language ticker */}
        <div className="relative z-10 overflow-hidden py-2.5" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex whitespace-nowrap" style={{ animation: "ticker 18s linear infinite" }}>
            {["javascript", "typescript", "python", "go", "rust", "sql", "bash", "react", "next.js", "node.js", "mongodb", "prisma",
              "javascript", "typescript", "python", "go", "rust", "sql", "bash", "react", "next.js", "node.js", "mongodb", "prisma"]
              .map((lang, i) => (
                <span key={i} className="text-xs tracking-widest px-8 opacity-60"
                  style={{ color: "var(--accent)", borderRight: "1px solid var(--border)" }}>
                  {lang}
                </span>
              ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section id="features" className="py-20 px-8 max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 text-xs tracking-widest mb-3" style={{ color: "var(--accent)" }}>
              <span style={{ display: "inline-block", width: 24, height: 1, background: "var(--accent)" }} />
              Features
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 700, lineHeight: 1.12 }}>
              Everything a developer<br />actually needs.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-xl"
            style={{ border: "1px solid var(--border)", gap: "1px", background: "var(--border)" }}>
            {[
              { n: "01", title: "Save snippets", desc: "Syntax highlighting across 20+ languages. Never lose useful code." },
              { n: "02", title: "Instant search", desc: "Find anything by title, tag, or language in milliseconds." },
              { n: "03", title: "Tag & organize", desc: "Tags like #auth, #api, #hooks. Filter your library in one click." },
              { n: "04", title: "Share publicly", desc: "Clean public links for any snippet. Perfect for teams." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="p-7 transition-colors" style={{ background: "var(--card)" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--card)"}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--border)", marginBottom: ".75rem" }}>{n}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", marginBottom: ".5rem" }}>{title}</h3>
                <p style={{ fontSize: ".7rem", lineHeight: 1.75, color: "var(--accent)", opacity: .85 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how" className="py-20 px-8 max-w-4xl mx-auto" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="mb-12">
            <div className="flex items-center gap-2 text-xs tracking-widest mb-3" style={{ color: "var(--accent)" }}>
              <span style={{ display: "inline-block", width: 24, height: 1, background: "var(--accent)" }} />
              how it works
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 700, lineHeight: 1.12 }}>
              Three steps to a<br />cleaner workflow.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              { n: "01", title: "Paste your code", desc: "Drop in any snippet. Pick the language and add a title." },
              { n: "02", title: "Tag it", desc: "Add up to 10 tags. Autocomplete keeps it fast." },
              { n: "03", title: "Find it instantly", desc: "Search, filter by language or tag, copy in one click." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="relative pl-12">
                <div style={{ position: "absolute", left: 0, top: 0, fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700, color: "var(--border)", lineHeight: 1 }}>{n}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", marginBottom: ".5rem" }}>{title}</h3>
                <p style={{ fontSize: ".7rem", lineHeight: 1.75, color: "var(--accent)", opacity: .85 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-8 pb-20 max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-xl text-center py-16 px-8"
            style={{ background: "var(--text)", color: "var(--bg)" }}>
            <div className="absolute rounded-full" style={{ width: 220, height: 220, background: "var(--accent)", opacity: .12, top: -60, right: -50 }} />
            <div className="absolute rounded-full" style={{ width: 130, height: 130, background: "var(--accent)", opacity: .10, bottom: -40, left: 30 }} />
            <h2 className="relative" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 700, marginBottom: "1rem" }}>
              Start saving your<br />
              <em style={{ fontStyle: "italic", color: "#c8a98d" }}>best snippets</em> today.
            </h2>
            <p className="relative text-xs mx-auto mb-8" style={{ opacity: .7, lineHeight: 1.85, maxWidth: "40ch" }}>
              Free to use. No credit card. Just a calmer way to manage your code.
            </p>
            <Link href="/dashboard" className="relative inline-block px-8 py-3 text-xs tracking-widest rounded transition-all hover:opacity-90"
              style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "inherit" }}>
              get started for Free 
            </Link>
          </div>
        </section>
        <ScrollToTop/>

        {/* ── FOOTER ── */}
        <footer
          id="contact"
          className="flex flex-col items-center justify-center gap-4 px-8 py-10 text-xs tracking-widest text-center"
          style={{ borderTop: "1px solid var(--border)", color: "var(--accent)" }}
        >
          {/* Brand */}
          <div className=" flex gap-2">
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1rem",
              color: "var(--text)",
              fontWeight: 700,
            }}
          >
            Dev<span style={{ color: "var(--accent)" }}>Keep</span>
          </span>
           <Image src="/favicon.ico" alt="logo" width={10} height={10} className="w-5 h-5" />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <a href="mailto:anuradhasharma71440@gmail.com" className="hover:scale-110 transition">
              <Mail size={18} />
            </a>
            <a href="https://www.linkedin.com/in/anuradha-sharmaa1/" target="_blank" className="hover:scale-110 transition">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 
  1.12 1 2.48 1s2.5 1.12 2.5 2.5zM.5 8h3.96V24H.5V8zm7.5 
  0h3.8v2.16h.05c.53-1 1.82-2.16 3.75-2.16 
  4.01 0 4.75 2.64 4.75 6.07V24h-3.96v-7.1c0-1.7-.03-3.88-2.36-3.88 
  -2.36 0-2.72 1.84-2.72 3.76V24H8V8z" />
              </svg>
            </a>
            <a href=" https://github.com/anuradhasharma1" target="_blank" className="hover:scale-110 transition">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.09.66-.22.66-.49 
  0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 
  1 .07 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.66.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.07 
  0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0112 6.8c.85.004 
  1.7.12 2.5.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.64 1.03 2.76 
  0 3.94-2.34 4.8-4.57 5.06.36.32.67.95.67 1.92 
  0 1.39-.01 2.5-.01 2.84 0 .27.16.59.67.49A10.27 10.27 0 0022 12.26C22 6.58 17.52 2 12 2z" />
              </svg>
            </a>
          </div>
          <span className="opacity-70">built with ❤️ and coffee</span>
          <span className="opacity-60">© 2026 Anuradha</span>
        </footer>

        <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes draw { to { stroke-dashoffset: 0; } }
      `}</style>
      </div>
    </>
  );
}

