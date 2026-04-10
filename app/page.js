"use client"
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

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
          style={{ opacity: 0.15 }}>
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
              strokeDasharray: 1260, strokeDashoffset: 1260,
              animation: "draw 3s 1s ease forwards"
            }} />
          <circle className="gl" cx="500" cy="350" r="320" style={{
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

        <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes draw { to { stroke-dashoffset: 0; } }
      `}</style>
      </div>
    </>
  );
}

