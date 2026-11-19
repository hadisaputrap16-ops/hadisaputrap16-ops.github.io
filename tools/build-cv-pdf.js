// Rebuilds assets/cv/*.pdf from the live CV in index.html (same data and print styles as the site).
//   npm i --no-save playwright && npx playwright install chromium
//   node tools/build-cv-pdf.js
// Run it after changing assets/data.js. The PDFs are text-based (selectable), so ATS parsers can read them.
// HTTPS subresources (icons, the Carlito font) are fetched with curl so certificates are checked against the system CA store.
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "assets", "cv");
const FONT_CSS = "https://fonts.googleapis.com/css2?family=Carlito:ital,wght@0,400;0,700;1,400&display=swap"; // metric-compatible with Calibri

function viaCurl(url) {
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "cvpdf-")), "body");
  const ct = execFileSync("curl", ["-sSL", "--max-time", "30", "-o", tmp, "-w", "%{content_type}", url]).toString();
  return { body: fs.readFileSync(tmp), contentType: ct || "application/octet-stream" };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.route(/^https:\/\//, (r) => r.fulfill(viaCurl(r.request().url())));
  await page.goto("file://" + path.join(ROOT, "index.html"), { waitUntil: "networkidle" });
  await page.addStyleTag({ url: FONT_CSS });
  // kerning off + wider word gaps: Chromium writes spaces as gaps, and with Carlito's narrow space, PDF text
  // extraction (what ATS parsers read) merged words like "structures to"
  await page.addStyleTag({ content: ".cv-paper, .cv-paper h1, .cv-paper h2 { font-family: Carlito, Calibri, Arial, sans-serif !important; font-kerning: none; font-feature-settings: \"kern\" 0; word-spacing: .1em; }" });

  for (const lang of ["id", "en"]) {
    await page.evaluate((l) => {
      document.querySelector("[data-open-cv]").click();
      const input = document.querySelector(`input[name="cvLang"][value="${l}"]`);
      input.checked = true;
      input.dispatchEvent(new Event("change"));
      document.body.classList.add("print-cv");
      document.title = "Hadi Saputra — CV (Integration Engineer | AI Engineer)";
    }, lang);
    await page.evaluate(() => document.fonts.ready);
    const heading = await page.textContent("#cvDoc h2");
    const file = path.join(OUT, `Hadi_Saputra_CV_Integration_AI_Engineer_${lang.toUpperCase()}.pdf`);
    await page.emulateMedia({ media: "print" });
    await page.pdf({ path: file, format: "A4", preferCSSPageSize: true, printBackground: false });
    await page.emulateMedia({ media: "screen" });
    console.log(lang, "->", path.relative(ROOT, file), `(${fs.statSync(file).size} bytes, first section "${heading}")`);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
