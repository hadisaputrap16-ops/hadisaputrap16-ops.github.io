// Single source of truth for the site AND the ATS CV. Strings may be plain or {en, id}.
window.PROFILE = {
  name: "Hadi Saputra",
  headline: {
    en: "Data Analyst | Integration Specialist | Power BI Engineer",
    id: "Data Analyst | Integration Specialist | Power BI Engineer",
  },
  location: "South Jakarta, Indonesia",
  email: "hadisaputra.p16@gmail.com",
  linkedin: "https://www.linkedin.com/in/hadisaputra16",
  site: "https://hadisaputrap16-ops.github.io",

  summary: {
    en: "API & Integration Engineer and Data Analyst with 5+ years building enterprise API solutions, data pipelines and analytics platforms across banking, credit bureau, property, mining and FMCG environments. I work at the intersection of API integration, data engineering and business intelligence — turning complex systems and operational data into scalable integrations and actionable insights.",
    id: "API & Integration Engineer sekaligus Data Analyst dengan pengalaman 5+ tahun membangun solusi API enterprise, data pipeline, dan platform analitik di sektor perbankan, biro kredit, properti, pertambangan, dan FMCG. Saya bekerja di persimpangan integrasi API, data engineering, dan business intelligence — mengubah sistem yang kompleks dan data operasional menjadi integrasi yang skalabel dan insight yang bisa ditindaklanjuti.",
  },

  stats: [
    { v: "5+", l: { en: "Years in API, integration & data", id: "Tahun di API, integrasi & data" } },
    { v: "60+", l: { en: "Banking API integrations delivered", id: "Integrasi API perbankan dikirim" } },
    { v: "7", l: { en: "Enterprise client projects", id: "Proyek klien enterprise" } },
    { v: "12/12", l: { en: "E2E tests passed (Boomi AI project)", id: "Uji E2E lulus (proyek Boomi AI)" } },
  ],

  // r: roles this skill is core for (int = Integration & AI, bi = BI & Data). k: JD keywords that match it.
  skills: [
    { n: "Boomi Integration (iPaaS)", g: "int", r: ["int"], k: ["boomi", "ipaas", "integration platform", "middleware"] },
    { n: "Boomi Agent Garden / AI Agents", g: "int", r: ["int"], k: ["agent", "ai agent", "agentic", "llm", "genai", "generative ai", "artificial intelligence", "ai"] },
    { n: "API Development & Integration (REST, SOAP, JSON, XML)", g: "int", r: ["int"], k: ["api", "rest", "restful", "soap", "json", "xml", "web service", "integration"] },
    { n: "Axway API Gateway & API Management", g: "int", r: ["int"], k: ["axway", "api gateway", "api management", "apim", "api portal"] },
    { n: "SNAP BI / BI-FAST / Open Banking APIs", g: "int", r: ["int"], k: ["snap", "bi-fast", "open api", "open banking", "banking", "payment", "fintech"] },
    { n: "API Security (SHA256withRSA, RSA-OAEP, AES-GCM, IP filtering)", g: "int", r: ["int"], k: ["security", "encryption", "rsa", "oauth", "signature", "aes", "jwt"] },
    { n: "Kafka (Confluent)", g: "int", r: ["int"], k: ["kafka", "confluent", "streaming", "event-driven", "event driven"] },
    { n: "Python", g: "lang", r: ["int", "bi"], k: ["python", "pandas"] },
    { n: "SQL", g: "data", r: ["bi", "int"], k: ["sql", "t-sql", "tsql", "queries", "query"] },
    { n: "PostgreSQL (Neon)", g: "data", r: ["int", "bi"], k: ["postgres", "postgresql", "neon", "rdbms", "database"] },
    { n: "Java (custom mapping functions)", g: "lang", r: ["int"], k: ["java"] },
    { n: "JavaScript / Node.js", g: "lang", r: ["int"], k: ["javascript", "node.js", "nodejs", "node"] },
    { n: "Power BI", g: "bi", r: ["bi"], k: ["power bi", "powerbi", "dashboard", "dashboards", "reporting", "visualization", "visualisation"] },
    { n: "DAX", g: "bi", r: ["bi"], k: ["dax", "measures", "kpi", "kpis"] },
    { n: "Data Modeling (Star Schema, Fact & Dimension, Semantic Models)", g: "bi", r: ["bi"], k: ["data model", "data modeling", "data modelling", "star schema", "dimensional", "semantic model", "fact table"] },
    { n: "SQL Data Warehousing", g: "data", r: ["bi"], k: ["data warehouse", "data warehousing", "dwh", "edw", "warehouse"] },
    { n: "ETL / ELT & Data Transformation", g: "data", r: ["bi", "int"], k: ["etl", "elt", "transformation", "data pipeline", "pipelines", "pipeline", "ssis", "data factory"] },
    { n: "Data Quality, Cleansing & Validation", g: "data", r: ["bi"], k: ["data quality", "cleansing", "validation", "data governance"] },
    { n: "Exploratory & Root-Cause Analysis", g: "bi", r: ["bi"], k: ["analytics", "analysis", "root cause", "root-cause", "insights", "exploratory", "statistics"] },
    { n: "Supply Chain & Inventory Analytics (DIO, WAPE, Bias)", g: "bi", r: ["bi"], k: ["supply chain", "inventory", "forecast", "forecasting", "wape", "dio", "demand planning", "stock"] },
    { n: "Power BI Tenant Migration & Workspace Administration", g: "bi", r: ["bi"], k: ["migration", "tenant", "workspace", "administration", "fabric", "power bi service"] },
    { n: "Docker", g: "tool", r: ["int"], k: ["docker", "container", "containers"] },
    { n: "Git", g: "tool", r: ["int", "bi"], k: ["git", "github", "version control"] },
    { n: "Stakeholder Collaboration & Requirements Translation", g: "soft", r: ["int", "bi"], k: ["stakeholder", "stakeholders", "communication", "requirements", "collaboration"] },
  ],

  roles: {
    bi: {
      label: { en: "BI & Data Engineer", id: "BI & Data Engineer" },
      title: "Business Intelligence & Data Engineer",
      summary: {
        en: "BI & Data Engineer with 5+ years across data and integration work. I turn data warehouse structures into star-schema models, semantic models and Power BI dashboards (SQL, DAX) for sales, expense, inventory and supply-chain KPIs such as DIO, WAPE and forecast bias. My background in API and ETL integration means I can build pipelines from source systems all the way to insight.",
        id: "BI & Data Engineer dengan pengalaman 5+ tahun di bidang data dan integrasi. Saya mengubah struktur data warehouse menjadi model star-schema, semantic model, dan dashboard Power BI (SQL, DAX) untuk KPI penjualan, biaya, inventori, dan supply chain seperti DIO, WAPE, dan forecast bias. Latar belakang di integrasi API dan ETL membuat saya bisa membangun pipeline dari sistem sumber hingga menjadi insight.",
      },
    },
    int: {
      label: { en: "Integration & AI Developer", id: "Integration & AI Developer" },
      title: "Integration & AI Developer",
      summary: {
        en: "Integration & AI Developer with 5+ years delivering enterprise APIs. I have shipped 60+ banking API integrations (SNAP BI, BI-FAST, BRANKAS) on Axway API Gateway. More recently I built an AI-powered fraud detection platform on Boomi Integration and Agent Garden, with Neon PostgreSQL behind it. I build secure APIs with signing, encryption and audit trails, design error-tolerant orchestration, and add AI agents with a human in the loop.",
        id: "Integration & AI Developer dengan pengalaman 5+ tahun membangun API enterprise. Saya telah menyelesaikan 60+ integrasi API perbankan (SNAP BI, BI-FAST, BRANKAS) di Axway API Gateway. Terakhir, saya membangun platform deteksi fraud berbasis AI di atas Boomi Integration dan Agent Garden, dengan Neon PostgreSQL sebagai basis datanya. Saya membangun API yang aman dengan signing, enkripsi, dan audit trail, merancang orkestrasi yang tahan gangguan, dan memasang agen AI dengan human-in-the-loop.",
      },
    },
  },

  employer: {
    company: "NTT DATA, Inc.",
    title: "Associate Application Engineer",
    period: "Jul 2021 – Present",
    note: { en: "Placed at enterprise clients as API developer, software engineer and data analyst.", id: "Ditempatkan di klien enterprise sebagai API developer, software engineer, dan data analyst." },
  },

  experience: [
    {
      role: "Data Analyst", company: "PT Ajinomoto Indonesia", via: "NTT DATA", period: "Jul 2026 – Present", loc: "Tanjung Priok, Jakarta", tags: ["bi"],
      desc: { en: "Develop analytical data solutions by transforming data warehouse structures into reliable data models, analytical datasets and BI reporting.", id: "Membangun solusi data analitik dengan mengubah struktur data warehouse menjadi model data, dataset analitik, dan laporan BI yang andal." },
      bullets: [
        { en: "Analyze data warehouse structures to identify data sources, relationships, business rules and data quality issues.", id: "Menganalisis struktur data warehouse untuk mengidentifikasi sumber data, relasi, aturan bisnis, dan masalah kualitas data." },
        { en: "Design and develop fact and dimension tables for scalable, efficient analytical data models.", id: "Merancang dan membangun tabel fakta dan dimensi untuk model data analitik yang skalabel dan efisien." },
        { en: "Build interactive Power BI dashboards backed by complex SQL queries and DAX measures for business KPIs.", id: "Membangun dashboard Power BI interaktif dengan query SQL kompleks dan measure DAX untuk KPI bisnis." },
        { en: "Bad Stock Analysis: analyzed damaged, expired, non-moving and potentially obsolete inventory to surface inventory risk and stock optimization opportunities.", id: "Bad Stock Analysis: menganalisis stok rusak, kedaluwarsa, tidak bergerak, dan berpotensi usang untuk mengungkap risiko inventori dan peluang optimasi stok." },
        { en: "Inventory Aging Analysis: analyzed aging and movement patterns to identify slow-moving stock and support inventory control.", id: "Inventory Aging Analysis: menganalisis umur dan pola pergerakan stok untuk mengidentifikasi stok lambat dan mendukung kontrol inventori." },
        { en: "Perform data transformation, cleansing and validation, plus exploratory and root-cause analysis on trends and anomalies.", id: "Melakukan transformasi, pembersihan, dan validasi data, serta analisis eksploratif dan root-cause atas tren dan anomali." },
      ],
    },
    {
      role: "Business Intelligence Specialist", company: "PT Vale Indonesia", via: "NTT DATA", period: "Sep 2026 – Oct 2026", loc: "Jakarta", tags: ["bi"],
      desc: { en: "Power BI tenant-to-tenant migration, keeping reporting continuous in the new environment.", id: "Migrasi Power BI tenant-to-tenant dengan menjaga kontinuitas pelaporan di lingkungan baru." },
      bullets: [
        { en: "Migrated and validated Power BI workspaces, reports, dashboards and semantic models between tenants.", id: "Memigrasikan dan memvalidasi workspace, report, dashboard, dan semantic model Power BI antar-tenant." },
        { en: "Re-bound semantic models and reconfigured data sources so migrated reports stayed connected to the correct data.", id: "Melakukan re-binding semantic model dan konfigurasi ulang sumber data agar report hasil migrasi tetap terhubung ke data yang benar." },
        { en: "Ran post-migration validation of data accuracy, refresh configuration, relationships, measures and report behaviour.", id: "Menjalankan validasi pasca-migrasi atas akurasi data, konfigurasi refresh, relasi, measure, dan fungsi report." },
        { en: "Documented dependencies and validation results to make the migration structured and repeatable.", id: "Mendokumentasikan dependensi dan hasil validasi agar migrasi terstruktur dan dapat diulang." },
      ],
    },
    {
      role: "Data Analyst", company: "Sinarmas Land", via: "NTT DATA", period: "Jul 2025 – Jul 2026", loc: "South Jakarta", tags: ["bi"],
      desc: { en: "End-to-end BI solutions from data warehouse to analytical models, reusable datasets and Power BI dashboards.", id: "Solusi BI end-to-end dari data warehouse ke model analitik, dataset reusable, dan dashboard Power BI." },
      bullets: [
        { en: "Developed Power BI dashboards for Daily Sales, Gimmick Customer and Selling Expense analytics.", id: "Membangun dashboard Power BI untuk analitik Daily Sales, Gimmick Customer, dan Selling Expense." },
        { en: "Designed analytical data models and reusable datasets to support scalable business reporting.", id: "Merancang model data analitik dan dataset reusable untuk mendukung pelaporan bisnis yang skalabel." },
        { en: "Performed SQL-based extraction, transformation, cleansing and validation to prepare reliable datasets.", id: "Melakukan ekstraksi, transformasi, pembersihan, dan validasi berbasis SQL untuk menyiapkan dataset yang andal." },
        { en: "Built DAX measures to monitor sales performance, customer activity, expenses and operational KPIs.", id: "Membangun measure DAX untuk memantau kinerja penjualan, aktivitas pelanggan, biaya, dan KPI operasional." },
        { en: "Translated business requirements into metrics, data models and actionable insights for stakeholders.", id: "Menerjemahkan kebutuhan bisnis menjadi metrik, model data, dan insight yang bisa ditindaklanjuti stakeholder." },
      ],
    },
    {
      role: "Software Engineer", company: "Bank Permata", via: "NTT DATA", period: "Oct 2024 – May 2025", loc: "South Jakarta", tags: ["int"],
      desc: { en: "Developed and enhanced the Permata Developer Portal that centralizes API documentation and integration resources.", id: "Mengembangkan Permata Developer Portal yang memusatkan dokumentasi API dan sumber daya integrasi." },
      bullets: [
        { en: "Built portal features for API discovery, documentation and developer onboarding.", id: "Membangun fitur portal untuk discovery API, dokumentasi, dan onboarding developer." },
        { en: "Structured API documentation and integration resources to improve developer experience.", id: "Menyusun dokumentasi API dan sumber daya integrasi untuk meningkatkan developer experience." },
        { en: "Worked with business, technology and API teams on enhancements aligned with the bank's API ecosystem.", id: "Berkolaborasi dengan tim bisnis, teknologi, dan API untuk peningkatan yang selaras dengan ekosistem API bank." },
      ],
    },
    {
      role: "API Developer / API Consultant", company: "PEFINDO Biro Kredit", via: "NTT DATA", period: "Dec 2023 – Feb 2025", loc: "South Jakarta", tags: ["int"],
      desc: { en: "Implemented enterprise API management across Development, UAT and Production with Axway API Management.", id: "Mengimplementasikan API management enterprise di Development, UAT, dan Production dengan Axway API Management." },
      bullets: [
        { en: "Deployed and configured Axway API Management and API Portal across 3 environments (DEV, UAT, PROD).", id: "Men-deploy dan mengonfigurasi Axway API Management dan API Portal di 3 environment (DEV, UAT, PROD)." },
        { en: "Developed and integrated APIs connecting enterprise applications with PostgreSQL and backend services.", id: "Membangun dan mengintegrasikan API yang menghubungkan aplikasi enterprise dengan PostgreSQL dan layanan backend." },
        { en: "Customized API Portal functionality and developer-facing API resources.", id: "Menyesuaikan fungsionalitas API Portal dan sumber daya API untuk developer." },
        { en: "Handled API testing, troubleshooting, deployment and configuration for reliable integration.", id: "Menangani pengujian, troubleshooting, deployment, dan konfigurasi API untuk integrasi yang andal." },
      ],
    },
    {
      role: "API Developer", company: "Bank BTPN", via: "NTT DATA", period: "Aug 2021 – Feb 2025", loc: "South Jakarta", tags: ["int"],
      desc: { en: "Delivered 60+ banking API integrations across SNAP and BRANKAS on Axway API Gateway.", id: "Menyelesaikan 60+ integrasi API perbankan untuk SNAP dan BRANKAS di Axway API Gateway." },
      bullets: [
        { en: "Delivered 60+ banking API integrations supporting SNAP (Standar Nasional Open API Pembayaran), BRANKAS, BI-FAST and Credit Scoring.", id: "Menyelesaikan 60+ integrasi API perbankan untuk SNAP (Standar Nasional Open API Pembayaran), BRANKAS, BI-FAST, dan Credit Scoring." },
        { en: "Owned the full API lifecycle: design, data mapping, transformation, validation, testing, deployment and monitoring.", id: "Memegang siklus API penuh: desain, data mapping, transformasi, validasi, pengujian, deployment, dan monitoring." },
        { en: "Integrated internal banking systems with external partners through secure, scalable API architectures.", id: "Mengintegrasikan sistem internal bank dengan mitra eksternal melalui arsitektur API yang aman dan skalabel." },
        { en: "Troubleshot and optimized API flows to improve reliability and interoperability.", id: "Melakukan troubleshooting dan optimasi alur API untuk meningkatkan keandalan dan interoperabilitas." },
      ],
    },
    {
      role: "API Developer", company: "Astra Finance", via: "NTT DATA", period: "Jul 2021 – Aug 2021", loc: "Jakarta", tags: ["int"],
      desc: { en: "API development engagement.", id: "Proyek pengembangan API." }, bullets: [],
    },
  ],

  rnd: {
    title: { en: "R&D — Axway API Gateway & Kafka", id: "R&D — Axway API Gateway & Kafka" },
    bullets: [
      { en: "Installed a high-availability (HA) cluster of Axway API Management; upgraded API Gateway 7.7 (Nov 2021 → May 2023) and wrote the rollback procedure.", id: "Instalasi cluster high-availability (HA) Axway API Management; upgrade API Gateway 7.7 (Nov 2021 → May 2023) beserta prosedur rollback." },
      { en: "Connected Axway API Gateway to Kafka (Confluent) and created topics for event-driven integration.", id: "Menghubungkan Axway API Gateway ke Kafka (Confluent) dan membuat topic untuk integrasi event-driven." },
      { en: "Implemented RSA-based request encryption/decryption, SOAP signature generation and IP filtering on the gateway.", id: "Implementasi enkripsi/dekripsi request berbasis RSA, pembuatan SOAP signature, dan IP filtering di gateway." },
      { en: "Built custom Java mapping functions, XML→JSON transformation and REST consumption with JSON Schema in inline processing.", id: "Membuat custom function Java di mapping, transformasi XML→JSON, dan konsumsi REST dengan JSON Schema di inline processing." },
    ],
  },

  earlier: [
    { role: "Warehouse Administrator", company: "PT. Mest Indonesiy", period: "Feb 2019 – Mar 2020", loc: "" },
    { role: "Intern", company: "Kepolisian Daerah Lampung", period: "Jun 2017 – Aug 2017", loc: "Bandar Lampung" },
  ],

  projects: [
    {
      id: "pi", featured: true, tags: ["int"],
      name: "Payment Intelligence — AI-Powered Financial Crime Detection",
      period: "Nov 2026",
      stack: ["Boomi Integration", "Boomi Agent Garden", "Neon PostgreSQL", "SNAP API", "Python proxy", "JavaScript"],
      cv: [
        { en: "Built a real-time fraud and illegal-gambling detection platform: Boomi Integration orchestrates, Boomi Agent Garden AI agents score each transaction, and Neon PostgreSQL holds the rules and decision engine.", id: "Membangun platform deteksi fraud dan judi online real-time: Boomi Integration sebagai orkestrator, agen AI Boomi Agent Garden menilai setiap transaksi, dan Neon PostgreSQL menyimpan rules dan decision engine." },
        { en: "Analyzed 92 transactions (out of 449 ingested) and detected IDR 225.7M of potential fraud and IDR 9.8M of illegal-gambling exposure, each decision with explainable indicators.", id: "Menganalisis 92 transaksi (dari 449 yang masuk) dan mendeteksi IDR 225,7 jt potensi fraud serta IDR 9,8 jt eksposur judi online, tiap keputusan disertai indikator yang dapat dijelaskan." },
        { en: "Designed a hybrid decision engine: 60% AI + 40% across 13 weighted deterministic rules, with rule overrides, a conservative path for insufficient data, and human approval required for BLOCK.", id: "Merancang decision engine hibrida: 60% AI + 40% dari 13 rules deterministik berbobot, dengan override rules, jalur konservatif untuk data kurang, dan BLOCK wajib persetujuan manusia." },
        { en: "Secured a SNAP-style intrabank transfer API (SNAPShield) with SHA256withRSA signatures, RSA-OAEP + AES-256-GCM encryption and a 30-day pattern guard.", id: "Mengamankan API transfer intrabank bergaya SNAP (SNAPShield) dengan signature SHA256withRSA, enkripsi RSA-OAEP + AES-256-GCM, dan pattern guard 30 hari." },
        { en: "Passed 12/12 automated end-to-end tests (proxy → Boomi → Neon → Agent Garden → email alert), covering fraud, gambling, NIK validation and the AI assistant.", id: "Lulus 12/12 pengujian end-to-end otomatis (proxy → Boomi → Neon → Agent Garden → alert email), mencakup fraud, judi, validasi NIK, dan AI assistant." },
      ],
    },
    {
      id: "sc", featured: false, tags: ["bi"],
      name: "Supply Chain Inventory Analytics — Power BI & SQL Data Warehouse",
      period: "2026",
      stack: ["SQL Data Warehouse", "Star Schema", "Power BI", "DAX", "Power Query"],
      cv: [
        { en: "Designed a star-schema SQL data warehouse layer (inventory snapshot, movement, forecast and sales facts with conformed product, location and date dimensions) for supply-chain reporting.", id: "Merancang lapisan SQL data warehouse star-schema (fakta snapshot inventori, pergerakan, forecast, dan penjualan dengan dimensi produk, lokasi, dan tanggal yang seragam) untuk pelaporan supply chain." },
        { en: "Built DAX measures for Days Inventory Outstanding (DIO), forecast accuracy (WAPE) and forecast Bias to monitor working capital and planning quality.", id: "Membangun measure DAX untuk Days Inventory Outstanding (DIO), akurasi forecast (WAPE), dan forecast Bias untuk memantau modal kerja dan kualitas perencanaan." },
        { en: "Delivered Inventory Expiration Tracking and aging buckets to flag near-expiry, non-moving and bad stock before write-off.", id: "Menyediakan Inventory Expiration Tracking dan bucket umur stok untuk menandai stok mendekati kedaluwarsa, tidak bergerak, dan bad stock sebelum write-off." },
      ],
    },
  ],

  education: [
    { school: "Universitas Terbuka", degree: { en: "Bachelor's degree, Information Systems", id: "Sarjana (S1), Sistem Informasi" }, period: "2025" },
    { school: "Politeknik Negeri Lampung", degree: { en: "Associate's degree, Information Systems Management", id: "Diploma (D3), Manajemen Sistem Informasi" }, period: "2015 – 2018" },
  ],

  certifications: [
    "Cisco Certified Network Associate Security (CCNA Security)",
    "Axway — Amplify API Management Components Overview",
    "Axway — API Gateway and Manager",
    "Axway — API Portal Overview",
    "ST Flow Engineer Basic",
  ],
};
