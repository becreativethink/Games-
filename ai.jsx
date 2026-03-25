import { useState, useRef, useEffect, useCallback } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const HF_MODEL = "Qwen/Qwen2.5-7B-Instruct";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}/v1/chat/completions`;

const PLANNER_SYSTEM = `You are a senior software architect and AI planning agent.
Your ONLY job is to analyze a user prompt and return a structured JSON plan.

Return ONLY valid JSON, no markdown fences, no explanation.

For NEW projects:
{"action":"generate","description":"Brief description","sections_plan":[{"id":"unique_snake_case_id","file":"index.html","description":"What this section contains"}]}

file must be exactly one of: "index.html", "style.css", "script.js"

For EDITS to existing projects:
{"action":"edit","target_sections":["section_id_1"],"changes":"Precise description of what to change","description":"Summary of the edit"}

Rules:
- Section IDs: snake_case, descriptive, globally unique (e.g. navbar_html, hero_css, counter_js)
- For edits, only list sections that actually need to change
- Return ONLY the raw JSON object — nothing else`;

const EXECUTOR_SYSTEM = `You are a senior full-stack developer and code generation engine.
Generate clean, production-quality HTML/CSS/JS with SECTION_ID markers.

SECTION_ID FORMAT:
HTML:  <!-- SECTION_ID: {id} START --> ... <!-- SECTION_ID: {id} END -->
CSS:   /* SECTION_ID: {id} START */ ... /* SECTION_ID: {id} END */
JS:    // SECTION_ID: {id} START
       ...
       // SECTION_ID: {id} END

For NEW projects — output all 3 files using FILE MARKERS exactly:
===FILE: index.html===
(full html content)
===FILE: style.css===
(full css content)
===FILE: script.js===
(full js content)

For EDITS — output ONLY the modified section block(s) with SECTION_ID markers.

RULES:
1. Every line of code must be inside a SECTION_ID block
2. Section IDs must match the plan exactly
3. Generate beautiful, modern, functional code
4. Never remove or modify sections not listed as targets
5. No explanation text — only raw code output`;

// ─── HF CALLER ───────────────────────────────────────────────────────────────
async function callHF(token, systemPrompt, userMessage, maxTokens = 2800) {
  const res = await fetch(HF_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      model: HF_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
      stream: false,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 401) throw new Error("Invalid Hugging Face token — check ⚙️ Settings.");
    if (res.status === 403) throw new Error("Access denied. Ensure your token has Inference API access.");
    if (res.status === 503) throw new Error("Model is loading on HF servers. Wait ~20s and retry.");
    throw new Error(`HF API ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ─── CODE HELPERS ─────────────────────────────────────────────────────────────
function parseFiles(raw) {
  const files = { "index.html": "", "style.css": "", "script.js": "" };
  const rx = /===FILE:\s*([\w.]+)===\n([\s\S]*?)(?====FILE:|$)/g;
  let m;
  while ((m = rx.exec(raw)) !== null) {
    const name = m[1].trim();
    if (Object.prototype.hasOwnProperty.call(files, name)) files[name] = m[2].trim();
  }
  // Fallback: if model forgot markers but returned HTML
  if (!files["index.html"] && raw.includes("<html")) {
    const h = raw.match(/<html[\s\S]*<\/html>/i);
    if (h) files["index.html"] = h[0];
  }
  return files;
}

function extractSections(content, file) {
  const out = {};
  let rx;
  if (file === "index.html")
    rx = /<!--\s*SECTION_ID:\s*(\S+)\s*START\s*-->([\s\S]*?)<!--\s*SECTION_ID:\s*\1\s*END\s*-->/g;
  else if (file === "style.css")
    rx = /\/\*\s*SECTION_ID:\s*(\S+)\s*START\s*\*\/([\s\S]*?)\/\*\s*SECTION_ID:\s*\1\s*END\s*\*\//g;
  else
    rx = /\/\/\s*SECTION_ID:\s*(\S+)\s*START([\s\S]*?)\/\/\s*SECTION_ID:\s*\1\s*END/g;
  let m;
  while ((m = rx.exec(content)) !== null) out[m[1]] = m[2].trim();
  return out;
}

function replaceSection(content, id, newBody, file) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let start, end;
  if (file === "index.html") { start = `<!-- SECTION_ID: ${id} START -->`; end = `<!-- SECTION_ID: ${id} END -->`; }
  else if (file === "style.css") { start = `/* SECTION_ID: ${id} START */`; end = `/* SECTION_ID: ${id} END */`; }
  else { start = `// SECTION_ID: ${id} START`; end = `// SECTION_ID: ${id} END`; }
  const pat = new RegExp(esc(start) + "[\\s\\S]*?" + esc(end), "g");
  return content.replace(pat, `${start}\n${newBody}\n${end}`);
}

function buildSectionsJson(files, plan) {
  const db = { sections: [] };
  Object.entries(files).forEach(([fname, content]) => {
    Object.keys(extractSections(content, fname)).forEach((id) => {
      const meta = plan?.find((s) => s.id === id);
      db.sections.push({ id, file: fname, description: meta?.description || id.replace(/_/g, " ") });
    });
  });
  return db;
}

function buildPreview(files) {
  let html = files["index.html"] || "<html><body style='font-family:sans-serif;padding:2rem'><p>No content yet.</p></body></html>";
  const css = files["style.css"] || "";
  const js = files["script.js"] || "";
  html = html.replace("</head>", `<style>${css}</style></head>`);
  html = html.replace("</body>", `<script>${js}<\/script></body>`);
  return html;
}

function tryParseJson(raw) {
  const clean = raw.replace(/```json|```/g, "").trim();
  try { return JSON.parse(clean); } catch { /* fall through */ }
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) try { return JSON.parse(m[0]); } catch { /* fall through */ }
  return null;
}

// ─── SETTINGS MODAL ──────────────────────────────────────────────────────────
function SettingsModal({ colors, hfToken, onSave, onClose }) {
  const [tok, setTok] = useState(hfToken);
  const [show, setShow] = useState(false);

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)" }}>
      <div style={{ background:colors.surface, border:`1px solid ${colors.border}`, borderRadius:18, padding:28, width:480, maxWidth:"94vw", boxShadow:"0 32px 80px rgba(0,0,0,0.6)" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:18, color:colors.text, marginBottom:4 }}>⚙️ Settings</div>
            <div style={{ fontSize:11, color:colors.textMuted }}>Configure your AI model and API credentials</div>
          </div>
          <button onClick={onClose} style={{ background:colors.surfaceAlt, border:`1px solid ${colors.border}`, color:colors.textMuted, borderRadius:8, width:32, height:32, fontSize:17, lineHeight:1 }}>×</button>
        </div>

        {/* Model info */}
        <div style={{ background:colors.accentGlow, border:`1px solid ${colors.accent}35`, borderRadius:12, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:26 }}>🤗</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:colors.accent, fontFamily:"monospace" }}>Qwen/Qwen2.5-7B-Instruct</div>
            <div style={{ fontSize:10, color:colors.textMuted, marginTop:3 }}>Hugging Face Inference API · Chat Completions endpoint</div>
          </div>
          <div style={{ fontSize:9, background:colors.green+"22", color:colors.green, border:`1px solid ${colors.green}40`, borderRadius:5, padding:"3px 8px", fontWeight:700 }}>ACTIVE</div>
        </div>

        {/* Token input */}
        <label style={{ fontSize:10, fontWeight:700, color:colors.textMuted, letterSpacing:"0.08em", display:"block", marginBottom:7 }}>
          HUGGING FACE API TOKEN
        </label>
        <div style={{ position:"relative", marginBottom:10 }}>
          <input
            type={show ? "text" : "password"}
            value={tok}
            onChange={(e) => setTok(e.target.value)}
            placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            style={{ width:"100%", background:colors.surfaceAlt, border:`1px solid ${tok ? colors.accent+"70" : colors.border}`, borderRadius:9, padding:"11px 44px 11px 13px", color:colors.text, fontSize:12, fontFamily:"monospace", transition:"border-color 0.2s" }}
          />
          <button onClick={() => setShow(!show)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:colors.textMuted, fontSize:15, padding:0 }}>{show ? "🙈" : "👁️"}</button>
        </div>
        <div style={{ fontSize:10, color:colors.textMuted, lineHeight:1.7, marginBottom:20 }}>
          Get a free token at{" "}
          <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" style={{ color:colors.accent }}>huggingface.co/settings/tokens</a>
          {" "}— needs <strong style={{ color:colors.text }}>Read</strong> permission with Inference API enabled.
        </div>

        {/* Tips */}
        <div style={{ background:colors.surfaceAlt, border:`1px solid ${colors.border}`, borderRadius:9, padding:"11px 14px", marginBottom:22, fontSize:10, color:colors.textMuted, lineHeight:1.9 }}>
          <strong style={{ color:colors.text, display:"block", marginBottom:3 }}>💡 Tips</strong>
          <div>• First request may take ~20s while the model warms up</div>
          <div>• Free tier has rate limits — wait a moment between requests</div>
          <div>• Token is stored in memory only and cleared on page refresh</div>
        </div>

        {/* Buttons */}
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ background:colors.surfaceAlt, border:`1px solid ${colors.border}`, color:colors.text, borderRadius:9, padding:"9px 20px", fontSize:12, fontFamily:"inherit" }}>Cancel</button>
          <button
            onClick={() => { onSave(tok.trim()); onClose(); }}
            disabled={!tok.trim()}
            style={{ background: tok.trim() ? `linear-gradient(135deg,${colors.accent},#a855f7)` : colors.border, color:"white", borderRadius:9, padding:"9px 22px", fontSize:12, fontFamily:"inherit", fontWeight:700, opacity: tok.trim() ? 1 : 0.45 }}
          >Save & Connect</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Welcome to **CodeForge AI** — powered by **Qwen2.5-7B-Instruct** 🤗\n\nOpen ⚙️ **Settings** to add your Hugging Face API token, then describe any website or app to build.\n\n*Try: \"Build a modern portfolio website with dark theme and animations\"*",
    ts: Date.now(),
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("");
  const [project, setProject] = useState(null);
  const [activeFile, setActiveFile] = useState("index.html");
  const [activeTab, setActiveTab] = useState("preview");
  const [theme, setTheme] = useState("dark");
  const [highlightId, setHighlightId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [hfToken, setHfToken] = useState("");
  const endRef = useRef(null);

  const isDark = theme === "dark";
  const C = {
    bg:         isDark ? "#080810" : "#f3f2ed",
    surface:    isDark ? "#0e0e1a" : "#ffffff",
    surfaceAlt: isDark ? "#13131f" : "#f6f5f0",
    border:     isDark ? "#1c1c2e" : "#e0ddd5",
    text:       isDark ? "#ddd9ff" : "#1a1a2e",
    textMuted:  isDark ? "#55557a" : "#8a8a9e",
    accent:     "#7c6fff",
    accentGlow: isDark ? "rgba(124,111,255,0.11)" : "rgba(124,111,255,0.07)",
    green:  "#22c55e",
    amber:  "#f59e0b",
    red:    "#ef4444",
    userBg: isDark ? "#171730" : "#eeebf8",
    aiBg:   isDark ? "#0f0f1c" : "#fafaf8",
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const addMsg = (role, content, extra = {}) =>
    setMessages((p) => [...p, { role, content, ts: Date.now(), ...extra }]);

  // ── CORE PIPELINE ──────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!input.trim() || loading) return;
    if (!hfToken) { setShowSettings(true); addMsg("assistant", "⚠️ Please add your **Hugging Face API token** in ⚙️ Settings first."); return; }

    const prompt = input.trim();
    setInput("");
    addMsg("user", prompt);
    setLoading(true);

    try {
      // STEP 1 — PLAN
      setPhase("🧠 Planning...");
      const planInput = project
        ? `User request: "${prompt}"\n\nCurrent sections.json:\n${JSON.stringify(project.sectionsJson, null, 2)}`
        : `User request: "${prompt}"\n\nNo project exists yet — create a new one.`;
      const planRaw = await callHF(hfToken, PLANNER_SYSTEM, planInput, 700);
      const plan = tryParseJson(planRaw);
      if (!plan) throw new Error("Planner returned invalid JSON:\n" + planRaw.slice(0, 300));

      addMsg("assistant", `**📋 Plan:** ${plan.description}\n\n\`\`\`json\n${JSON.stringify(plan, null, 2)}\n\`\`\``, { isPlan: true });

      // STEP 2 — EXECUTE
      if (plan.action === "generate") {
        setPhase("⚡ Generating code...");
        const execInput = `Build this project: "${prompt}"\n\nPlan:\n${JSON.stringify(plan, null, 2)}\n\nUse FILE MARKERS. Only raw code, no explanation.`;
        const codeRaw = await callHF(hfToken, EXECUTOR_SYSTEM, execInput, 2800);
        const files = parseFiles(codeRaw);
        const sectionsJson = buildSectionsJson(files, plan.sections_plan);
        setProject({ files, sectionsJson, history: [] });
        setActiveTab("preview");
        addMsg("assistant", `✅ **Project generated!** ${sectionsJson.sections.length} sections across 3 files.\n\nPreview it on the right, browse code, or ask me to edit anything!`);

      } else if (plan.action === "edit" && project) {
        setPhase("✏️ Applying targeted edit...");
        const targets = plan.target_sections || [];
        const byFile = {};
        project.sectionsJson.sections.filter((s) => targets.includes(s.id)).forEach((s) => {
          if (!byFile[s.file]) byFile[s.file] = [];
          byFile[s.file].push(s.id);
        });

        let updatedFiles = { ...project.files };
        for (const [fname, ids] of Object.entries(byFile)) {
          const cur = extractSections(project.files[fname], fname);
          const ctx = ids.map((id) => ({ id, current: cur[id] || "" }));
          const execInput = `Edit: "${plan.changes}"\nFile: ${fname}\nSections: ${ids.join(", ")}\n\nCurrent sections:\n${JSON.stringify(ctx, null, 2)}\n\nReturn ONLY the modified SECTION_ID block(s). No extra text.`;
          const editRaw = await callHF(hfToken, EXECUTOR_SYSTEM, execInput, 1200);
          let newContent = project.files[fname];
          ids.forEach((id) => {
            const newBody = extractSections(editRaw, fname)[id];
            if (newBody) newContent = replaceSection(newContent, id, newBody, fname);
          });
          updatedFiles[fname] = newContent;
        }

        const history = [...(project.history || []), { files: project.files, sectionsJson: project.sectionsJson, prompt }];
        setProject({ files: updatedFiles, sectionsJson: project.sectionsJson, history });
        setHighlightId(targets[0] || null);
        setTimeout(() => setHighlightId(null), 3000);
        addMsg("assistant", `✅ **Edit applied!** Modified: ${targets.map((s) => `\`${s}\``).join(", ")}`);

      } else if (plan.action === "edit" && !project) {
        addMsg("assistant", "⚠️ No project yet — describe a website to generate first.");
      }
    } catch (err) {
      addMsg("assistant", `❌ **Error:** ${err.message}`);
    } finally { setLoading(false); setPhase(""); }
  }, [input, loading, project, hfToken]);

  // ── UTILS ──────────────────────────────────────────────────────────────────
  const undo = () => {
    if (!project?.history?.length) return;
    const prev = project.history.at(-1);
    setProject({ ...prev, history: project.history.slice(0, -1) });
    addMsg("assistant", "↩️ Undid last edit.");
  };
  const dl = (name, content) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    a.download = name; a.click();
  };
  const dlAll = () => {
    if (!project) return;
    Object.entries(project.files).forEach(([f, c]) => dl(f, c));
    dl("sections.json", JSON.stringify(project.sectionsJson, null, 2));
  };
  const fmt = (text) => text
    .replace(/\*\*(.*?)\*\*/g, `<strong style="color:${C.accent}">$1</strong>`)
    .replace(/\*(.*?)\*/g, `<em style="color:${C.textMuted}">$1</em>`)
    .replace(/`([^`\n]+)`/g, `<code style="background:${C.border};padding:1px 5px;border-radius:4px;font-size:0.79em;font-family:monospace">$1</code>`)
    .replace(/```[\w]*\n([\s\S]*?)```/g, `<pre style="background:${C.bg};border:1px solid ${C.border};border-radius:8px;padding:10px;margin:6px 0;font-size:0.71em;font-family:monospace;white-space:pre-wrap;overflow-x:auto">$1</pre>`)
    .replace(/\n/g, "<br>");

  const code = project?.files[activeFile] || "";

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:C.bg, color:C.text, fontFamily:"'JetBrains Mono','Fira Code',monospace", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
        textarea,input{outline:none}
        button{cursor:pointer;border:none;transition:opacity .15s,transform .1s}
        button:not(:disabled):active{transform:scale(.97)}
        a{color:${C.accent}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes slideIn{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes glow{0%,100%{border-color:${C.accent}40}50%{border-color:${C.accent}}}
        .msg{animation:slideIn .22s ease both}
        .hl{animation:glow 1.1s ease 3}
      `}</style>

      {showSettings && <SettingsModal colors={C} hfToken={hfToken} onSave={setHfToken} onClose={() => setShowSettings(false)} />}

      {/* TOP BAR */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px", height:50, background:C.surface, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, background:`linear-gradient(135deg,${C.accent},#a855f7)`, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>⚡</div>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:15, letterSpacing:"-.02em" }}>CodeForge AI</span>
          <span style={{ fontSize:9, background:C.accentGlow, color:C.accent, border:`1px solid ${C.accent}30`, borderRadius:4, padding:"2px 7px", 
