export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  domain: string;
  /**
   * Two hex stops. The first is the project's accent — it colours the entry on
   * the coil, the case-study hero, and the WebGL particle field while that
   * project is on screen. Adjacent projects should not share a hue.
   */
  accent: [string, string];
  /**
   * Optional cover image at /public/work/<slug>.jpg. Used on the case-study
   * hero; the coil entries are typographic and do not show imagery.
   */
  cover?: string;
  liveUrl?: string;
  repoUrl?: string;
  summary: string;
  problem: string;
  approach: string[];
  features: { title: string; body: string }[];
  stack: string[];
  outcomes: string[];
};

export const projects: Project[] = [
  {
    slug: "moneymood-ai",
    title: "MoneyMood.ai",
    tagline: "AI equity intelligence for Indian markets",
    year: "2025",
    role: "Product & ML",
    domain: "Fintech / ML",
    accent: ["#0f8a5f", "#0a2f24"],
    liveUrl: "https://moneymoodai.vercel.app/",
    repoUrl: "https://github.com/adnanquraishee/moneymood.ai",
    summary:
      "An AI-powered stock-analysis platform delivering real-time market insights, price forecasts, and investment screening for Indian equities — a React frontend over a Python backend serving institutional-grade analytics to retail investors.",
    problem:
      "Retail investors in India make decisions on tips and headlines. The analytics that actually move institutional desks — factor screens, forecast bands, sentiment-adjusted signals — sit behind terminals that cost more than most portfolios.",
    approach: [
      "Ingest live market data for NSE/BSE listings and normalise it into a single time-series store.",
      "Layer forecasting models over price history to produce forward price ranges with confidence bands rather than single-point guesses.",
      "Run NLP over news and filings so sentiment becomes a scored, comparable input instead of a vibe.",
      "Expose everything through a screener that lets a non-analyst ask analyst-shaped questions.",
    ],
    features: [
      { title: "Real-time insights", body: "Live price, volume, and derived indicators updating as the session moves." },
      { title: "Price forecasting", body: "Time-series models producing horizon forecasts with explicit uncertainty ranges." },
      { title: "Investment screening", body: "Multi-factor filters across fundamentals, momentum, and sentiment." },
      { title: "Plain-language read-outs", body: "Every signal comes with a why, not just a number." },
    ],
    stack: ["React", "Python", "FastAPI", "Pandas", "Scikit-learn", "NLP", "Time-Series"],
    outcomes: [
      "Institutional-style analytics delivered through a retail interface.",
      "Forecasts framed as ranges, which changes how users size positions.",
    ],
  },
  {
    slug: "adpulse",
    title: "AdPulse",
    tagline: "AI advertisement analyzer",
    year: "2025",
    role: "ML & Frontend",
    domain: "Computer Vision / MarTech",
    accent: ["#e0563f", "#3a1108"],
    liveUrl: "https://ad-pulse-one.vercel.app/",
    repoUrl: "https://github.com/adnanquraishee/AdPulse",
    summary:
      "An AI tool that analyses advertisements — images and video — in detail to evaluate their effectiveness, scoring what is actually in the creative rather than offering a surface-level review.",
    problem:
      "Creative review is opinion dressed as expertise. Teams argue about whether an ad 'works' with no shared evidence, and post-hoc performance data arrives too late to change the creative.",
    approach: [
      "Decompose each asset into measurable creative attributes — subject, composition, colour dominance, text load, pacing.",
      "Score those attributes against effectiveness heuristics instead of scoring the ad as an undifferentiated whole.",
      "Return insights tied to specific regions and moments so a designer knows what to change.",
    ],
    features: [
      { title: "Image & video ingest", body: "Handles both static creative and cut video, frame-sampled for analysis." },
      { title: "Attribute scoring", body: "Per-dimension scores rather than one opaque effectiveness number." },
      { title: "Actionable insight", body: "Findings anchored to the part of the creative that caused them." },
    ],
    stack: ["Python", "Computer Vision", "TensorFlow", "React", "NumPy"],
    outcomes: [
      "Turns creative debate into a shared, evidence-backed scorecard.",
      "Feedback arrives before spend, not after.",
    ],
  },
  {
    slug: "pulsemonitor",
    title: "PulseMonitor",
    tagline: "Clinical decision support for cardiac arrest",
    year: "2024",
    role: "ML & Research",
    domain: "Healthcare AI",
    accent: ["#2f6fe4", "#0a1733"],
    liveUrl: "",
    repoUrl: "https://github.com/adnanquraishee/PulseMonitor",
    summary:
      "An AI-powered clinical decision support system predicting in-hospital cardiac-arrest risk from vital signs, lab results, and medical history — combining ML models, generated explanations, and a dashboard that helps medical teams identify high-risk patients early and recommend interventions.",
    problem:
      "In-hospital cardiac arrest is often preceded by hours of measurable deterioration that nobody connects in time. The signal is in the chart; the attention is not.",
    approach: [
      "Model risk from the streams a ward already collects — vitals, labs, history — so no new instrumentation is required.",
      "Optimise for early warning lead time, not just headline accuracy: a correct call at the moment of arrest is worthless.",
      "Generate an explanation alongside every risk score, because an unexplained alarm gets ignored.",
      "Rank the ward by risk so limited clinical attention goes to the right bed.",
    ],
    features: [
      { title: "Risk prediction", body: "ML models scoring deterioration risk from routine clinical data." },
      { title: "AI explanations", body: "Each score is accompanied by the factors that drove it." },
      { title: "Intervention prompts", body: "Recommended next steps attached to the patients that need them." },
      { title: "Triage dashboard", body: "Ward-level view that flags high-risk patients before escalation." },
    ],
    stack: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Streamlit"],
    outcomes: [
      "Early flagging built on data hospitals already record.",
      "Explanations designed to survive clinical scepticism.",
    ],
  },
  {
    slug: "crooked-key",
    title: "Crooked Key",
    tagline: "Real-time multiplayer hidden-traitor game",
    year: "2024",
    role: "Full-stack",
    domain: "Realtime / 3D",
    accent: ["#8b5cf6", "#1a0f33"],
    liveUrl: "",
    repoUrl: "https://github.com/adnanquraishee/CrookedKey",
    summary:
      "A real-time multiplayer game where six players compete in a hidden-traitor variant of Codenames, with one secret saboteur on each team trying to make their own side lose — full-stack, with 3D graphics, socket communication, and server-driven game logic that ensures fair play.",
    problem:
      "Hidden-role games break the moment a client knows something it shouldn't. Any state held in the browser is state a player can read — and a social deduction game with leaked roles is not a game.",
    approach: [
      "Keep the full game state on the server and send each client only what its own role is entitled to see.",
      "Drive turns, timers, and win conditions server-side so no client action can advance the game illegally.",
      "Sync six players over sockets with reconnection handling that does not leak state on rejoin.",
      "Render the board in 3D without moving secret data into the render layer.",
    ],
    features: [
      { title: "Six-player realtime", body: "Socket-synced lobby, turns, and reveals across six concurrent clients." },
      { title: "Two hidden saboteurs", body: "One secret traitor per team, each working to lose from the inside." },
      { title: "Server-authoritative", body: "Every rule is enforced server-side; clients render, they do not decide." },
      { title: "3D board", body: "Spatial presentation of the grid with per-role visibility." },
    ],
    stack: ["Node.js", "WebSockets", "Three.js", "React", "Express"],
    outcomes: [
      "Fair play guaranteed by architecture rather than trust.",
      "Reconnects without exposing hidden roles.",
    ],
  },
  {
    slug: "bioqorp",
    title: "BioQorp",
    tagline: "Healthcare data management platform",
    year: "2025",
    role: "Full-stack",
    domain: "Health Data",
    accent: ["#0ea5b7", "#04252c"],
    liveUrl: "",
    repoUrl: "https://github.com/adnanquraishee/BioQorp",
    summary:
      "A healthcare data management platform for creating, searching, and managing patient medical records through an intuitive web interface — integrating synthetic patient data generation with a modern backend API to support clinical data analysis and record keeping.",
    problem:
      "Clinical software cannot be built or tested against real patient records, and teams that need to prototype record-keeping and analysis have nowhere safe to start. Meanwhile the interfaces clinicians actually use for record entry are famously hostile.",
    approach: [
      "Generate synthetic patient data that is statistically plausible, so the platform can be built and demonstrated without touching protected health information.",
      "Model records against a schema that reflects real clinical structure — demographics, encounters, observations — rather than a flat table.",
      "Put search first: a record system nobody can query is a filing cabinet.",
      "Expose everything through an API so the same data can drive analysis as well as the interface.",
    ],
    features: [
      { title: "Record management", body: "Create, update, and retrieve structured patient records through the web interface." },
      { title: "Search", body: "Query across the record set rather than paging through it." },
      { title: "Synthetic data generation", body: "Realistic patient data for development and demonstration without privacy exposure." },
      { title: "Backend API", body: "The same endpoints serve the interface and any downstream analysis." },
    ],
    stack: ["React", "Python", "FastAPI", "PostgreSQL", "Pandas"],
    outcomes: [
      "A clinical record system that can be built and shown without real patient data.",
      "Records structured for analysis, not just storage.",
    ],
  },
  {
    slug: "knowyourcourse",
    title: "KnowYourCourse",
    tagline: "A chatbot that reads the course catalogue",
    year: "2025",
    role: "NLP & Full-stack",
    domain: "NLP / Retrieval",
    accent: ["#d6409f", "#33082a"],
    liveUrl: "https://kyc-ruby-tau.vercel.app/",
    repoUrl: "https://github.com/adnanquraishee/KYC-KnowYourCourse",
    summary:
      "A chatbot for a business school's course catalogue. You ask something like \"how many credits is the internship?\" and it answers in plain English — and shows you which pages of the catalogue it got that from.",
    problem:
      "A course catalogue is a hundred-plus pages of PDF that answers every question a student has and none of them quickly. Students ask administrators instead, and administrators answer the same dozen questions all year.",
    approach: [
      "Chunk the catalogue by section so a retrieved passage is a coherent unit, not an arbitrary window of text.",
      "Retrieve against the question, then answer only from what was retrieved — the catalogue is the authority, not the model's memory.",
      "Cite the source pages on every answer, because an uncited answer about credit requirements is worse than no answer.",
      "Answer in plain English rather than quoting policy language back at the student.",
    ],
    features: [
      { title: "Natural questions", body: "Ask in the words you would use with a person, not with a search box." },
      { title: "Page citations", body: "Every answer names the catalogue pages it came from, so it can be checked." },
      { title: "Grounded answers", body: "Responses are drawn from the retrieved passages, not generated from scratch." },
    ],
    stack: ["Python", "NLP", "Vector Search", "PDF Parsing", "React"],
    outcomes: [
      "Turns a static PDF into something a student can interrogate.",
      "Citations make the answers verifiable rather than merely fluent.",
    ],
  },
  {
    slug: "portfoliobuilderx",
    title: "PortfolioBuilderX",
    tagline: "Resume → animated portfolio, in one click",
    year: "2024",
    role: "Full-stack & AI",
    domain: "AI Tooling",
    accent: ["#d9a441", "#332305"],
    liveUrl: "https://portfolio-builder-x-rho.vercel.app/",
    repoUrl: "https://github.com/adnanquraishee/PortfolioBuilderX",
    summary:
      "A tool that instantly transforms a resume PDF into an animated portfolio website using AI — upload, customise colours and photos, and get a ready-to-deploy site you can share with one click.",
    problem:
      "Everyone with a resume needs a portfolio site and almost nobody wants to build one. The content already exists in a PDF; the gap is purely presentation.",
    approach: [
      "Parse the PDF into structured sections — experience, projects, skills — rather than dumping raw text.",
      "Map that structure onto an animated template system so layout is generated, not hand-placed.",
      "Give the user the two controls they actually care about: colour and photography.",
      "Deploy to a shareable URL in a single action.",
    ],
    features: [
      { title: "PDF parsing", body: "Resume text extracted and classified into portfolio sections." },
      { title: "Live customisation", body: "Colour palette and imagery adjustable before publish." },
      { title: "One-click deploy", body: "From upload to shareable site without touching a config file." },
    ],
    stack: ["React", "Python", "NLP", "PDF Parsing", "Node.js"],
    outcomes: [
      "Collapses a multi-day build into a single upload.",
      "Output is animated and responsive by default.",
    ],
  },
  {
    slug: "brainfuel",
    title: "BrainFuel",
    tagline: "AI homework solver with worked solutions",
    year: "2025",
    role: "Full-stack & AI",
    domain: "AI Tooling",
    accent: ["#e11d48", "#330612"],
    liveUrl: "https://brainfuel-five.vercel.app/",
    repoUrl: "https://github.com/adnanquraishee/brainfuel",
    summary:
      "An AI-powered homework solver that extracts questions from PDFs and generates professional, step-by-step solutions with properly formatted mathematics and diagrams — processing entire assignments and exporting them as polished Word documents ready for submission.",
    problem:
      "A chat window is the wrong shape for an assignment. Questions arrive as a PDF, answers need real mathematical notation and diagrams, and the output has to be a document someone can actually hand in — none of which survives a copy-paste out of a chat transcript.",
    approach: [
      "Extract questions from the PDF as discrete items, so a whole assignment is processed rather than one pasted question.",
      "Generate solutions as worked steps instead of bare answers — the reasoning is the point.",
      "Render mathematics as real formatted notation rather than plain-text approximations, and produce diagrams where the problem needs one.",
      "Export to Word, because that is the format the assignment is submitted in.",
    ],
    features: [
      { title: "PDF question extraction", body: "Reads an assignment and separates it into individual questions." },
      { title: "Step-by-step solutions", body: "Worked reasoning, not just final answers." },
      { title: "Formatted maths & diagrams", body: "Proper notation and generated figures rather than ASCII approximations." },
      { title: "Word export", body: "Output lands as a polished document ready for submission." },
    ],
    stack: ["Python", "LLM APIs", "PDF Parsing", "LaTeX", "python-docx"],
    outcomes: [
      "Handles a whole assignment in one pass instead of question by question.",
      "Output is submission-shaped, not chat-shaped.",
    ],
  },
  {
    slug: "mazdoormitra",
    title: "MazdoorMitra",
    tagline: "Digital contracting against wage theft",
    year: "2023",
    role: "Full-stack",
    domain: "Social Impact",
    accent: ["#6ea832", "#17280a"],
    liveUrl: "https://mazdoormitra.vercel.app/",
    repoUrl: "https://github.com/adnanquraishee/Mazdoor-Mitra",
    summary:
      "A platform connecting daily-wage workers with contractors through digital contracts, protecting workers from wage theft and ensuring fair payment — with a bilingual Hindi/English interface and minimum-wage validation built in to empower informal labourers in India.",
    problem:
      "Daily-wage work runs on verbal agreements. With no record of the terms, underpayment is unprovable — and the worker carries the entire cost of the ambiguity.",
    approach: [
      "Make the contract the product: every engagement produces a record both parties agreed to.",
      "Validate wage terms against statutory minimums at the point of creation, so an illegal contract cannot be issued.",
      "Ship Hindi and English as equals, not translation as an afterthought, because the user base is not English-first.",
    ],
    features: [
      { title: "Digital contracts", body: "Terms recorded and agreed by both parties before work begins." },
      { title: "Minimum-wage validation", body: "Rates checked against statutory floors at creation time." },
      { title: "Bilingual by design", body: "Full Hindi/English parity across the interface." },
    ],
    stack: ["React", "Node.js", "MongoDB", "i18n", "Express"],
    outcomes: [
      "Wage theft becomes provable instead of deniable.",
      "Accessible to workers who do not operate in English.",
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
