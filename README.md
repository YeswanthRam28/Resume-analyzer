# RÉSCORE — Intelligence Resume Platform

> **AI-powered resume analysis. Roasted, scored, and market-fitted in seconds.**

RÉSCORE is a full-stack web application that analyzes resumes using large language models. Upload your PDF or DOCX and get back a comprehensive, multi-dimensional breakdown including ATS compatibility, a brutal honest roast, personality archetype profiling, credibility screening, Indian market fitness, and project/hackathon scoring — all from a single consolidated AI call.

---

## ✨ Features

| Module | Description |
|---|---|
| 🎯 **ATS Score Ring** | Keyword match analysis, section scoring, bullet quality rewrite suggestions |
| 🔥 **Roast Panel** | Darkly funny, brutally honest line-by-line critique with severity ratings |
| 🧠 **Emotion Persona Card** | Writing style archetype detection (The Ghost, The Peacock, etc.) |
| 🛡️ **Credibility Alert** | Red flags, timeline gaps, and sus claims identified by a skeptical hiring manager AI |
| 🇮🇳 **Indian Market Lens** | Placement readiness for Tier 1 campus, FAANG India, unicorn startups, and service companies |
| 🏆 **Hackathon Scorer** | Project-by-project impact scoring, vague claims detection, and reframing advice |
| 🎥 **Video IQ** | Gemini-powered video resume analysis for delivery, filler words, eye contact, and emotion |
| 📊 **Dashboard** | History of all resume and video sessions |

---

## 🏗️ Tech Stack

### Backend (`/backend`)
- **Framework**: FastAPI + Uvicorn
- **Database**: SQLModel (PostgreSQL via NeonDB / SQLite fallback)
- **AI**: NVIDIA NIM (`minimaxai/minimax-m2` via OpenAI-compatible API)
- **Video AI**: Google Gemini 2.0 Flash
- **Resume Parsing**: `pdfminer.six` + `mammoth`
- **ORM**: SQLAlchemy

### Frontend (`/frontend`)
- **Framework**: React + TypeScript + Vite
- **Styling**: Vanilla CSS (custom design system)
- **Animations**: Framer Motion
- **HTTP**: Axios
- **Routing**: React Router v7

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- NVIDIA NIM API Key ([get one here](https://build.nvidia.com))
- Google Gemini API Key ([get one here](https://aistudio.google.com/apikey))
- NeonDB PostgreSQL URL ([get one here](https://neon.tech)) *(optional — falls back to SQLite)*

---

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Fill in your API keys in .env

# Start the server
uvicorn main:app --reload
```

The API will be running at `http://localhost:8000`.

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
NVIDIA_API_KEY=nvapi-...
GEMINI_API_KEY=AIza...
DATABASE_URL=postgresql://user:password@host/dbname   # Optional - falls back to SQLite
GITHUB_TOKEN=ghp_...                                  # Optional - for GitHub repo sync
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
```

---

## 📁 Project Structure

```
Rescore/
├── backend/
│   ├── routes/
│   │   ├── resume.py       # Resume upload & master AI analysis
│   │   ├── video.py        # Video analysis (Gemini)
│   │   └── history.py      # Session history
│   ├── services/
│   │   ├── nvidia_service.py   # NVIDIA NIM LLM client
│   │   ├── gemini_service.py   # Google Gemini video client
│   │   └── parser_service.py   # PDF/DOCX text extractor
│   ├── prompts/
│   │   └── templates.py    # All AI prompts incl. MASTER_RESUME_PROMPT
│   ├── models.py           # SQLModel database models
│   ├── database.py         # DB engine, session, SQLite fallback
│   ├── main.py             # FastAPI app entry point
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── results/    # ATSScoreRing, RoastPanel, EmotionPersonaCard, etc.
    │   │   ├── upload/     # ResumeUploader, VideoRecorder
    │   │   └── ui/         # LimeButton, GlassCard, ProgressBar, etc.
    │   ├── pages/          # AnalyzePage, ResultsPage, DashboardPage, VideoPage
    │   ├── lib/            # Zustand store, utils
    │   └── router.tsx
    └── vite.config.ts
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/resume/analyze` | Upload resume + optional JD, returns full analysis |
| `GET` | `/api/resume/{session_id}` | Fetch a specific resume session |
| `POST` | `/api/video/analyze` | Upload video, returns video IQ analysis |
| `GET` | `/api/video/{session_id}` | Fetch a specific video session |
| `GET` | `/api/history/history` | Get recent resume and video sessions |

---

## 🧠 Architecture Decisions

- **Single Master Prompt**: All resume analysis (ATS, Roast, Emotion, Credibility, Indian Market, Projects) is done in a single LLM call using `MASTER_RESUME_PROMPT`. This reduces API latency from ~30s to ~10-15s.
- **Session Lifecycle Management**: The DB connection is closed before the AI call to prevent cloud SSL idle-timeout errors, and a fresh session is opened afterward to commit results.
- **Defensive Array Rendering**: All frontend components use `Array.isArray()` guards to prevent `.map()` crashes when the AI returns malformed data types.
- **SQLite Fallback**: If NeonDB is unreachable (DNS failure, network issue), the app automatically falls back to a local `rescore.db` SQLite database.

---

## 📄 License

MIT
