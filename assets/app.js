"use strict";
(function () {
  const P = window.PROFILE;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  let lang = store.get("lang") || "id";
  const t = (x, l) => (x && typeof x === "object" ? x[l || lang] ?? x.en : x);

  // ---------- CV logic (pure; also used by tests/cv.test.js under node) ----------
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function hits(text, keywords) {
    const s = (text || "").toLowerCase();
    if (!s) return [];
    return keywords.filter((k) => new RegExp("(^|[^a-z0-9])" + esc(k.toLowerCase()) + "([^a-z0-9]|$)").test(s));
  }
  const allKeys = () => P.skills.flatMap((s) => s.k);

  function buildCV({ role, jd, l, headline }) {
    const R = P.roles[role];
    const skills = P.skills
      .map((s, i) => {
        const m = hits(jd, s.k);
        return { name: s.n, matched: m.length > 0, score: m.length * 3 + (s.r.includes(role) ? 1 + (s.r[0] === role ? 1 : 0) : 0), i };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score || a.i - b.i);
    const matchedKeys = [...new Set(hits(jd, allKeys()))];
    const rank = (txt) => hits(txt, matchedKeys).length;
    const sortBullets = (bs) => bs.map((b) => t(b, l)).map((x, i) => ({ x, i, s: rank(x) })).sort((a, b) => b.s - a.s || a.i - b.i).map((o) => o.x);

    const top = skills.filter((s) => s.matched).slice(0, 4).map((s) => s.name.replace(/\s*\(.*\)$/, ""));
    let summary = t(R.summary, l);
    if (top.length) summary += (l === "id" ? " Kekuatan utama yang relevan: " : " Key strengths for this role: ") + top.join(", ") + ".";

    const experience = P.experience.map((e) => ({
      role: e.role, company: e.company, via: e.via, period: e.period, loc: e.loc,
      bullets: e.bullets.length ? sortBullets(e.bullets) : [t(e.desc, l)],
    }));
    experience.push({ role: P.employer.title + " — R&D", company: P.employer.company, period: P.employer.period, loc: "Indonesia", bullets: sortBullets(P.rnd.bullets) });

    const projects = P.projects
      .map((p, i) => ({ p, i, s: (p.tags.includes(role) ? 10 : 0) + rank(p.cv.map((b) => t(b, l)).join(" ") + " " + p.stack.join(" ")) }))
      .sort((a, b) => b.s - a.s || a.i - b.i)
      .map(({ p }) => ({ name: p.name, period: p.period, stack: p.stack.join(", "), bullets: sortBullets(p.cv) }));

    return {
      l, name: P.name, headline: headline || R.title,
      contact: [P.location, P.email, P.linkedin.replace(/^https?:\/\/(www\.)?/, ""), P.site.replace(/^https?:\/\//, "")],
      summary, skills: skills.map((s) => s.name), matchedKeys,
      experience, projects,
      earlier: P.earlier,
      education: P.education.map((e) => ({ school: e.school, degree: t(e.degree, l), period: e.period })),
      certifications: P.certifications,
      H: l === "id"
        ? { sum: "Ringkasan Profesional", skills: "Keahlian Inti", exp: "Pengalaman Kerja", proj: "Proyek", edu: "Pendidikan", cert: "Sertifikasi", client: "Klien", stack: "Teknologi" }
        : { sum: "Professional Summary", skills: "Core Skills", exp: "Work Experience", proj: "Projects", edu: "Education", cert: "Certifications", client: "Client", stack: "Tech" },
    };
  }

  if (typeof module !== "undefined") module.exports = { hits, buildCV };
  if (typeof document === "undefined") return;

  // ---------- i18n ----------
  const EN = {
    "nav.about": "About", "nav.exp": "Experience", "nav.projects": "Projects", "nav.skills": "Skills", "nav.contact": "Contact",
    "cta.cv": "Generate ATS CV", "cta.cvLong": "Generate / Download ATS CV", "cta.projects": "View Case Studies",
    "hero.hi": "Hi, I'm", "hero.lead": "I build secure API integrations, AI-agent orchestration and BI platforms that turn operational data into decisions.",
    "about.focus": "Focus", "about.f1": "API &amp; Integration Engineering", "about.f2": "AI Agent Orchestration (Boomi)", "about.f3": "Business Intelligence &amp; Data Modeling", "about.f4": "Data Engineering / ETL",
    "exp.earlier": "Earlier experience",
    "pi.badge": "Featured case study · Boomi Hackathon · Nov 2026",
    "pi.sub": "AI-powered financial crime detection for the fictional \"BANK GAK JAGO\": transfer fraud and online gambling are analysed in real time, before money moves.",
    "pi.m1": "transactions analysed", "pi.m2": "potential fraud detected", "pi.m3": "E2E tests passed", "pi.m4": "weighted rules + AI",
    "pi.problem": "Problem", "pi.problemText": "Pure rules are auditable but rigid; pure AI adapts but is hard to explain. A bank needs decisions in seconds that still stand up to auditors and regulators.",
    "pi.solution": "Solution", "pi.solutionText": "A hybrid decision engine: final score = 60% AI + 40% rules. Strong rule evidence overrides a soft AI verdict, unknown payers are never auto-approved, and BLOCK is only a proposal that a named analyst must approve.",
    "pi.arch": "Architecture", "pi.flow": "Analyze Transaction flow",
    "pi.snap": "A SNAP-style (Bank Indonesia) intrabank transfer endpoint: requests and responses are signed with SHA256withRSA and encrypted with RSA-OAEP-SHA256 + AES-256-GCM. A pattern guard looks at the source account's last 30 days — one occurrence is not a pattern — so a first transfer is not blocked outright.",
    "pi.sec": "Security &amp; resilience", "pi.code": "View source code on GitHub", "pi.demo": "Try the Live Demo",
    "sc.badge": "Business Intelligence · Supply Chain", "sc.title": "Supply Chain Power BI &amp; SQL Data Warehouse Architecture",
    "sc.text": "A star-schema model on a SQL data warehouse to monitor inventory health and demand-planning quality.",
    "sc.dio": "Days Inventory Outstanding — how many days of working capital sit in stock.", "sc.wape": "Weighted Absolute Percentage Error — volume-weighted forecast accuracy.",
    "sc.bias": "Systematic over/under-forecasting, a calibration signal for planners.", "sc.exp": "Inventory Expiration Tracking — aging buckets and near-expiry stock.",
    "bank.badge": "Banking API Integration", "bank.title": "60+ Banking API Integrations — SNAP, BI-FAST, BRANKAS",
    "bank.text": "End-to-end API lifecycle on Axway API Gateway for Bank BTPN — design, data mapping, transformation, validation, testing, deployment and monitoring — plus multi-environment API Management for PEFINDO Biro Kredit.",
    "bank.b1": "Axway API Management HA cluster + 7.7 upgrade/rollback", "bank.b2": "RSA request encryption, SOAP signatures, IP filtering", "bank.b3": "Event-driven Axway ↔ Kafka (Confluent) integration",
    "sec.certs": "Certifications", "sec.edu": "Education",
    "contact.text": "Open to API / Integration Engineering, Data Engineering and Business Intelligence roles.",
    "foot": "Built as a static site for GitHub Pages.",
    "cv.title": "ATS CV Generator", "cv.role": "Target role", "cv.titleLbl": "Title on CV", "cv.lang": "CV language",
    "cv.jd": "Paste a Job Description (optional)", "cv.jdPh": "Paste the job posting here — skills, projects and bullets are re-ordered to match its keywords.",
    "cv.pdf": "Export PDF", "cv.docx": "Download .docx", "cv.hint": "PDF: choose \"Save as PDF\" in the print dialog. Everything runs in your browser — no server.",
  };
  const ID = {};
  document.querySelectorAll("[data-i18n]").forEach((el) => (ID[el.dataset.i18n] = el.innerHTML));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (ID[el.dataset.i18nPh] = el.placeholder));

  const STEPS = [
    ["Receive", "Terima", "POST createPaymentAnalysis via Boomi WSS listener"],
    ["Validate & store", "Validasi & simpan", "pi_dispatch('ingest') — rejects raw 16-digit NIK"],
    ["Context + rules", "Konteks + rules", "payer profile, merchant, watchlist, 90-day history"],
    ["AI Risk Analyst", "AI Risk Analyst", "Agent Garden structured JSON · Try/Catch + 1 retry"],
    ["Decision engine", "Decision engine", "60% AI + 40% rules → APPROVE / REVIEW / FLAG / BLOCK"],
    ["Audit + alert", "Audit + alert", "decision_logs, risk_indicators, email via Send Notifications"],
  ];
  const SEC = [
    { en: "Tokenised payment IDs; raw NIK rejected at validation", id: "Payment ID ter-tokenisasi; NIK mentah ditolak saat validasi" },
    { en: "Credentials never reach the browser — injected server-side", id: "Kredensial tidak pernah sampai ke browser — disuntikkan di server" },
    { en: "AI or email failure never breaks the response; falls back to rules + manual review", id: "Kegagalan AI atau email tidak memutus respons; jatuh ke rules + manual review" },
    { en: "Full audit trail of every decision, indicator and notification", id: "Audit trail lengkap untuk setiap keputusan, indikator, dan notifikasi" },
    { en: "Human-in-the-loop: BLOCK requires a named analyst", id: "Human-in-the-loop: BLOCK wajib analis bernama" },
  ];
  const GROUPS = {
    int: { en: "Integration & AI", id: "Integrasi & AI" }, data: { en: "Data & Warehousing", id: "Data & Warehousing" },
    bi: { en: "Business Intelligence", id: "Business Intelligence" }, lang: { en: "Languages", id: "Bahasa Pemrograman" },
    tool: { en: "Tools", id: "Tools" }, soft: { en: "Ways of working", id: "Cara kerja" },
  };

  const $ = (s) => document.querySelector(s);
  const h = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const li = (arr) => arr.map((x) => `<li>${h(x)}</li>`).join("");

  function render() {
    document.documentElement.lang = lang;
    const dict = lang === "en" ? EN : ID;
    document.querySelectorAll("[data-i18n]").forEach((el) => { const v = dict[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => { const v = dict[el.dataset.i18nPh]; if (v != null) el.placeholder = v; });
    $("#langBtn").textContent = lang === "en" ? "ID" : "EN";

    $("#headline").textContent = t(P.headline);
    $("#summary").textContent = t(P.summary);
    $("#stats").innerHTML = P.stats.map((s) => `<li><b>${h(s.v)}</b><span>${h(t(s.l))}</span></li>`).join("");
    $("#employer").innerHTML = `<b>${h(P.employer.company)}</b> · ${h(P.employer.title)} · ${h(P.employer.period)} — ${h(t(P.employer.note))}`;
    $("#timeline").innerHTML = P.experience.map((e) => `
      <li class="card">
        <div class="tl-head"><h3>${h(e.role)} <span>— ${h(e.company)}</span></h3><time>${h(e.period)}</time></div>
        <p class="muted small">${h(e.loc)}${e.via ? " · via " + h(e.via) : ""}</p>
        <p>${h(t(e.desc))}</p>
        ${e.bullets.length ? `<ul class="ticks">${li(e.bullets.map((b) => t(b)))}</ul>` : ""}
      </li>`).join("");
    $("#rnd").innerHTML = `<h3>${h(t(P.rnd.title))}</h3><ul class="ticks">${li(P.rnd.bullets.map((b) => t(b)))}</ul>`;
    $("#earlier").innerHTML = P.earlier.map((e) => `<li><b>${h(e.role)}</b> — ${h(e.company)} <span class="muted">· ${h(e.period)}</span></li>`).join("");
    $("#piSteps").innerHTML = STEPS.map((s) => `<li><b>${h(lang === "en" ? s[0] : s[1])}</b><span>${h(s[2])}</span></li>`).join("");
    $("#piSec").innerHTML = li(SEC.map((x) => t(x)));
    $("#skillGroups").innerHTML = Object.keys(GROUPS).map((g) => `
      <div class="card"><h3>${h(t(GROUPS[g]))}</h3><div class="tags">${P.skills.filter((s) => s.g === g).map((s) => `<span>${h(s.n)}</span>`).join("")}</div></div>`).join("");
    $("#certs").innerHTML = li(P.certifications);
    $("#edu").innerHTML = P.education.map((e) => `<li><b>${h(e.school)}</b><span>${h(t(e.degree))} · ${h(e.period)}</span></li>`).join("");
    if (!$("#cvModal").hidden) renderCV();
  }

  // ---------- theme / language ----------
  function applyThemeIcon() { $("#themeBtn").textContent = document.documentElement.dataset.theme === "light" ? "☾" : "☀"; }
  $("#themeBtn").onclick = () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next; store.set("theme", next); applyThemeIcon();
  };
  $("#langBtn").onclick = () => { lang = lang === "en" ? "id" : "en"; store.set("lang", lang); render(); };

  // ---------- CV modal ----------
  const modal = $("#cvModal");
  let lastFocus = null, cv = null;
  function opts() { return { role: $("#cvRole").value, jd: $("#cvJD").value, l: $("#cvLang").value, headline: $("#cvHeadline").value.trim() }; }

  function renderCV() {
    cv = buildCV(opts());
    const H = cv.H;
    const sec = (title, body) => `<section><h2>${h(title)}</h2>${body}</section>`;
    const job = (e) => `<div class="job"><p class="jt"><strong>${h(e.role)}</strong>, ${h(e.company)}${e.via ? ` (${h(e.via)})` : ""}</p><p class="jm">${h(e.period)}${e.loc ? " | " + h(e.loc) : ""}</p><ul>${li(e.bullets)}</ul></div>`;
    $("#cvDoc").innerHTML = `
      <header><h1>${h(cv.name)}</h1><p class="ht">${h(cv.headline)}</p><p>${cv.contact.map(h).join(" | ")}</p></header>
      ${sec(H.sum, `<p>${h(cv.summary)}</p>`)}
      ${sec(H.skills, `<p>${cv.skills.map(h).join(" • ")}</p>`)}
      ${sec(H.exp, cv.experience.map(job).join("") + cv.earlier.map((e) => `<div class="job"><p class="jt"><strong>${h(e.role)}</strong>, ${h(e.company)}</p><p class="jm">${h(e.period)}${e.loc ? " | " + h(e.loc) : ""}</p></div>`).join(""))}
      ${sec(H.proj, cv.projects.map((p) => `<div class="job"><p class="jt"><strong>${h(p.name)}</strong></p><p class="jm">${h(p.period)} | ${h(H.stack)}: ${h(p.stack)}</p><ul>${li(p.bullets)}</ul></div>`).join(""))}
      ${sec(H.edu, cv.education.map((e) => `<p><strong>${h(e.degree)}</strong>, ${h(e.school)} | ${h(e.period)}</p>`).join(""))}
      ${sec(H.cert, `<ul>${li(cv.certifications)}</ul>`)}`;
    const jd = $("#cvJD").value.trim();
    $("#cvMatch").innerHTML = !jd ? "" : cv.matchedKeys.length
      ? `<b>${cv.matchedKeys.length}</b> ${lang === "en" ? "keywords matched" : "kata kunci cocok"}: ${cv.matchedKeys.map((k) => `<span>${h(k)}</span>`).join("")}`
      : (lang === "en" ? "No known keywords matched — using the role default." : "Belum ada kata kunci yang cocok — memakai urutan default role.");
  }

  function openCV() {
    lastFocus = document.activeElement;
    if (!$("#cvHeadline").dataset.touched) $("#cvHeadline").value = P.roles[$("#cvRole").value].title;
    $("#cvLang").value = $("#cvLang").dataset.touched ? $("#cvLang").value : lang;
    modal.hidden = false; document.body.classList.add("noscroll");
    renderCV(); $("#cvRole").focus();
  }
  function closeCV() {
    modal.hidden = true; document.body.classList.remove("noscroll");
    if (location.hash === "#cv") history.replaceState(null, "", location.pathname);
    lastFocus && lastFocus.focus();
  }
  document.querySelectorAll("[data-open-cv]").forEach((b) => b.addEventListener("click", openCV));
  $("#cvClose").onclick = closeCV;
  modal.addEventListener("click", (e) => { if (e.target === modal) closeCV(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeCV(); });
  $("#cvRole").onchange = () => { if (!$("#cvHeadline").dataset.touched) $("#cvHeadline").value = P.roles[$("#cvRole").value].title; renderCV(); };
  $("#cvHeadline").oninput = (e) => { e.target.dataset.touched = "1"; renderCV(); };
  $("#cvLang").onchange = (e) => { e.target.dataset.touched = "1"; renderCV(); };
  let tmr; $("#cvJD").oninput = () => { clearTimeout(tmr); tmr = setTimeout(renderCV, 250); };

  const fileBase = () => `Hadi_Saputra_CV_${$("#cvRole").value === "bi" ? "BI_Data_Engineer" : "Integration_AI_Developer"}`;

  $("#cvPdf").onclick = () => {
    const old = document.title;
    document.title = fileBase(); // browsers use the title as the default PDF filename
    document.body.classList.add("print-cv");
    const done = () => { document.body.classList.remove("print-cv"); document.title = old; window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    window.print();
    setTimeout(done, 1000);
  };

  // docx is ~1 MB, so load it only when someone actually asks for a .docx.
  let docxLoading;
  function loadDocx() {
    if (window.docx) return Promise.resolve(window.docx);
    return (docxLoading ||= new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.iife.js";
      s.onload = () => res(window.docx);
      s.onerror = () => { docxLoading = null; rej(new Error("docx CDN failed")); };
      document.head.appendChild(s);
    }));
  }

  $("#cvDocx").onclick = async () => {
    const btn = $("#cvDocx"), label = btn.textContent;
    btn.disabled = true; btn.textContent = "…";
    try {
      const D = await loadDocx();
      const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = D;
      const c = cv || buildCV(opts());
      const H = c.H, kids = [];
      const p = (runs, o = {}) => kids.push(new Paragraph({ children: runs, spacing: { after: 60 }, ...o }));
      const r = (text, o = {}) => new TextRun({ text, ...o });
      const head = (text) => kids.push(new Paragraph({
        children: [r(text.toUpperCase(), { bold: true, size: 24 })], spacing: { before: 200, after: 80 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000", space: 1 } },
      }));
      const bullets = (arr) => arr.forEach((b) => kids.push(new Paragraph({ children: [r(b)], bullet: { level: 0 }, spacing: { after: 40 } })));
      const job = (title, company, meta, bs) => {
        p([r(title, { bold: true }), r(", " + company)], { spacing: { before: 120, after: 0 } });
        p([r(meta, { italics: true })]);
        bullets(bs || []);
      };

      p([r(c.name, { bold: true, size: 36 })], { alignment: AlignmentType.CENTER, spacing: { after: 40 } });
      p([r(c.headline, { size: 24 })], { alignment: AlignmentType.CENTER, spacing: { after: 40 } });
      p([r(c.contact.join(" | "))], { alignment: AlignmentType.CENTER });
      head(H.sum); p([r(c.summary)]);
      head(H.skills); p([r(c.skills.join(" • "))]);
      head(H.exp);
      c.experience.forEach((e) => job(e.role, e.company + (e.via ? ` (${e.via})` : ""), e.period + (e.loc ? " | " + e.loc : ""), e.bullets));
      c.earlier.forEach((e) => job(e.role, e.company, e.period + (e.loc ? " | " + e.loc : "")));
      head(H.proj); c.projects.forEach((pr) => job(pr.name, pr.period, `${H.stack}: ${pr.stack}`, pr.bullets));
      head(H.edu); c.education.forEach((e) => p([r(e.degree, { bold: true }), r(`, ${e.school} | ${e.period}`)]));
      head(H.cert); bullets(c.certifications);

      const doc = new Document({
        creator: c.name, title: `${c.name} — ${c.headline}`,
        styles: { default: { document: { run: { font: "Calibri", size: 21 } } } },
        sections: [{ properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } }, children: kids }],
      });
      const blob = await Packer.toBlob(doc);
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: fileBase() + ".docx" });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    } catch (e) {
      alert((lang === "en" ? "Could not build the .docx: " : "Gagal membuat .docx: ") + e.message);
    } finally { btn.disabled = false; btn.textContent = label; }
  };

  // ---------- boot ----------
  $("#yr").textContent = new Date().getFullYear();
  $("#mailBtn").href = "mailto:" + P.email;
  $("#liBtn").href = P.linkedin;
  applyThemeIcon();
  render();
  if (location.hash === "#cv") openCV();
})();
