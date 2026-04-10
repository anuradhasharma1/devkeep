"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/UseAuth";
import { useSnippets } from "@/hooks/UseSnippets";
import { copyToClipboard } from "@/utils/copyToclipboard";
import { formatDate } from "@/utils/formatDate";
import { LANGUAGES } from "@/constants/languages";
import { SUGGESTED_TAGS } from "@/constants/tags";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: "easeOut" },
});

//  Snippet Card 
function SnippetCard({ snippet, view, onCopy, onDelete, index }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await copyToClipboard(snippet.code);
        setCopied(true);
        onCopy?.();
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            {...fadeUp(index * 0.06)}
            className="group"
            style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 9,
                overflow: "hidden",
                cursor: "pointer",
                transition: "border-color .2s, transform .15s",
            }}
            whileHover={{ y: -2, borderColor: "var(--accent)" }}
        >
            {/* header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".9rem 1rem .6rem" }}>
                <Link href={`/snippet/${snippet._id}`}
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: ".95rem", fontWeight: 700, color: "var(--text)", textDecoration: "none" }}>
                    {snippet.title}
                </Link>
                <span style={{ fontSize: ".58rem", letterSpacing: ".08em", padding: "3px 9px", borderRadius: 999, border: "1px solid var(--border)", color: "var(--accent)", textTransform: "uppercase" }}>
                    {snippet.language}
                </span>
            </div>

            {/* desc */}
            {snippet.description && (
                <div style={{ padding: "0 1rem .6rem", fontSize: ".67rem", color: "var(--accent)", opacity: .8, lineHeight: 1.65, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {snippet.description}
                </div>
            )}

            {/* code preview */}
            <div style={{ margin: "0 1rem .9rem", background: "var(--bg)", borderRadius: 5, padding: ".75rem", border: "1px solid var(--border)", fontSize: ".65rem", lineHeight: 1.7, color: "var(--accent)", overflow: "hidden", maxHeight: 80, position: "relative" }}>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                    {snippet.code.slice(0, 120)}{snippet.code.length > 120 ? "..." : ""}
                </pre>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 24, background: "linear-gradient(transparent, var(--bg))" }} />
            </div>

            {/* footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".5rem 1rem .75rem" }}>
                <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
                    {snippet.tags.map(t => (
                        <span key={t} style={{ fontSize: ".58rem", padding: "2px 8px", borderRadius: 999, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--accent)" }}>
                            #{t}
                        </span>
                    ))}
                </div>
                <div style={{ display: "flex", gap: ".5rem" }}>
                    {/* copy */}
                    <button onClick={handleCopy} title="copy" style={{ padding: 5, border: "none", background: "transparent", cursor: "pointer", color: copied ? "#98c379" : "var(--accent)", borderRadius: 4, transition: "background .15s", display: "flex" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--border)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {copied
                                ? <><polyline points="20 6 9 17 4 12" /></>
                                : <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></>}
                        </svg>
                    </button>
                    {/* public/private */}
                    <span title={snippet.isPublic ? "public" : "private"} style={{ padding: 5, color: "var(--accent)", display: "flex", alignItems: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {snippet.isPublic
                                ? <><circle cx="12" cy="12" r="3" /><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /></>
                                : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" /></>}
                        </svg>
                    </span>
                    {/* edit */}
                    <Link href={`/edit/${snippet._id}`} title="edit" style={{ padding: 5, color: "var(--accent)", display: "flex", borderRadius: 4, transition: "background .15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--border)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </Link>
                    {/* delete */}
                    <button onClick={() => onDelete(snippet._id)} title="delete"
                        style={{ padding: 5, border: "none", background: "transparent", cursor: "pointer", color: "var(--accent)", borderRadius: 4, transition: "background .15s", display: "flex" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--border)"; e.currentTarget.style.color = "#e06c75"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent)"; }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6m4-6v6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* date strip */}
            <div style={{ fontSize: ".58rem", color: "var(--accent)", opacity: .5, padding: ".35rem 1rem .7rem", borderTop: "1px solid var(--border)" }}>
                {snippet.isPublic ? "🌐 public" : "🔒 private"} · saved {formatDate(snippet.createdAt)}
            </div>
        </motion.div>
    );
}

//  Dashboard 
export default function Dashboard() {
    const router = useRouter();
    const { user, loading: authLoading, logout } = useAuth();
    const { snippets, loading, deleteSnippet } = useSnippets();

    const [search, setSearch] = useState("");
    const [langFilter, setLangFilter] = useState("");
    const [tagFilter, setTagFilter] = useState("");
    const [publicFilter, setPublicFilter] = useState("all"); // all | public | private
    const [sort, setSort] = useState("newest");
    const [view, setView] = useState("grid"); // grid | list
    const [toast, setToast] = useState(false);
    const [sidebarFilter, setSidebarFilter] = useState("all");

    useEffect(() => {
        if (!authLoading) {
            if (!user) router.push("/");
        }
    }, [user, authLoading, router]);


    const filtered = snippets
        .filter(s => {
            const q = search.toLowerCase();
            const matchQ = !q || s.title.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
                || s.language.toLowerCase().includes(q) || s.tags.some(t => t.includes(q));
            const matchLang = !langFilter || s.language === langFilter;
            const matchTag = !tagFilter || s.tags.includes(tagFilter);
            const matchPublic = publicFilter === "all" || (publicFilter === "public" && s.isPublic) || (publicFilter === "private" && !s.isPublic);
            return matchQ && matchLang && matchTag && matchPublic;
        })
        .sort((a, b) => {
            if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
            if (sort === "az") return a.title.localeCompare(b.title);
            return 0;
        });

    const showToast = () => { setToast(true); setTimeout(() => setToast(false), 2000); };

    const handleDelete = async (id) => {
        if (!confirm("Delete this snippet?")) return;
        await deleteSnippet(id);
    };

    const eyebrow = (label) => (
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".6rem", letterSpacing: ".18em", color: "var(--accent)", marginBottom: ".4rem" }}>
            <span style={{ display: "inline-block", width: 20, height: 1, background: "var(--accent)" }} />
            {label}
        </div>
    );

    const sidebarBtn = (label, key, onClick) => (
        <button key={key} onClick={onClick}
            style={{
                display: "flex", alignItems: "center", gap: ".6rem", padding: ".55rem .75rem",
                borderRadius: 4, fontSize: ".72rem", color: sidebarFilter === key ? "var(--bg)" : "var(--accent)",
                cursor: "pointer", border: "none", background: sidebarFilter === key ? "var(--text)" : "transparent",
                fontFamily: "'IBM Plex Mono', monospace", width: "100%", textAlign: "left",
                transition: "all .15s", letterSpacing: ".04em",
            }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: sidebarFilter === key ? "var(--bg)" : "var(--accent)", flexShrink: 0 }} />
            {label}
        </button>
    );

    if (authLoading) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", fontFamily: "'IBM Plex Mono', monospace", fontSize: ".8rem", color: "var(--accent)" }}>
            loading vault...
        </div>
    );

    return (
        <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'IBM Plex Mono', monospace", minHeight: "100vh", position: "relative" }}>

            {/* Grid bg */}
            <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: .12 }}
                viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
                <style>{`.gl{stroke:var(--accent);stroke-width:.5;fill:none;stroke-dasharray:1;stroke-dashoffset:1;animation:draw 2.5s ease forwards}@keyframes draw{to{stroke-dashoffset:0}}`}</style>
                {[[0, 175, 1000, 175, .1], [0, 350, 1000, 350, .25], [0, 525, 1000, 525, .4], [200, 0, 200, 700, .55], [500, 0, 500, 700, .7], [800, 0, 800, 700, .85]]
                    .map(([x1, y1, x2, y2, d], i) => <line key={i} className="gl" x1={x1} y1={y1} x2={x2} y2={y2} style={{ animationDelay: `${d}s` }} />)}
                <circle cx="500" cy="350" r="200" fill="var(--accent)" fillOpacity=".06" stroke="var(--accent)" strokeWidth=".5" style={{ strokeDasharray: 1260, strokeDashoffset: 1260, animation: "draw 3s 1s ease forwards" }} />
                <circle cx="500" cy="350" r="320" fill="var(--accent)" fillOpacity=".03" stroke="var(--accent)" strokeWidth=".5" style={{ strokeDasharray: 2010, strokeDashoffset: 2010, animation: "draw 3.5s 1.2s ease forwards", opacity: .5 }} />
            </svg>


            {/* ── Body ── */}
            <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "220px 1fr" }}>

                {/* ── Sidebar ── */}
                <aside style={{ borderRight: "1px solid var(--border)", padding: "1.5rem 1.25rem", display: "flex", flexDirection: "column", gap: ".25rem", minHeight: "calc(100vh - 53px)", position: "sticky", top: 53, alignSelf: "start" }}>
                    {eyebrow("library")}
                    {sidebarBtn("all snippets", "all", () => { setSidebarFilter("all"); setPublicFilter("all"); setLangFilter(""); setTagFilter(""); })}
                    {sidebarBtn("public", "public", () => { setSidebarFilter("public"); setPublicFilter("public"); })}
                    {sidebarBtn("private", "private", () => { setSidebarFilter("private"); setPublicFilter("private"); })}

                    <div style={{ height: 1, background: "var(--border)", margin: ".75rem 0" }} />
                    {eyebrow("languages")}
                    {LANGUAGES.slice(0, 6).map(l =>
                        sidebarBtn(l.label.toLowerCase(), `lang-${l.value}`, () => {
                            setSidebarFilter(`lang-${l.value}`);
                            setLangFilter(l.value);
                            setPublicFilter("all");
                            setTagFilter("");
                        })
                    )}

                    <div style={{ height: 1, background: "var(--border)", margin: ".75rem 0" }} />
                    {eyebrow("tags")}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {SUGGESTED_TAGS.slice(0, 8).map(t => (
                            <button key={t} onClick={() => { setTagFilter(tagFilter === t ? "" : t); setSidebarFilter(tagFilter === t ? "all" : `tag-${t}`); }}
                                style={{ fontSize: ".6rem", padding: "3px 10px", borderRadius: 999, cursor: "pointer", border: "1px solid var(--border)", fontFamily: "'IBM Plex Mono', monospace", transition: "all .15s", margin: 2, background: tagFilter === t ? "var(--accent)" : "transparent", color: tagFilter === t ? "var(--bg)" : "var(--accent)", borderColor: tagFilter === t ? "var(--accent)" : "var(--border)" }}>
                                #{t}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* ── Main ── */}
                <main style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                    {/* Search row */}
                    <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
                        <div style={{ position: "relative", flex: 1 }}>
                            <svg style={{ position: "absolute", left: ".75rem", top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--accent)", opacity: .6 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="7" /><line x1="16" y1="16" x2="22" y2="22" />
                            </svg>
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="search snippets by title, tag, language..."
                                style={{ width: "100%", padding: ".6rem .75rem .6rem 2.25rem", border: "1px solid var(--border)", borderRadius: 5, background: "var(--card)", fontFamily: "'IBM Plex Mono', monospace", fontSize: ".72rem", color: "var(--text)", outline: "none", letterSpacing: ".03em" }}
                                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                                onBlur={e => e.target.style.borderColor = "var(--border)"}
                            />
                        </div>
                        <select value={sort} onChange={e => setSort(e.target.value)}
                            style={{ padding: ".6rem .9rem", border: "1px solid var(--border)", borderRadius: 5, background: "var(--card)", fontFamily: "'IBM Plex Mono', monospace", fontSize: ".7rem", color: "var(--accent)", outline: "none", cursor: "pointer" }}>
                            <option value="newest">newest first</option>
                            <option value="oldest">oldest first</option>
                            <option value="az">a → z</option>
                        </select>
                        <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 5, overflow: "hidden" }}>
                            {["grid", "list"].map(v => (
                                <button key={v} onClick={() => setView(v)}
                                    style={{ padding: ".55rem .75rem", background: view === v ? "var(--text)" : "transparent", border: "none", cursor: "pointer", color: view === v ? "var(--bg)" : "var(--accent)", transition: "background .15s", fontSize: ".75rem" }}>
                                    {v === "grid" ? "⊞" : "☰"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stats strip */}
                    <div style={{ display: "flex", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: 7, overflow: "hidden" }}>
                        {[
                            { n: snippets.length, l: "total snippets" },
                            { n: [...new Set(snippets.map(s => s.language))].length, l: "languages" },
                            { n: snippets.filter(s => s.isPublic).length, l: "public" },
                            { n: [...new Set(snippets.flatMap(s => s.tags))].length, l: "tags used" },
                        ].map(({ n, l }) => (
                            <div key={l} style={{ flex: 1, background: "var(--card)", padding: ".9rem 1rem", textAlign: "center" }}>
                                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>{n}</div>
                                <div style={{ fontSize: ".58rem", letterSpacing: ".12em", color: "var(--accent)", opacity: .75, marginTop: ".1rem" }}>{l}</div>
                            </div>
                        ))}
                    </div>

                    {/* Section label */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".65rem", letterSpacing: ".14em", color: "var(--accent)" }}>
                            <span style={{ display: "inline-block", width: 20, height: 1, background: "var(--accent)" }} />
                            {tagFilter ? `#${tagFilter}` : langFilter ? `${langFilter} snippets` : `${publicFilter === "all" ? "all" : publicFilter} snippets`}
                        </div>
                        <span style={{ fontSize: ".65rem", color: "var(--accent)", opacity: .6 }}>
                            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Cards */}
                    {loading ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 9, padding: "1.25rem", height: 200, animation: "pulse 1.5s ease-in-out infinite" }} />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--accent)", opacity: .6 }}>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: ".5rem" }}>no snippets found</div>
                            <div style={{ fontSize: ".7rem" }}>
                                {snippets.length === 0
                                    ? <Link href="/create" style={{ color: "var(--accent)" }}>create your first snippet →</Link>
                                    : "try a different search or filter"}
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: view === "grid" ? "grid" : "flex", gridTemplateColumns: view === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : undefined, flexDirection: view === "list" ? "column" : undefined, gap: "1rem" }}>
                            {filtered.map((s, i) => (
                                <SnippetCard key={s._id} snippet={s} view={view} onCopy={showToast} onDelete={handleDelete} index={i} />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Toast */}
            <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", background: "var(--text)", color: "var(--bg)", padding: ".6rem 1.25rem", borderRadius: 5, fontSize: ".7rem", letterSpacing: ".06em", zIndex: 999, opacity: toast ? 1 : 0, transition: "opacity .3s", pointerEvents: "none" }}>
                copied to clipboard
            </div>

            <style>{`
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>
        </div>
    );
}