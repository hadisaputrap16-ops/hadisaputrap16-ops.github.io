// Run: node tests/cv.test.js — checks the JD-keyword tailoring used by the ATS CV.
const assert = require("assert");
global.window = {};
require("../assets/data.js");
const { hits, buildCV } = require("../assets/app.js");

assert.deepStrictEqual(hits("Experience with Power BI and DAX", ["power bi", "dax", "sql"]), ["power bi", "dax"]);
assert.deepStrictEqual(hits("maintain repositories", ["ai"]), [], "'ai' must not match inside words");
assert.deepStrictEqual(hits("", ["sql"]), []);

const bi = buildCV({ role: "bi", jd: "", l: "en" });
assert.ok(bi.skills.slice(0, 4).includes("Power BI") && bi.skills.slice(0, 4).includes("SQL"), "BI role leads with BI skills");
const jd = "We need Kafka streaming and Docker containers experience";
const tailored = buildCV({ role: "bi", jd, l: "en" });
assert.ok(tailored.skills.indexOf("Kafka (Confluent)") < 2, "JD keyword moves Kafka to the top");
assert.ok(tailored.summary.includes("Kafka"), "summary mentions matched strengths");
const integ = buildCV({ role: "int", jd: "", l: "id" });
assert.strictEqual(integ.projects[0].name.startsWith("Payment Intelligence"), true);
assert.strictEqual(integ.H.exp, "Pengalaman Kerja");
console.log("cv.test.js: all checks passed");
