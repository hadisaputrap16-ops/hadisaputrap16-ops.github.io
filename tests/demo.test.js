// Run: node tests/demo.test.js — the static demo must answer every portal call from demo-data.json.
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dir = path.join(__dirname, "..", "payment-intelligence");
const realFetch = async (u) => {
  assert.strictEqual(u, "demo-data.json", "only the snapshot may be fetched");
  return new Response(fs.readFileSync(path.join(dir, "demo-data.json")));
};
const window = { fetch: realFetch };
const document = { addEventListener() {} };
vm.runInNewContext(fs.readFileSync(path.join(dir, "demo.js"), "utf8"), { window, document, Response, setTimeout, console, URL });
const call = async (url, body) => (await window.fetch(url, { method: "POST", body: JSON.stringify(body) })).json();

(async () => {
  const dash = await call("/api/query", { action: "dashboard" });
  assert.ok(dash.ok && dash.by_classification, "dashboard");
  const alerts = await call("/api/query", { action: "alerts" });
  assert.ok(alerts.ok && alerts.items.length, "alerts");
  const fraud = await call("/api/query", { action: "transactions", classification: "POTENTIAL_FRAUD", limit: 50 });
  assert.ok(fraud.items.length && fraud.items.every((t) => t.classification === "POTENTIAL_FRAUD"), "classification filter");
  const inv = await call("/api/query", { action: "investigation", transaction_id: fraud.items[0].transaction_id });
  assert.ok(inv.ok && inv.transaction, "investigation by id");
  const byRef = await call("/api/query", { action: "investigation", investigation_ref: fraud.items[0].investigation_ref });
  assert.ok(byRef.ok, "investigation by ref");
  assert.strictEqual((await call("/api/query", { action: "approve", transaction_id: "x" })).ok, false, "approve disabled");

  const presets = {
    "PID-TKN-7Q2M9A": ["LEGITIMATE", { merchant_id: "MRC-SMB001" }],
    "PID-TKN-2B6N8D": ["POTENTIAL_FRAUD", { counterparty_account: "ACC-SCAM-0099" }],
    "PID-TKN-9X3L5C": ["POTENTIAL_ILLEGAL_GAMBLING", { merchant_id: "MRC-GCR088" }],
    "PID-TKN-ZZ00QX": ["INSUFFICIENT_DATA", {}],
    "PID-TKN-0P2Y4U": [null, { counterparty_account: "ACC-MULE-0001" }],
  };
  for (const [pid, [cls, extra]] of Object.entries(presets)) {
    const r = await call("/api/analyze", { payment_id: pid, ...extra });
    assert.ok(r.ok && r.investigation_ref && r.recommended_action, `analyze ${pid}`);
    if (cls) assert.strictEqual(r.classification, cls, `analyze ${pid} class`);
  }
  const nik = await call("/api/analyze", { payment_id: "3171234567890001" });
  assert.ok(nik.valid === false && nik.errors.length, "NIK rejected");
  assert.strictEqual((await call("/api/analyze", { payment_id: "PID-TKN-NOPE00" })).ok, false, "unknown payer explains demo limit");

  const transfers = [
    ["PID-TKN-7Q2M9A", "1234567890", "7770001122"], ["PID-TKN-2B6N8D", "1234567890", "ACC-SCAM-0099"],
    ["PID-TKN-9X3L5C", "5550001234", "9990088123"], ["PID-TKN-0P2Y4U", "4440009876", "ACC-MULE-0001"],
  ];
  for (const [pid, src, ben] of transfers) {
    const r = await call("/api/transfer", { sourceAccountNo: src, beneficiaryAccountNo: ben, additionalInfo: { paymentId: pid } });
    assert.ok(r.ok && r.responseCode && r.response.additionalInfo.riskAssessment.classification, `transfer ${pid}`);
  }
  for (const q of ["Ringkas kondisi fraud & judi online saat ini", "Tampilkan 5 transaksi POTENTIAL_FRAUD terbaru", "Alert mana yang gagal terkirim?", "halo"]) {
    const r = await call("/api/assistant", { message: q, history: [] });
    assert.ok(r.ok && r.reply.length > 20, `assistant: ${q}`);
  }
  console.log("demo.test.js: all checks passed");
})().catch((e) => { console.error(e); process.exit(1); });
