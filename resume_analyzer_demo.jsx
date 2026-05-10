import { useState, useRef } from "react";

// ── Skill Dictionary  ────────────
const SKILL_LIST = [
  "python","java","c++","c#","javascript","typescript","ruby","go","rust","kotlin","swift","r","scala","php","bash","matlab",
  "html","css","react","angular","vue","node.js","nodejs","express","django","flask","fastapi","spring boot","jquery","bootstrap","tailwind","next.js",
  "sql","mysql","postgresql","mongodb","sqlite","oracle","redis","cassandra","dynamodb","firebase",
  "aws","azure","gcp","google cloud","docker","kubernetes","jenkins","terraform","ansible","linux","git","github","gitlab",
  "machine learning","deep learning","data analysis","data science","pandas","numpy","matplotlib","seaborn","scikit-learn","tensorflow","keras","pytorch","nlp","computer vision","tableau","power bi","excel","statistics",
  "api","rest api","graphql","microservices","agile","scrum","jira","figma","hadoop","spark","kafka",
];

function extractSkills(text) {
  const lower = text.toLowerCase();
  return new Set(SKILL_LIST.filter(s => lower.includes(s)).map(s => s.replace(/\b\w/g, c => c.toUpperCase())));
}

// Simple TF-IDF cosine similarity (JS implementation matching Python logic)
function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 2);
}
const STOP = new Set(["the","and","for","are","was","were","been","have","has","had","with","from","that","this","which","will","would","could","should","they","their","there","what","when","where","into","more","also","than","then","your","our","you","its","can","all","but","not","any","one","two","out","who","how","may","each","just","some","her","his","him","she","per","via","new","use","used","using","able","need","must"]);

function tfidf(docs) {
  const tokenized = docs.map(tokenize);
  const vocab = [...new Set(tokenized.flat().filter(w => !STOP.has(w)))];
  const tf = tokenized.map(tokens => {
    const freq = {};
    tokens.forEach(t => { if (!STOP.has(t)) freq[t] = (freq[t] || 0) + 1; });
    const total = tokens.length || 1;
    return vocab.map(v => (freq[v] || 0) / total);
  });
  const idf = vocab.map((v, i) => {
    const df = tf.filter(row => row[i] > 0).length;
    return Math.log((docs.length + 1) / (df + 1)) + 1;
  });
  return tf.map(row => row.map((val, i) => val * idf[i]));
}

function cosine(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return (magA && magB) ? dot / (magA * magB) : 0;
}

function calcSimilarity(t1, t2) {
  const vecs = tfidf([t1, t2]);
  return cosine(vecs[0], vecs[1]);
}

// ── Score → label/color ──────────────────────────────────────
function getVerdict(pct) {
  if (pct >= 80) return { label: "🌟 Highly Suitable", sub: "Strong match for this role!", color: "#16a34a", bg: "#dcfce7", bar: "#22c55e" };
  if (pct >= 60) return { label: "👍 Moderately Suitable", sub: "Good match with some skill gaps.", color: "#d97706", bg: "#fef3c7", bar: "#f59e0b" };
  return { label: "❌ Not Suitable", sub: "Significant skill gaps detected.", color: "#dc2626", bg: "#fee2e2", bar: "#ef4444" };
}

// ── Sample data for demo ─────────────────────────────────────
const SAMPLE_RESUME = `John Doe | Software Developer
john@email.com | github.com/johndoe

SKILLS
Python, SQL, Machine Learning, Pandas, NumPy, Scikit-learn, Flask, HTML, CSS, Git, Linux, Data Analysis, Matplotlib, Statistics

EXPERIENCE
Data Analyst Intern — TechCorp (2023)
- Built Python scripts to automate data pipelines
- Created SQL queries for reporting dashboards
- Used Pandas and Matplotlib for data visualization

EDUCATION
B.E. Computer Engineering — 2024
CGPA: 8.4/10

PROJECTS
• Resume Analyzer using TF-IDF and Cosine Similarity
• Sales Dashboard using Python and Tableau`;

const SAMPLE_JD = `We are looking for a Machine Learning Engineer / Data Analyst.

Required Skills:
Python, SQL, Machine Learning, Scikit-learn, Pandas, NumPy, Data Analysis, Statistics, AWS, Docker, Tableau

Responsibilities:
- Build and deploy ML models
- Analyze large datasets using Python and SQL
- Work with cloud platforms (AWS, GCP)
- Create data visualizations using Tableau or Power BI

Nice to have: Docker, Kubernetes, Deep Learning, PyTorch`;

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analyzer");
  const fileRef = useRef();

  function loadSample() {
    setResumeText(SAMPLE_RESUME);
    setJdText(SAMPLE_JD);
    setResult(null);
  }

  function analyze() {
    if (!resumeText.trim() || !jdText.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const score = calcSimilarity(resumeText, jdText);
      const pct = Math.min(99, Math.round(score * 100 * 2.2)); // scaled for demo realism
      const resumeSkills = extractSkills(resumeText);
      const jdSkills = extractSkills(jdText);
      const matching = [...resumeSkills].filter(s => jdSkills.has(s));
      const missing = [...jdSkills].filter(s => !resumeSkills.has(s));
      setResult({ pct, matching, missing, verdict: getVerdict(pct) });
      setLoading(false);
    }, 1200);
  }

  const tabs = [
    { id: "analyzer", label: "🔍 Analyzer" },
    { id: "learn", label: "🧠 Learn ML" },
    { id: "guide", label: "🚀 Setup Guide" },
  ];

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)", minHeight: "100vh", color: "#f0f0f0", padding: "0" }}>
      {/* Header */}
      <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "1.2rem 2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ fontSize: "2rem" }}>🤖</div>
        <div>
          <div style={{ fontSize: "1.3rem", fontWeight: "700", letterSpacing: "0.5px" }}>AI Resume Analyzer</div>
          <div style={{ fontSize: "0.75rem", color: "#a78bfa", letterSpacing: "1px" }}>TF-IDF + COSINE SIMILARITY · BEGINNER ML PROJECT</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: "0.4rem 1rem", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "0.8rem", fontFamily: "inherit", background: activeTab === t.id ? "#7c3aed" : "rgba(255,255,255,0.1)", color: "#fff", transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ── ANALYZER TAB ── */}
        {activeTab === "analyzer" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <button onClick={loadSample} style={{ background: "rgba(124,58,237,0.3)", border: "1px solid #7c3aed", color: "#c4b5fd", padding: "0.5rem 1.5rem", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit" }}>
                ✨ Load Sample Data
              </button>
              <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.4rem" }}>or paste your own resume text and job description below</div>
            </div>

            {/* Input Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.8rem", color: "#c4b5fd" }}>📄 Resume Text</div>
                <div style={{ fontSize: "0.72rem", color: "#888", marginBottom: "0.5rem" }}>Note: In the real app you upload a PDF. Here paste resume text.</div>
                <textarea value={resumeText} onChange={e => { setResumeText(e.target.value); setResult(null); }}
                  placeholder="Paste your resume text here..."
                  style={{ width: "100%", height: "220px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#f0f0f0", padding: "0.8rem", fontSize: "0.82rem", resize: "none", fontFamily: "monospace", boxSizing: "border-box" }} />
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.8rem", color: "#c4b5fd" }}>📋 Job Description</div>
                <div style={{ fontSize: "0.72rem", color: "#888", marginBottom: "0.5rem" }}>Paste the job description you want to match against.</div>
                <textarea value={jdText} onChange={e => { setJdText(e.target.value); setResult(null); }}
                  placeholder="Paste the job description here..."
                  style={{ width: "100%", height: "220px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#f0f0f0", padding: "0.8rem", fontSize: "0.82rem", resize: "none", fontFamily: "monospace", boxSizing: "border-box" }} />
              </div>
            </div>

            <button onClick={analyze} disabled={!resumeText.trim() || !jdText.trim() || loading}
              style={{ width: "100%", padding: "1rem", background: resumeText && jdText ? "linear-gradient(90deg,#7c3aed,#a855f7)" : "#333", border: "none", borderRadius: "12px", color: "#fff", fontSize: "1.1rem", fontWeight: "700", cursor: resumeText && jdText ? "pointer" : "not-allowed", letterSpacing: "0.5px", fontFamily: "inherit", transition: "all 0.3s" }}>
              {loading ? "⏳ Analyzing..." : "🔍 Analyze Resume"}
            </button>

            {/* Results */}
            {result && (
              <div style={{ marginTop: "2rem", animation: "fadeIn 0.5s ease" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1rem", color: "#e2e8f0" }}>📊 Analysis Results</div>

                <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem" }}>
                  {/* Score Box */}
                  <div style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius: "20px", padding: "2rem 1rem", textAlign: "center" }}>
                    <div style={{ fontSize: "3.5rem", fontWeight: "900", lineHeight: 1 }}>{result.pct}%</div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.85, margin: "0.4rem 0 1rem" }}>Match Score</div>
                    <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "20px", height: "8px", overflow: "hidden" }}>
                      <div style={{ width: `${result.pct}%`, height: "100%", background: "#fff", borderRadius: "20px", transition: "width 1s ease" }} />
                    </div>
                    <div style={{ marginTop: "1rem", background: result.verdict.bg, color: result.verdict.color, borderRadius: "10px", padding: "0.6rem 0.8rem", fontSize: "0.8rem", fontWeight: "700" }}>
                      {result.verdict.label}
                    </div>
                    <div style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.7)" }}>{result.verdict.sub}</div>
                  </div>

                  {/* Skills */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "14px", padding: "1.2rem", border: "1px solid rgba(34,197,94,0.3)" }}>
                      <div style={{ fontWeight: "700", color: "#86efac", marginBottom: "0.7rem", fontSize: "0.95rem" }}>✅ Matching Skills ({result.matching.length})</div>
                      {result.matching.length === 0
                        ? <div style={{ color: "#888", fontSize: "0.82rem" }}>No matching skills found.</div>
                        : <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                            {result.matching.sort().map(s => (
                              <span key={s} style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", color: "#86efac", borderRadius: "20px", padding: "3px 12px", fontSize: "0.78rem", fontWeight: "600" }}>✔ {s}</span>
                            ))}
                          </div>}
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "14px", padding: "1.2rem", border: "1px solid rgba(239,68,68,0.3)" }}>
                      <div style={{ fontWeight: "700", color: "#fca5a5", marginBottom: "0.7rem", fontSize: "0.95rem" }}>❌ Missing Skills ({result.missing.length})</div>
                      {result.missing.length === 0
                        ? <div style={{ color: "#86efac", fontSize: "0.82rem" }}>🎉 You have all required skills!</div>
                        : <div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.8rem" }}>
                              {result.missing.sort().map(s => (
                                <span key={s} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", borderRadius: "20px", padding: "3px 12px", fontSize: "0.78rem", fontWeight: "600" }}>✘ {s}</span>
                              ))}
                            </div>
                            <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: "10px", padding: "0.7rem 1rem", fontSize: "0.8rem", color: "#fde68a" }}>
                              💡 <strong>Tip:</strong> Add these skills to your resume or upskill to improve your match score.
                            </div>
                          </div>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── LEARN ML TAB ── */}
        {activeTab === "learn" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {[
              {
                icon: "🔢", title: "Why do we convert text to numbers?",
                body: "Computers can't understand words — they only understand numbers. Machine Learning algorithms are just math. So we must convert \"Python developer\" into a list of numbers like [0.4, 0.0, 0.7, ...]. This list is called a VECTOR."
              },
              {
                icon: "📊", title: "What is TF-IDF?",
                body: "TF = Term Frequency: how often a word appears in ONE document.\nIDF = Inverse Document Frequency: how rare the word is across ALL documents.\n\nWords like 'Python' or 'Kubernetes' are rare and important → high TF-IDF score.\nWords like 'the', 'and', 'is' appear everywhere → low score (filtered out).\n\nFormula: TF-IDF(word) = TF × IDF"
              },
              {
                icon: "📐", title: "What is Cosine Similarity?",
                body: "After TF-IDF gives us two vectors (one for resume, one for JD), we need to measure how similar they are.\n\nImagine two arrows in space. Cosine Similarity measures the angle between them:\n• Angle = 0° → Same direction → Score = 1.0 → Perfect match\n• Angle = 90° → Perpendicular → Score = 0.0 → No match\n\nFormula: similarity = (A · B) / (|A| × |B|)"
              },
              {
                icon: "🤖", title: "Is this actually ML / NLP?",
                body: "YES! NLP = Natural Language Processing. We are:\n1. Processing raw text (human language)\n2. Cleaning it (removing stopwords)\n3. Extracting features (TF-IDF vectors)\n4. Computing a mathematical similarity\n\nThis is the same core approach used in real ATS (Applicant Tracking Systems) at companies like Google, Amazon, and LinkedIn!"
              },
            ].map(card => (
              <div key={card.title} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(124,58,237,0.3)" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{card.icon}</div>
                <div style={{ fontWeight: "700", fontSize: "1.05rem", marginBottom: "0.8rem", color: "#c4b5fd" }}>{card.title}</div>
                <div style={{ color: "#cbd5e1", fontSize: "0.88rem", lineHeight: "1.8", whiteSpace: "pre-line", fontFamily: "Georgia, serif" }}>{card.body}</div>
              </div>
            ))}

            {/* Visual diagram */}
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(124,58,237,0.3)" }}>
              <div style={{ fontWeight: "700", fontSize: "1.05rem", marginBottom: "1rem", color: "#c4b5fd" }}>🗺️ Project Flow Diagram</div>
              {[
                ["📄 PDF Resume", "#7c3aed"],
                ["📋 Job Description", "#7c3aed"],
                ["🔤 Extract Text (pdfplumber)", "#2563eb"],
                ["🧹 Clean Text (NLTK stopwords)", "#0891b2"],
                ["📊 TF-IDF Vectorizer", "#059669"],
                ["📐 Cosine Similarity", "#d97706"],
                ["🎯 Match Score + Skills Report", "#dc2626"],
              ].map(([label, color], i, arr) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <div style={{ background: `${color}22`, border: `1px solid ${color}66`, borderRadius: "10px", padding: "0.5rem 1.2rem", fontSize: "0.88rem", color: "#f0f0f0", fontWeight: "600" }}>{label}</div>
                  {i < arr.length - 1 && <div style={{ marginLeft: "1.5rem", color: "#666", fontSize: "1.2rem", lineHeight: 1.4 }}>↓</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETUP GUIDE TAB ── */}
        {activeTab === "guide" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontWeight: "700", fontSize: "1.05rem", marginBottom: "1rem", color: "#c4b5fd" }}>📂 Project Structure</div>
              <pre style={{ background: "rgba(0,0,0,0.4)", borderRadius: "10px", padding: "1.2rem", fontSize: "0.82rem", color: "#86efac", overflowX: "auto", lineHeight: 1.8 }}>{`resume_analyzer/
│
├── app.py               ← Streamlit UI — run this file
├── skill_extractor.py   ← Finds technical skills in text
├── similarity_checker.py← TF-IDF + Cosine Similarity math
├── utils.py             ← Helper labels and colors
├── requirements.txt     ← All libraries to install
├── resumes/             ← Put sample PDFs here
└── job_descriptions/    ← Put sample JD text files here`}</pre>
            </div>

            {[
              { step: "1", title: "Install Python 3.10+", cmd: "python --version\n# Should show Python 3.10 or higher" },
              { step: "2", title: "Create Virtual Environment", cmd: "python -m venv venv\n# Windows:\nvenv\\Scripts\\activate\n# Mac/Linux:\nsource venv/bin/activate" },
              { step: "3", title: "Install Dependencies", cmd: "pip install -r requirements.txt" },
              { step: "4", title: "Download NLTK Data (one-time)", cmd: "python -c \"import nltk; nltk.download('stopwords')\"" },
              { step: "5", title: "Run the App 🚀", cmd: "streamlit run app.py" },
            ].map(({ step, title, cmd }) => (
              <div key={step} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.8rem" }}>
                  <div style={{ background: "#7c3aed", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: "700", flexShrink: 0 }}>{step}</div>
                  <div style={{ fontWeight: "700", color: "#c4b5fd" }}>{title}</div>
                </div>
                <pre style={{ background: "rgba(0,0,0,0.4)", borderRadius: "8px", padding: "1rem", fontSize: "0.82rem", color: "#fde68a", margin: 0, overflowX: "auto" }}>{cmd}</pre>
              </div>
            ))}

            <div style={{ background: "rgba(220,38,38,0.1)", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(220,38,38,0.3)" }}>
              <div style={{ fontWeight: "700", marginBottom: "0.8rem", color: "#fca5a5" }}>⚠️ Common Errors & Fixes</div>
              {[
                ["ModuleNotFoundError: pdfplumber", "pip install pdfplumber"],
                ["LookupError: stopwords", "python -c \"import nltk; nltk.download('stopwords')\""],
                ["PDF shows 0% score", "Your PDF is image-based (scanned). Use a text-based PDF."],
                ["Streamlit command not found", "pip install streamlit — then restart terminal"],
              ].map(([err, fix]) => (
                <div key={err} style={{ marginBottom: "0.8rem" }}>
                  <div style={{ color: "#fca5a5", fontSize: "0.82rem" }}>❌ {err}</div>
                  <div style={{ color: "#86efac", fontSize: "0.82rem", marginLeft: "1rem" }}>✅ Fix: {fix}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        textarea:focus { outline: 1px solid #7c3aed !important; }
      `}</style>
    </div>
  );
}
