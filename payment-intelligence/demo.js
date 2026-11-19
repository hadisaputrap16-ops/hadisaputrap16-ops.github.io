// Static demo mode for GitHub Pages. The real portal calls /api/* on a proxy that holds Boomi credentials;
// here every /api/* call is answered from demo-data.json, a READ-ONLY snapshot of the Payment Intelligence database.
// Nothing is written, no email is sent, and no AI agent is called.
"use strict";
(() => {
  const realFetch = window.fetch.bind(window);
  let dataP;
  const data = () => (dataP ||= realFetch("demo-data.json").then((r) => {
    if (!r.ok) throw new Error("demo-data.json HTTP " + r.status);
    return r.json();
  }));
  const reply = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const up = (s) => String(s || "").trim().toUpperCase();
  const items = (d) => d.transactions.items || [];
  const byRef = (d, ref) => items(d).find((t) => t.investigation_ref === ref);
  const DEMO_NOTE = "Demo mode (read-only snapshot): ";

  // Newest stored transaction that matches the request; SNAP transfers and portal analyses are kept apart.
  const latest = (d, pred) => items(d).filter(pred).sort((a, b) => String(b.transaction_time || b.created_at).localeCompare(String(a.transaction_time || a.created_at)))[0];
  const notificationOf = (d, t) => {
    const inv = d.investigation[t.transaction_id] || {};
    const n = (inv.notifications || [])[0];
    if (n) return n;
    return ["POTENTIAL_FRAUD", "POTENTIAL_ILLEGAL_GAMBLING"].includes(t.classification) ? { channel: "EMAIL", status: "SENT" } : { status: "NOT_REQUIRED" };
  };
  const confidenceOf = (d, t) => {
    const dec = ((d.investigation[t.transaction_id] || {}).decisions || [])[0];
    return dec?.ai_confidence == null ? null : Number(dec.ai_confidence);
  };

  function query(d, b) {
    switch (b.action) {
      case "dashboard": return d.dashboard;
      case "alerts": return d.alerts;
      case "transactions": {
        const acc = up(b.account), cls = b.classification || "";
        let list = items(d).filter((t) =>
          (!cls || t.classification === cls) &&
          (!acc || up(t.source_account) === acc || up(t.counterparty_account) === acc) &&
          (!b.payment_id || up(t.payment_id) === up(b.payment_id)) &&
          (!b.source_account || up(t.source_account) === up(b.source_account)));
        return { ...d.transactions, items: list.slice(0, b.limit || 50) };
      }
      case "investigation": {
        const tx = b.transaction_id || (b.investigation_ref && byRef(d, b.investigation_ref)?.transaction_id);
        return d.investigation[tx] || { ok: false, error: DEMO_NOTE + "this transaction is not in the snapshot. Pick one from the case queue." };
      }
      case "approve": return { ok: false, error: DEMO_NOTE + "approvals are disabled on the static demo. In the live system this records the reviewer's decision." };
      default: return { ok: false, error: DEMO_NOTE + `action "${b.action}" is not available.` };
    }
  }

  function analyze(d, b) {
    if (/^\d{16}$/.test(String(b.payment_id || ""))) {
      return { ok: false, valid: false, errors: ["payment_id looks like a raw 16-digit NIK. Send a tokenised payment ID (PID-TKN-…)."] };
    }
    const pid = up(b.payment_id), cp = up(b.counterparty_account), mrc = up(b.merchant_id);
    const t = latest(d, (x) => !x.snap && up(x.payment_id) === pid && (!cp || up(x.counterparty_account) === cp) && (!mrc || up(x.merchant_id) === mrc))
      || latest(d, (x) => !x.snap && up(x.payment_id) === pid);
    if (!t) return { ok: false, error: DEMO_NOTE + "the static demo can only replay stored transactions. Use one of the Demo scenarios buttons." };
    return {
      ok: true, transaction_id: t.transaction_id, classification: t.classification, risk_score: t.risk_score,
      confidence: confidenceOf(d, t), detected_indicators: t.indicators || [], recommended_action: t.action,
      explanation: t.explanation, requires_human_approval: t.action === "BLOCK", investigation_ref: t.investigation_ref,
      transaction_status: (t.status || t.transaction_status || "DECIDED") + " · replayed from snapshot",
      ai: t.ai || {}, rules: { rule_score: t.rule_score }, notification: notificationOf(d, t),
    };
  }

  function transfer(d, b) {
    const pid = up(b.additionalInfo?.paymentId), ben = up(b.beneficiaryAccountNo), src = up(b.sourceAccountNo);
    // Prefer a stored SNAP transfer; otherwise replay a portal analysis of the same payer + beneficiary.
    const t = latest(d, (x) => x.snap && up(x.payment_id) === pid && up(x.counterparty_account) === ben && up(x.source_account) === src)
      || latest(d, (x) => x.snap && up(x.payment_id) === pid && up(x.counterparty_account) === ben)
      || latest(d, (x) => up(x.payment_id) === pid && up(x.counterparty_account) === ben);
    if (!t) return { ok: false, error: DEMO_NOTE + "no stored transfer matches. Use one of the Demo scenarios buttons." };
    const code = t.action === "APPROVE" ? "2001700" : "2021700"; // codes observed in stored SNAP decisions
    const s = t.snap || { response_code: code, response_message: t.action === "APPROVE" ? "Successful" : "Request In Progress", status: "DECIDED" };
    const ai = t.ai;
    const replay = "(recorded transfer: not re-signed in the static demo)";
    return {
      ok: true, responseCode: s.response_code, responseMessage: s.response_message, signatureValid: true,
      trace: {
        endpoint: "demo snapshot", ms: 0,
        request: { headers: { "X-PARTNER-ID": "PI-PARTNER-001", "X-TIMESTAMP": t.transaction_time, "X-SIGNATURE": replay }, body: { bytes: "–", encryptedData: replay } },
        response: { headers: { "X-SIGNATURE": replay }, body: { bytes: "–", encryptedData: replay, responseCode: s.response_code } },
      },
      response: {
        referenceNo: t.transaction_id, partnerReferenceNo: s.partner_reference_no, amount: { value: t.amount, currency: "IDR" },
        sourceAccountNo: t.source_account, beneficiaryAccountNo: t.counterparty_account, latestTransactionStatus: s.status,
        additionalInfo: {
          notification: notificationOf(d, t),
          riskAssessment: {
            classification: t.classification, recommendedAction: t.action, riskScore: t.risk_score, confidence: confidenceOf(d, t),
            aiVerdict: ai && { classification: ai.classification, riskScore: ai.risk_score, recommendedAction: ai.recommended_action, status: ai.status },
            ruleScore: t.rule_score, indicators: t.indicators || [], explanation: t.explanation,
            requiresHumanApproval: t.action === "BLOCK", pattern: s.pattern, investigationRef: t.investigation_ref,
          },
        },
      },
    };
  }

  // The real assistant is an Agent Garden agent; the demo answers its starter questions from the snapshot instead.
  function assistant(d, b) {
    const m = String(b.message || "").toLowerCase();
    const idr = (n) => "IDR " + Number(n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 });
    const dash = d.dashboard, c = dash.by_classification || {}, a = dash.by_action || {};
    if (/ringkas|summary|kondisi|overview/.test(m)) {
      const total = Object.values(c).reduce((x, y) => x + y, 0);
      return { ok: true, reply: `**Ringkasan (snapshot ${new Date(d.recorded_at).toLocaleDateString("id-ID")})**\n` +
        `Total transaksi teranalisis: **${total}**.\n` +
        `• POTENTIAL_FRAUD: **${c.POTENTIAL_FRAUD || 0}** transaksi, nilai berisiko **${idr(dash.amount_at_risk_idr?.fraud)}**\n` +
        `• POTENTIAL_ILLEGAL_GAMBLING: **${c.POTENTIAL_ILLEGAL_GAMBLING || 0}** transaksi, nilai berisiko **${idr(dash.amount_at_risk_idr?.gambling)}**\n` +
        `• LEGITIMATE: ${c.LEGITIMATE || 0} · INSUFFICIENT_DATA: ${c.INSUFFICIENT_DATA || 0}\n` +
        `Aksi: FLAG ${a.FLAG || 0}, REVIEW ${a.REVIEW || 0}, APPROVE ${a.APPROVE || 0}, BLOCK (usulan) ${a.BLOCK || 0}.` };
    }
    if (/fraud/.test(m)) {
      const top = items(d).filter((t) => t.classification === "POTENTIAL_FRAUD").slice(0, 5);
      return { ok: true, reply: `**5 transaksi POTENTIAL_FRAUD terbaru**\n` + top.map((t, i) =>
        `${i + 1}. **${t.transaction_id}**: ${idr(t.amount)}, skor ${t.risk_score}, aksi ${t.action}${(t.indicators || []).length ? ` (${t.indicators.slice(0, 3).join(", ")})` : ""}`).join("\n") };
    }
    if (/gagal|failed|alert/.test(m)) {
      const list = (d.alerts.items || d.alerts.alerts || []).filter((x) => /fail|undeliver/i.test(String(x.status)));
      return { ok: true, reply: list.length
        ? `**${list.length} alert gagal terkirim**\n` + list.slice(0, 8).map((x) => `• ${x.transaction_id || x.investigation_ref}: ${x.channel || ""} ${x.status}${x.error_code ? ` (kode ${x.error_code})` : ""}`).join("\n")
        : "Tidak ada alert yang gagal terkirim di snapshot ini." };
    }
    return { ok: true, reply: "Di demo statis ini AI Assistant (Boomi Agent Garden) tidak dipanggil langsung. Coba salah satu pertanyaan contoh: ringkasan kondisi, 5 transaksi POTENTIAL_FRAUD terbaru, atau alert yang gagal terkirim." };
  }

  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.url;
    if (!url.startsWith("/api/")) return realFetch(input, init);
    let body = {};
    try { body = init?.body ? JSON.parse(init.body) : {}; } catch { /* keep empty */ }
    try {
      const d = await data();
      await pause(300 + Math.random() * 500); // keep the portal's loading states visible
      if (url === "/api/query") return reply(query(d, body));
      if (url === "/api/analyze") return reply(analyze(d, body));
      if (url === "/api/transfer") return reply(transfer(d, body));
      if (url === "/api/assistant") return reply(assistant(d, body));
      if (url === "/api/refresh-alerts") return reply(d.alerts);
      return reply({ ok: false, error: DEMO_NOTE + "unknown route" }, 404);
    } catch (e) {
      return reply({ ok: false, error: "Could not load the demo snapshot: " + e.message }, 500);
    }
  };

  // Banner so visitors know what they are looking at.
  document.addEventListener("DOMContentLoaded", () => {
    const bar = document.createElement("div");
    bar.className = "demo-banner";
    bar.setAttribute("role", "note");
    bar.innerHTML = '<strong>Live demo · read-only snapshot.</strong> Data comes from the real Payment Intelligence database ' +
      '(Boomi + Agent Garden + Neon). Analyze and Transfer replay stored transactions for the preset scenarios; nothing is saved or sent. ' +
      '<a href="https://github.com/hadisaputrap16-ops/Payment-Intelligence" target="_blank" rel="noopener">Source code</a> · ' +
      '<a href="../#projects">Back to portfolio</a>';
    document.body.prepend(bar);
    data().then((d) => {
      const s = document.createElement("span");
      s.textContent = ` Snapshot: ${new Date(d.recorded_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}.`;
      bar.querySelector("strong").after(s);
    }).catch(() => {});
  });
})();
