"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { LANGUAGES } from "@/constants/languages";
import { SUGGESTED_TAGS } from "@/constants/tags";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

const LANG_EXT = {
  javascript: "snippet.js", typescript: "snippet.ts", python: "snippet.py",
  java: "Snippet.java", go: "snippet.go", rust: "snippet.rs", bash: "script.sh",
  sql: "query.sql", html: "index.html", css: "styles.css", json: "data.json",
  yaml: "config.yml", markdown: "README.md", cpp: "snippet.cpp",
  php: "snippet.php", ruby: "snippet.rb",
};

function Toggle({ value, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      style={{ width: 36, height: 20, borderRadius: 999, background: value ? "var(--accent)" : "var(--border)", position: "relative", cursor: "pointer", border: "none", transition: "background .2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", width: 14, height: 14, borderRadius: "50%", background: "white", top: 3, left: 3, transform: value ? "translateX(16px)" : "translateX(0)", transition: "transform .2s" }} />
    </button>
  );
}

function TagInput({ tags, onChange }) {
  const [inputVal, setInputVal] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const addTag = useCallback((tag) => {
    const clean = tag.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-.]/g, "");
    if (!clean || tags.includes(clean) || tags.length >= 10) return;
    onChange([...tags, clean]);
    setInputVal(""); setSuggestions([]);
  }, [tags, onChange]);

  const removeTag = (tag) => onChange(tags.filter(t => t !== tag));

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputVal.trim()) { e.preventDefault(); addTag(inputVal.replace(/,/g, "")); }
    if (e.key === "Backspace" && !inputVal && tags.length) onChange(tags.slice(0, -1));
  };

  const handleInput = (val) => {
    setInputVal(val);
    const q = val.toLowerCase().trim();
    setSuggestions(q ? SUGGESTED_TAGS.filter(t => t.includes(q) && !tags.includes(t)).slice(0, 6) : []);
  };

  return (
    <div style={{ position: "relative" }}>
      <div onClick={e => e.currentTarget.querySelector("input")?.focus()}
        style={{ display: "flex", flexWrap: "wrap", gap: ".35rem", minHeight: 42, padding: ".5rem .75rem", border: "1px solid var(--border)", borderRadius: 5, background: "var(--card)", cursor: "text", alignItems: "center" }}>
        {tags.map(t => (
          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: ".3rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 999, padding: "2px 10px", fontSize: ".62rem", color: "var(--accent)" }}>
            #{t}
            <button type="button" onClick={() => removeTag(t)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--accent)", fontSize: ".75rem", lineHeight: 1, padding: 0 }}>×</button>
          </span>
        ))}
        <input value={inputVal} onChange={e => handleInput(e.target.value)} onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setSuggestions([]), 150)}
          placeholder={tags.length === 0 ? "type a tag and press Enter..." : ""}
          disabled={tags.length >= 10}
          style={{ border: "none", background: "transparent", fontFamily: "'IBM Plex Mono', monospace", fontSize: ".72rem", color: "var(--text)", outline: "none", minWidth: 80, flex: 1 }} />
      </div>
      {suggestions.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, padding: ".35rem", zIndex: 10 }}>
          {suggestions.map(t => (
            <div key={t} onMouseDown={() => addTag(t)}
              style={{ padding: ".4rem .75rem", fontSize: ".7rem", color: "var(--accent)", borderRadius: 4, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>#{t}</div>
          ))}
        </div>
      )}
      <div style={{ fontSize: ".6rem", color: "var(--accent)", opacity: .5, textAlign: "right", marginTop: ".35rem" }}>{tags.length}/10 tags</div>
    </div>
  );
}

function PreviewCard({ title, description, code, language, tags, isPublic }) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 9, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".9rem 1rem .6rem" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: ".95rem", fontWeight: 700, color: title ? "var(--text)" : "var(--border)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: ".5rem" }}>
          {title || "untitled snippet"}
        </span>
        <span style={{ fontSize: ".58rem", letterSpacing: ".08em", padding: "3px 9px", borderRadius: 999, border: "1px solid var(--border)", color: "var(--accent)", textTransform: "uppercase", flexShrink: 0 }}>
          {language || "—"}
        </span>
      </div>
      {description && <div style={{ padding: "0 1rem .5rem", fontSize: ".67rem", color: "var(--accent)", opacity: .8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{description}</div>}
      <pre style={{ margin: ".25rem 1rem .9rem", background: "var(--bg)", borderRadius: 5, padding: ".85rem 1rem", border: "1px solid var(--border)", fontSize: ".65rem", lineHeight: 1.75, color: "var(--accent)", minHeight: 70, whiteSpace: "pre-wrap", overflow: "hidden", maxHeight: 140, fontFamily: "'IBM Plex Mono', monospace" }}>
        {code.slice(0, 200) || "// your code will appear here"}{code.length > 200 && "..."}
      </pre>
      {tags.length > 0 && (
        <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap", padding: ".5rem 1rem .75rem" }}>
          {tags.map(t => <span key={t} style={{ fontSize: ".58rem", padding: "2px 8px", borderRadius: 999, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--accent)" }}>#{t}</span>)}
        </div>
      )}
      <div style={{ fontSize: ".58rem", color: "var(--accent)", opacity: .5, padding: ".35rem 1rem .65rem", borderTop: "1px solid var(--border)" }}>
        {isPublic ? "🌐 public" : "🔒 private"} · just now
      </div>
    </div>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontSize: ".65rem", letterSpacing: ".14em", color: "var(--accent)", marginBottom: ".5rem" }}>
        {label} {hint && <span style={{ opacity: .5 }}>{hint}</span>}
      </label>
      {children}
      {error && <div style={{ fontSize: ".65rem", color: "#e06c75", marginTop: ".35rem" }}>{error}</div>}
    </div>
  );
}

export default function CreatePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: ".8rem", color: "var(--accent)" }}>loading...</div>
  );
  if (!session) return null;

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "title is required";
    if (!language) e.language = "please select a language";
    if (!code.trim()) e.code = "code cannot be empty";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/snippets", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), code: code.trim(), language, tags, isPublic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSaved(true);
      setTimeout(() => router.push("/dashboard"), 800);
    } catch (err) {
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const inp = (hasError) => ({
    width: "100%", padding: ".65rem .85rem", border: `1px solid ${hasError ? "#e06c75" : "var(--border)"}`,
    borderRadius: 5, background: "var(--card)", fontFamily: "'IBM Plex Mono', monospace",
    fontSize: ".75rem", color: "var(--text)", outline: "none", transition: "border-color .2s", letterSpacing: ".03em",
  });

  const codeLines = code ? code.split("\n").length : 0;

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'IBM Plex Mono', monospace", minHeight: "100vh", position: "relative" }}>

      {/* Grid bg */}
      <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: .1 }}
        viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
        <style>{`.gl{stroke:var(--accent);stroke-width:.5;fill:none;stroke-dasharray:1;stroke-dashoffset:1;animation:draw 2.5s ease forwards}@keyframes draw{to{stroke-dashoffset:0}}`}</style>
        {[[0,175,1000,175,.1],[0,350,1000,350,.25],[0,525,1000,525,.4],[200,0,200,700,.55],[500,0,500,700,.7],[800,0,800,700,.85]]
          .map(([x1,y1,x2,y2,d],i)=><line key={i} className="gl" x1={x1} y1={y1} x2={x2} y2={y2} style={{animationDelay:`${d}s`}}/>)}
        <circle cx="500" cy="350" r="200" fill="var(--accent)" fillOpacity=".06" stroke="var(--accent)" strokeWidth=".5"
          style={{strokeDasharray:1260,strokeDashoffset:1260,animation:"draw 3s 1s ease forwards"}}/>
      </svg>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1.25rem" }}>

        {/* ── DESKTOP: 2 column ── */}
        <div className="desktop-layout">
          <form onSubmit={handleSubmit}>
            <motion.div {...fadeUp(0)} style={{ marginBottom: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".62rem", letterSpacing: ".18em", color: "var(--accent)", marginBottom: ".6rem" }}>
                <span style={{ display: "inline-block", width: 20, height: 1, background: "var(--accent)" }} />new snippet
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 700, lineHeight: 1.1 }}>
                Save something<br/><em style={{ fontStyle: "italic", color: "var(--accent)" }}>worth keeping.</em>
              </h1>
            </motion.div>

            <Field label="title *" error={errors.title}>
              <input value={title} onChange={e=>{setTitle(e.target.value);setErrors(p=>({...p,title:""}));}}
                placeholder="e.g. Hash password with bcrypt" maxLength={100} style={inp(errors.title)}
                onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor=errors.title?"#e06c75":"var(--border)"}/>
              <div style={{fontSize:".6rem",color:"var(--accent)",opacity:.5,textAlign:"right",marginTop:".35rem"}}>{title.length}/100</div>
            </Field>

            <Field label="description" hint="(optional)">
              <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="What does this snippet do?" maxLength={500} style={inp(false)}
                onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
            </Field>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.25rem"}}>
              <Field label="language *" error={errors.language}>
                <select value={language} onChange={e=>{setLanguage(e.target.value);setErrors(p=>({...p,language:""}));}} style={{...inp(errors.language),cursor:"pointer"}}>
                  <option value="">select language</option>
                  {LANGUAGES.map(l=><option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </Field>
              <Field label="visibility">
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".75rem 1rem",background:"var(--card)",border:"1px solid var(--border)",borderRadius:7}}>
                  <div>
                    <div style={{fontSize:".72rem",color:"var(--text)"}}>{isPublic?"Public":"Private"}</div>
                    <div style={{fontSize:".6rem",color:"var(--accent)",opacity:.7,marginTop:".1rem"}}>{isPublic?"anyone with link":"only you"}</div>
                  </div>
                  <Toggle value={isPublic} onChange={setIsPublic}/>
                </div>
              </Field>
            </div>

            <Field label="tags" hint="(max 10)"><TagInput tags={tags} onChange={setTags}/></Field>

            <Field label="code *" error={errors.code}>
              <div style={{border:`1px solid ${errors.code?"#e06c75":"var(--border)"}`,borderRadius:8,overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".55rem 1rem",background:"var(--border)"}}>
                  <div style={{display:"flex",gap:".35rem"}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:"#e06c75"}}/>
                    <div style={{width:10,height:10,borderRadius:"50%",background:"#e5c07b"}}/>
                    <div style={{width:10,height:10,borderRadius:"50%",background:"#98c379"}}/>
                  </div>
                  <span style={{fontSize:".62rem",letterSpacing:".08em",color:"var(--accent)"}}>{LANG_EXT[language]||"snippet.js"}</span>
                  <button type="button" onClick={()=>setCode("")} style={{fontSize:".62rem",color:"var(--accent)",background:"transparent",border:"none",cursor:"pointer",opacity:.7}}>clear</button>
                </div>
                <textarea value={code} onChange={e=>{setCode(e.target.value);setErrors(p=>({...p,code:""}));}}
                  placeholder="// paste your code here..." spellCheck={false}
                  style={{width:"100%",minHeight:280,padding:"1rem",border:"none",background:"var(--bg)",fontFamily:"'IBM Plex Mono',monospace",fontSize:".73rem",lineHeight:1.85,color:"var(--accent)",outline:"none",resize:"vertical"}}/>
              </div>
              <div style={{fontSize:".6rem",color:"var(--accent)",opacity:.5,textAlign:"right",marginTop:".35rem"}}>{codeLines} line{codeLines!==1?"s":""}</div>
            </Field>

            {errors.submit&&<div style={{fontSize:".7rem",color:"#e06c75",marginBottom:"1rem",padding:".75rem 1rem",border:"1px solid #e06c75",borderRadius:5,background:"rgba(224,108,117,.08)"}}>{errors.submit}</div>}

            <div style={{display:"flex",flexDirection:"column",gap:".6rem"}}>
              <button type="submit" disabled={submitting||saved}
                style={{width:"100%",padding:".9rem",background:saved?"var(--accent)":"var(--text)",color:"var(--bg)",border:"none",borderRadius:5,fontFamily:"'IBM Plex Mono',monospace",fontSize:".78rem",letterSpacing:".1em",cursor:submitting||saved?"default":"pointer",transition:"background .2s",opacity:submitting?.7:1}}>
                {saved?"saved! redirecting...":submitting?"saving...":"save snippet →"}
              </button>
              <Link href="/dashboard" style={{display:"block",width:"100%",padding:".8rem",background:"transparent",color:"var(--accent)",border:"1px solid var(--border)",borderRadius:5,fontFamily:"'IBM Plex Mono',monospace",fontSize:".75rem",letterSpacing:".08em",textAlign:"center",textDecoration:"none"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                cancel
              </Link>
            </div>
          </form>

          {/* Right col */}
          <div style={{position:"sticky",top:70,display:"flex",flexDirection:"column",gap:"1.25rem"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:".6rem",fontSize:".62rem",letterSpacing:".18em",color:"var(--accent)",marginBottom:".75rem"}}>
                <span style={{display:"inline-block",width:20,height:1,background:"var(--accent)"}}/>live preview
              </div>
              <PreviewCard title={title} description={description} code={code} language={language} tags={tags} isPublic={isPublic}/>
            </div>
            <div style={{padding:"1.25rem",border:"1px solid var(--border)",borderRadius:8,background:"var(--card)"}}>
              <div style={{display:"flex",alignItems:"center",gap:".6rem",fontSize:".62rem",letterSpacing:".18em",color:"var(--accent)",marginBottom:".9rem"}}>
                <span style={{display:"inline-block",width:20,height:1,background:"var(--accent)"}}/>tips
              </div>
              {["Add descriptive tags so you can find snippets fast later.","Keep titles short — \"JWT verify\" beats \"auth stuff\".","Public snippets get a shareable link for teammates."].map((tip,i)=>(
                <div key={i} style={{display:"flex",gap:".6rem",fontSize:".67rem",color:"var(--accent)",opacity:.85,lineHeight:1.65,marginBottom:i<2?".75rem":0}}>
                  <span style={{flexShrink:0,opacity:.5}}>0{i+1}</span>{tip}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MOBILE: single column ── */}
        <div className="mobile-layout">
          {/* small pill toggle */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",fontWeight:700}}>
              Save something <em style={{color:"var(--accent)"}}>worth keeping.</em>
            </div>
            <button onClick={()=>setShowPreview(p=>!p)}
              style={{padding:"5px 12px",background:showPreview?"var(--accent)":"var(--card)",color:showPreview?"var(--bg)":"var(--accent)",border:"1px solid var(--border)",borderRadius:999,fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",cursor:"pointer",letterSpacing:".06em",whiteSpace:"nowrap",flexShrink:0,marginLeft:".75rem",transition:"all .2s"}}>
              {showPreview?"← form":"preview"}
            </button>
          </div>

          {/* Mobile form */}
          {!showPreview && (
            <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:0}}>
              <Field label="title *" error={errors.title}>
                <input value={title} onChange={e=>{setTitle(e.target.value);setErrors(p=>({...p,title:""}));}}
                  placeholder="e.g. Hash password with bcrypt" maxLength={100} style={inp(errors.title)}
                  onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor=errors.title?"#e06c75":"var(--border)"}/>
                <div style={{fontSize:".6rem",color:"var(--accent)",opacity:.5,textAlign:"right",marginTop:".25rem"}}>{title.length}/100</div>
              </Field>
              <Field label="description" hint="(optional)">
                <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="What does this snippet do?" maxLength={500} style={inp(false)}
                  onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
              </Field>
              <Field label="language *" error={errors.language}>
                <select value={language} onChange={e=>{setLanguage(e.target.value);setErrors(p=>({...p,language:""}));}} style={{...inp(errors.language),cursor:"pointer"}}>
                  <option value="">select language</option>
                  {LANGUAGES.map(l=><option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </Field>
              <Field label="visibility">
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".65rem 1rem",background:"var(--card)",border:"1px solid var(--border)",borderRadius:7}}>
                  <span style={{fontSize:".72rem",color:"var(--text)"}}>{isPublic?"Public — anyone with link":"Private — only you"}</span>
                  <Toggle value={isPublic} onChange={setIsPublic}/>
                </div>
              </Field>
              <Field label="tags" hint="(max 10)"><TagInput tags={tags} onChange={setTags}/></Field>
              <Field label="code *" error={errors.code}>
                <div style={{border:`1px solid ${errors.code?"#e06c75":"var(--border)"}`,borderRadius:8,overflow:"hidden"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".5rem .75rem",background:"var(--border)"}}>
                    <div style={{display:"flex",gap:".3rem"}}>
                      <div style={{width:9,height:9,borderRadius:"50%",background:"#e06c75"}}/>
                      <div style={{width:9,height:9,borderRadius:"50%",background:"#e5c07b"}}/>
                      <div style={{width:9,height:9,borderRadius:"50%",background:"#98c379"}}/>
                    </div>
                    <span style={{fontSize:".6rem",color:"var(--accent)"}}>{LANG_EXT[language]||"snippet.js"}</span>
                    <button type="button" onClick={()=>setCode("")} style={{fontSize:".6rem",color:"var(--accent)",background:"transparent",border:"none",cursor:"pointer",opacity:.7}}>clear</button>
                  </div>
                  <textarea value={code} onChange={e=>{setCode(e.target.value);setErrors(p=>({...p,code:""}));}}
                    placeholder="// paste your code here..." spellCheck={false}
                    style={{width:"100%",minHeight:200,padding:".75rem",border:"none",background:"var(--bg)",fontFamily:"'IBM Plex Mono',monospace",fontSize:".72rem",lineHeight:1.8,color:"var(--accent)",outline:"none",resize:"vertical"}}/>
                </div>
                <div style={{fontSize:".6rem",color:"var(--accent)",opacity:.5,textAlign:"right",marginTop:".25rem"}}>{codeLines} lines</div>
              </Field>
              {errors.submit&&<div style={{fontSize:".7rem",color:"#e06c75",marginBottom:"1rem",padding:".7rem .9rem",border:"1px solid #e06c75",borderRadius:5,background:"rgba(224,108,117,.08)"}}>{errors.submit}</div>}
              <div style={{display:"flex",flexDirection:"column",gap:".5rem",marginTop:".25rem"}}>
                <button type="submit" disabled={submitting||saved}
                  style={{width:"100%",padding:".85rem",background:saved?"var(--accent)":"var(--text)",color:"var(--bg)",border:"none",borderRadius:5,fontFamily:"'IBM Plex Mono',monospace",fontSize:".75rem",letterSpacing:".1em",cursor:submitting||saved?"default":"pointer",transition:"background .2s"}}>
                  {saved?"saved! redirecting...":submitting?"saving...":"save snippet →"}
                </button>
                <Link href="/dashboard" style={{display:"block",width:"100%",padding:".75rem",background:"transparent",color:"var(--accent)",border:"1px solid var(--border)",borderRadius:5,fontFamily:"'IBM Plex Mono',monospace",fontSize:".72rem",letterSpacing:".08em",textAlign:"center",textDecoration:"none"}}>
                  cancel
                </Link>
              </div>
            </form>
          )}

          {/* Mobile preview */}
          {showPreview && (
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              <PreviewCard title={title} description={description} code={code} language={language} tags={tags} isPublic={isPublic}/>
              <div style={{padding:"1rem",border:"1px solid var(--border)",borderRadius:8,background:"var(--card)"}}>
                <div style={{fontSize:".6rem",letterSpacing:".16em",color:"var(--accent)",marginBottom:".75rem",display:"flex",alignItems:"center",gap:".5rem"}}>
                  <span style={{display:"inline-block",width:16,height:1,background:"var(--accent)"}}/>tips
                </div>
                {["Add tags to find snippets fast.","Short specific titles work best.","Public snippets get a shareable link."].map((tip,i)=>(
                  <div key={i} style={{display:"flex",gap:".5rem",fontSize:".65rem",color:"var(--accent)",opacity:.8,lineHeight:1.65,marginBottom:i<2?".6rem":0}}>
                    <span style={{flexShrink:0,opacity:.5}}>0{i+1}</span>{tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes draw { to { stroke-dashoffset: 0; } }
        input::placeholder, textarea::placeholder { color: var(--accent); opacity: .45; }
        select option { background: var(--card); color: var(--text); }

        .desktop-layout { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; align-items: start; }
        .mobile-layout { display: none; }

        @media (max-width: 768px) {
          .desktop-layout { display: none; }
          .mobile-layout { display: block; }
        }
      `}</style>
    </div>
  );
}