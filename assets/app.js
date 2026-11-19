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
    "cta.cv": "Download CV", "cta.cvLong": "Download CV", "cta.projects": "View Case Studies",
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
    "contact.title": "Let's talk!", "hero.status": "Open to work · Jakarta, ID",
    "foot": "Made with 💚 and lots of ☕ · GitHub Pages",
    "cv.title": "Download CV", "cv.lang": "CV language",
    "cv.view": "View CV (PDF)", "cv.hint": "Opens the ATS-friendly PDF in a new tab — save or print it from there.",
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
  const GROUP_ICON = { int: "workflow", data: "database", bi: "chart-column", lang: "code-xml", tool: "terminal", soft: "users" };
  const STAT_ICON = ["calendar-clock", "plug", "building-2", "badge-check"];
  const icons = () => { try { window.lucide && window.lucide.createIcons(); } catch (e) { /* icons are decorative */ } };

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
    $("#stats").innerHTML = P.stats.map((s, i) => `<li><i data-lucide="${STAT_ICON[i % STAT_ICON.length]}"></i><b>${h(s.v)}</b><span>${h(t(s.l))}</span></li>`).join("");
    $("#employer").innerHTML = `<i data-lucide="building-2"></i><span><b>${h(P.employer.company)}</b> · ${h(P.employer.title)} · ${h(P.employer.period)} — ${h(t(P.employer.note))}</span>`;
    $("#timeline").innerHTML = P.experience.map((e) => `
      <li class="card">
        <div class="tl-head"><h3>${h(e.role)} <span>@ ${h(e.company)}</span></h3><time><i data-lucide="calendar-clock"></i>${h(e.period)}</time></div>
        <p class="muted small"><i data-lucide="map-pin"></i>${h(e.loc)}${e.via ? " · via " + h(e.via) : ""}</p>
        <p>${h(t(e.desc))}</p>
        ${e.bullets.length ? `<ul class="ticks">${li(e.bullets.map((b) => t(b)))}</ul>` : ""}
      </li>`).join("");
    $("#rnd").innerHTML = `<h3><i data-lucide="flask-conical"></i>${h(t(P.rnd.title))}</h3><ul class="ticks">${li(P.rnd.bullets.map((b) => t(b)))}</ul>`;
    $("#earlier").innerHTML = P.earlier.map((e) => `<li><b>${h(e.role)}</b> — ${h(e.company)} <span class="muted">· ${h(e.period)}</span></li>`).join("");
    $("#piSteps").innerHTML = STEPS.map((s) => `<li><b>${h(lang === "en" ? s[0] : s[1])}</b><span>${h(s[2])}</span></li>`).join("");
    $("#piSec").innerHTML = li(SEC.map((x) => t(x)));
    $("#skillGroups").innerHTML = Object.keys(GROUPS).map((g) => `
      <div class="card"><h3><span class="grp-ic"><i data-lucide="${GROUP_ICON[g]}"></i></span>${h(t(GROUPS[g]))}</h3><div class="tags">${P.skills.filter((s) => s.g === g).map((s) => `<span>${h(s.n)}</span>`).join("")}</div></div>`).join("");
    $("#certs").innerHTML = li(P.certifications);
    $("#edu").innerHTML = P.education.map((e) => `<li><b>${h(e.school)}</b><span>${h(t(e.degree))} · ${h(e.period)}</span></li>`).join("");
    if (!$("#cvModal").hidden) renderCV();
    icons();
  }

  // ---------- theme / language ----------
  function applyThemeIcon() {
    $("#themeBtn").innerHTML = `<i data-lucide="${document.documentElement.dataset.theme === "dark" ? "sun" : "moon"}"></i>`;
    icons();
  }
  $("#themeBtn").onclick = () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next; store.set("theme", next); applyThemeIcon();
  };
  $("#langBtn").onclick = () => { lang = lang === "en" ? "id" : "en"; store.set("lang", lang); render(); };

  // ---------- CV modal ----------
  const modal = $("#cvModal");
  let lastFocus = null, cv = null;
  // The CV is fixed to the Integration Engineer | AI Engineer profile; visitors only pick the language.
  const CV_ROLE = "int";
  const cvLangInputs = [...document.querySelectorAll('input[name="cvLang"]')];
  const cvLang = () => (cvLangInputs.find((i) => i.checked) || { value: lang }).value;
  function opts() { return { role: CV_ROLE, jd: "", l: cvLang(), headline: "" }; }

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
  }

  // Pre-built PDFs (tools/build-cv-pdf.js) open in a new tab; the modal shows the same CV as live HTML.
  const pdfUrl = (l) => `assets/cv/Hadi_Saputra_CV_Integration_AI_Engineer_${l.toUpperCase()}.pdf`;
  let cvLangTouched = false;
  function syncCV() { renderCV(); $("#cvView").href = pdfUrl(cvLang()); }
  function openCV() {
    lastFocus = document.activeElement;
    if (!cvLangTouched) cvLangInputs.forEach((i) => (i.checked = i.value === lang)); // default to the site language
    modal.hidden = false; document.body.classList.add("noscroll");
    syncCV();
    (cvLangInputs.find((i) => i.checked) || $("#cvView")).focus();
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
  cvLangInputs.forEach((i) => i.addEventListener("change", () => { cvLangTouched = true; syncCV(); }));

  // ---------- boot ----------
  $("#yr").textContent = new Date().getFullYear();
  $("#mailBtn").href = "mailto:" + P.email;
  $("#liBtn").href = P.linkedin;
  applyThemeIcon();
  render();
  if (location.hash === "#cv") openCV();
})();
