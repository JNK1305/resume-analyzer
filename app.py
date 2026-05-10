

import streamlit as st          
import pdfplumber              
import io                       

# Import our own helper files (we'll build these too)
from skill_extractor import extract_skills
from similarity_checker import calculate_similarity
from utils import get_result_label, get_score_color


st.set_page_config(
    page_title="AI Resume Analyzer",
    page_icon="🤖",
    layout="wide"
)

# ──  CSS Styling ──────────────────────────────────────
st.markdown("""
<style>
    .main-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: #1a1a2e;
        text-align: center;
        margin-bottom: 0.2rem;
    }
    .subtitle {
        text-align: center;
        color: #555;
        margin-bottom: 2rem;
    }
    .score-box {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 16px;
        padding: 2rem;
        text-align: center;
        font-size: 3rem;
        font-weight: 900;
        margin: 1rem 0;
    }
    .skill-chip-match {
        display: inline-block;
        background: #d4edda;
        color: #155724;
        border-radius: 20px;
        padding: 4px 14px;
        margin: 4px;
        font-size: 0.85rem;
        font-weight: 600;
    }
    .skill-chip-miss {
        display: inline-block;
        background: #f8d7da;
        color: #721c24;
        border-radius: 20px;
        padding: 4px 14px;
        margin: 4px;
        font-size: 0.85rem;
        font-weight: 600;
    }
    .result-box {
        border-radius: 12px;
        padding: 1.2rem 1.5rem;
        font-size: 1.1rem;
        font-weight: 600;
        margin-top: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# ── App Title ────────────────────────────────────────────────
st.markdown('<div class="main-title">🤖 AI Resume Analyzer</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Upload your resume & paste the job description to check your match score</div>', unsafe_allow_html=True)
st.divider()


col1, col2 = st.columns(2)

with col1:
    st.subheader("📄 Upload Resume (PDF)")
    
    uploaded_resume = st.file_uploader("Choose your resume PDF", type=["pdf"])

with col2:
    st.subheader("📋 Paste Job Description")
   
    job_description = st.text_area(
        "Paste the job description here...",
        height=200,
        placeholder="e.g. We are looking for a Python developer with SQL, AWS, and Machine Learning skills..."
    )

st.divider()


if uploaded_resume and job_description.strip():

    if st.button("🔍 Analyze Resume", use_container_width=True, type="primary"):

        # ── Step 1: Extract text from PDF ───────────────────
        with st.spinner("Reading your resume..."):
            # pdfplumber reads the PDF and extracts all text
            with pdfplumber.open(io.BytesIO(uploaded_resume.read())) as pdf:
                resume_text = ""
                for page in pdf.pages:
                    # Extract text from each page and join them
                    resume_text += page.extract_text() or ""

        if not resume_text.strip():
            st.error("❌ Could not extract text from the PDF. Make sure it's not a scanned image.")
            st.stop()

        # ── Step 2: Extract Skills ───────────────────────────
        resume_skills   = extract_skills(resume_text)
        jd_skills       = extract_skills(job_description)

        # ── Step 3: Calculate Similarity ────────────────────
        score = calculate_similarity(resume_text, job_description)  
        score_pct = round(score * 100, 1)                          

        # ── Step 4: Find matching & missing skills ──────────
        matching_skills = resume_skills & jd_skills                 
        missing_skills  = jd_skills - resume_skills                 

        # ── Step 5: Display Results ──────────────────────────
        st.subheader("📊 Analysis Results")

        result_cols = st.columns([1, 2])

        with result_cols[0]:
            # Big score display
            st.markdown(f'<div class="score-box">{score_pct}%<br><span style="font-size:1rem;font-weight:400">Match Score</span></div>', unsafe_allow_html=True)

            # Progress bar for visual representation
            st.progress(score)

            # Verdict label (Highly Suitable / Moderately / Not Suitable)
            label, bg_color = get_result_label(score_pct)
            st.markdown(f'<div class="result-box" style="background:{bg_color};color:white;">{label}</div>', unsafe_allow_html=True)

        with result_cols[1]:
            # Matching Skills
            st.markdown("#### ✅ Matching Skills")
            if matching_skills:
                chips = " ".join([f'<span class="skill-chip-match">✔ {s}</span>' for s in sorted(matching_skills)])
                st.markdown(chips, unsafe_allow_html=True)
            else:
                st.info("No matching skills found.")

            st.markdown("#### ❌ Missing Skills")
            if missing_skills:
                chips = " ".join([f'<span class="skill-chip-miss">✘ {s}</span>' for s in sorted(missing_skills)])
                st.markdown(chips, unsafe_allow_html=True)
            else:
                st.success("Great! You have all the required skills.")

        # ── ATS Tips ────────────────────────────────────────
        if missing_skills:
            st.divider()
            st.subheader("💡 Recommendations")
            st.info(f"To improve your match score, consider adding these skills to your resume or learning them: **{', '.join(sorted(missing_skills))}**")

else:
    st.info("👆 Please upload a resume PDF and paste a job description to get started.")
