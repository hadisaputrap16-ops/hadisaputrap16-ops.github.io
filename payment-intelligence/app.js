// Shared helpers. All data is rendered with textContent (never innerHTML) because
// descriptions and agent explanations are untrusted text.
const PI = (() => {
  const CLASSES = {
    LEGITIMATE: { label: "Legitimate", color: "var(--c-legit)" },
    POTENTIAL_FRAUD: { label: "Potential fraud", color: "var(--c-fraud)" },
    POTENTIAL_ILLEGAL_GAMBLING: { label: "Potential illegal gambling", color: "var(--c-gambling)" },
    INSUFFICIENT_DATA: { label: "Insufficient data", color: "var(--c-insufficient)" },
  };
  const ACTIONS = { APPROVE: "✓ APPROVE", FLAG: "⚑ FLAG", REVIEW: "◎ REVIEW (manual)", BLOCK: "⛔ BLOCK (needs approval)" };
  const STATUS = { // Twilio delivery states -> reserved status colors, always icon + label
    delivered: ["✓", "var(--good)"], read: ["✓✓", "var(--good)"], sent: ["→", "var(--warning)"],
    queued: ["…", "var(--warning)"], accepted: ["…", "var(--warning)"], sending: ["…", "var(--warning)"],
    failed: ["✕", "var(--critical)"], undelivered: ["✕", "var(--critical)"], SEND_FAILED: ["✕", "var(--critical)"],
    SENT: ["✓", "var(--good)"], PENDING: ["…", "var(--warning)"],
  };

  function h(tag, attrs = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "style") el.style.cssText = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid instanceof Node ? kid : String(kid));
    return el;
  }

  async function post(path, body) {
    const r = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
    const text = await r.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { ok: false, error: `Non-JSON response (HTTP ${r.status})`, raw: text.slice(0, 300) }; }
    if (!r.ok && data.ok !== false) data = { ok: false, error: `HTTP ${r.status}`, ...data };
    return data;
  }
  const query = (action, extra) => post("/api/query", { action, ...extra });

  const idr = (n) => n == null ? "–" : "IDR " + Number(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });
  const compactIdr = (n) => n == null ? "–" : "IDR " + Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(Number(n));
  const when = (s) => s ? new Date(s).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "–";

  function classBadge(c) {
    const m = CLASSES[c] || { label: c || "–", color: "var(--text-muted)" };
    return h("span", { class: "badge" }, h("span", { class: "swatch", style: `background:${m.color}` }), m.label);
  }
  const actionBadge = (a) => h("span", { class: "badge" }, ACTIONS[a] || a || "–");
  function statusBadge(s) {
    const [icon, color] = STATUS[s] || ["•", "var(--text-muted)"];
    return h("span", { class: "badge" }, h("span", { style: `color:${color}`, "aria-hidden": "true" }, icon), s || "–");
  }
  const chips = (list) => h("div", { class: "chips" }, (list || []).map((x) => h("span", { class: "chip" }, x)));

  function nav(current) {
    const links = [["index.html", "Dashboard"], ["analyze.html", "Transaction Analysis"], ["transfer.html", "Transfer (SNAP)"], ["investigation.html", "Investigation"], ["alerts.html", "Alert Monitoring"]];
    const header = h("header", { class: "top" }, h("div", { class: "top-inner" },
      h("a", { class: "brand", href: "index.html", "aria-label": "BANK GAK JAGO home" },
        h("span", { class: "brand-mark", "aria-hidden": "true" }, "gj"),
        h("span", {}, "BANK GAK JAGO", h("small", {}, "AI-powered financial crime detection · Boomi BANK GAK JAGO"))),
      h("nav", { class: "tabs", "aria-label": "Main" }, links.map(([href, label]) =>
        h("a", { href, "aria-current": href === current ? "page" : null }, label)))));
    document.body.prepend(header);
    assistant();
  }

  // Floating chat with the conversational Agent Garden agent "Payment Intelligence Assistant" (read-only tools).
  // History lives in sessionStorage per tab, only as a convenience; the agent itself is stateless per call.
  function assistant() {
    const KEY = "pi-assistant-history";
    let history = [];
    try { history = JSON.parse(sessionStorage.getItem(KEY) || "[]"); } catch { history = []; }
    const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(history.slice(-20))); } catch { /* storage unavailable */ } };
    const STARTERS = ["Ringkas kondisi fraud & judi online saat ini", "Tampilkan 5 transaksi POTENTIAL_FRAUD terbaru", "Alert mana yang gagal terkirim?"];

    const log = h("div", { class: "chat-log", role: "log", "aria-live": "polite" });
    const input = h("textarea", { rows: "2", maxlength: "2000", placeholder: "Tanya tentang transaksi, risiko, investigasi…", "aria-label": "Message the assistant" });
    const send = h("button", { class: "primary", type: "submit" }, "Kirim");
    const starters = h("div", { class: "chat-starters" }, STARTERS.map((q) => h("button", { type: "button", class: "chip-btn", onclick: () => ask(q) }, q)));
    // Agent replies use light Markdown; only **bold** is rendered, built from text nodes (no innerHTML).
    const rich = (text) => String(text)
      .replace(/^#{1,6}\s+(.+)$/gm, (_, t) => /^\*\*.*\*\*$/.test(t) ? t : `**${t}**`)   // "### Heading" -> bold line
      .split(/\*\*(.+?)\*\*/g).map((part, i) => i % 2 ? h("strong", {}, part) : part);
    const bubble = (role, text, extra) => h("div", { class: `chat-msg ${role}${extra ? " " + extra : ""}` }, role === "assistant" ? rich(text) : text);
    const render = () => {
      log.replaceChildren(...history.map((m) => bubble(m.role, m.content)));
      starters.hidden = history.length > 0;
      log.scrollTop = log.scrollHeight;
    };
    async function ask(text) {
      const msg = (text || "").trim();
      if (!msg || send.disabled) return;
      const prior = history.slice(-6);
      history.push({ role: "user", content: msg }); save(); render();
      input.value = ""; send.disabled = true;
      const typing = bubble("assistant", "Menganalisis…", "pending"); log.append(typing); log.scrollTop = log.scrollHeight;
      const r = await post("/api/assistant", { message: msg, history: prior }).catch(() => ({ ok: false, error: "Network error" }));
      typing.remove(); send.disabled = false;
      if (r.ok && r.reply) { history.push({ role: "assistant", content: r.reply }); save(); render(); }
      else log.append(bubble("assistant", "⚠ " + (r.error || "The assistant did not answer."), "error"));
      input.focus();
    }
    const form = h("form", { class: "chat-form", onsubmit: (e) => { e.preventDefault(); ask(input.value); } }, input, send);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input.value); } });
    const panel = h("section", { class: "chat-panel", id: "pi-assistant", "aria-label": "AI assistant", hidden: true },
      h("div", { class: "chat-head" },
        h("div", {}, h("strong", {}, "AI Assistant"), h("small", {}, "Payment Intelligence Assistant · Boomi Agent Garden · read-only")),
        h("div", { class: "chat-actions" },
          h("button", { type: "button", class: "ghost", title: "Clear conversation", onclick: () => { history = []; save(); render(); } }, "Reset"),
          h("button", { type: "button", class: "ghost", "aria-label": "Close assistant", onclick: () => toggle(false) }, "✕"))),
      log, starters, form);
    const fab = h("button", { class: "chat-fab", type: "button", "aria-controls": "pi-assistant", "aria-expanded": "false", onclick: () => toggle(panel.hidden) },
      h("span", { "aria-hidden": "true" }, "✦"), " AI Assistant");
    function toggle(open) { panel.hidden = !open; fab.setAttribute("aria-expanded", String(open)); if (open) { render(); input.focus(); } }
    document.body.append(panel, fab);
  }

  function errorBox(msg) { return h("div", { class: "notice error", role: "alert" }, msg); }

  // Which source answered the last /api call (set by demo.js; "live" when demo.js is absent).
  const mode = () => window.PI_MODE || "live";
  const modeBadge = () => mode() === "live"
    ? h("span", { class: "badge status-pill" }, h("span", { style: "color:var(--good)", "aria-hidden": "true" }, "●"), "API: Live")
    : h("span", { class: "badge status-pill demo", title: window.PI_MODE_REASON || "Read-only snapshot" },
        h("span", { style: "color:var(--warning)", "aria-hidden": "true" }, "◎"), "Demo Snapshot Mode", window.PI_MODE_REASON ? h("span", { class: "muted" }, " · " + window.PI_MODE_REASON) : null);
  // n grey shimmering placeholder lines; extra class sets their size.
  const skeleton = (n = 3, cls = "") => h("div", { class: "skeleton-group", "aria-hidden": "true" }, Array.from({ length: n }, () => h("div", { class: "skeleton " + cls })));

  return { CLASSES, h, post, query, idr, compactIdr, when, classBadge, actionBadge, statusBadge, chips, nav, errorBox, mode, modeBadge, skeleton };
})();
