# 🤖 AI Resume Analyzer & Candidate Screening System

Built an AI-powered Resume Analyzer using Python and NLP techniques to automate candidate screening. The application extracts text from resumes, compares it with job descriptions using TF-IDF and Cosine Similarity, calculates match percentages, detects matching/missing skills, and generates suitability recommendations through a Streamlit-based web interface.

---

## 🎯 What Does It Do?

| Feature | Description |
|--------|-------------|
| 📄 Resume Upload | Upload your resume as a PDF |
| 📋 JD Input | Paste any job description |
| 🔍 Skill Extraction | Detects 60+ technical skills |
| 📊 Match Score | TF-IDF + Cosine Similarity |
| ✅ Matching Skills | Skills found in both documents |
| ❌ Missing Skills | Skills in JD but not in resume |
| 🌟 Verdict | Highly Suitable / Moderately / Not Suitable |

---

## 🧠 ML Concepts Used

### TF-IDF (Term Frequency – Inverse Document Frequency)
Converts text into numerical vectors where important, rare words get higher scores and filler words ("the", "is") get lower scores.

### Cosine Similarity
Measures the angle between two TF-IDF vectors. A score close to 1.0 means the documents are very similar.

```
Resume Vector  →  [0.4, 0.0, 0.7, 0.2 ...]
Job Desc Vector → [0.3, 0.0, 0.8, 0.1 ...]
                           ↓
             Cosine Similarity = 0.82 → 82% Match
```

---

## 📂 Project Structure

```
resume_analyzer/
│
├── app.py               ← Streamlit UI (main file to run)
├── skill_extractor.py   ← Detects technical skills from text
├── similarity_checker.py← TF-IDF + Cosine Similarity logic
├── utils.py             ← Helper functions (labels, colors)
├── requirements.txt     ← All Python libraries needed
├── resumes/             ← (Optional) Store sample resumes here
└── job_descriptions/    ← (Optional) Store sample JDs here



---

## 📊 Score Interpretation

| Score | Result |
|-------|--------|
| 80%+ | 🌟 Highly Suitable |
| 60–79% | 👍 Moderately Suitable |
| Below 60% | ❌ Not Suitable |

---

## 🛠 Technologies Used

- **Python** — Core language
- **Streamlit** — Web UI
- **scikit-learn** — TF-IDF Vectorizer & Cosine Similarity
- **NLTK** — Stopwords for text cleaning
- **pdfplumber** — PDF text extraction

---



---


## 📝 Resume Description (for your CV)

> AI Resume Analyzer & Candidate Screening System  — Built a Streamlit web application that uses NLP techniques (TF-IDF Vectorization and Cosine Similarity) to compare candidate resumes with job descriptions, extract technical skills, compute a match percentage, and provide actionable recommendations. Technologies: Python, scikit-learn, NLTK, pdfplumber, Streamlit.

---
MIT License — Free to use and modify.
