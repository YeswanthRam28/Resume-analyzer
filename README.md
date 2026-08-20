# 🚀 RÉSCORE — Resume Intelligence & Candidate Screening Engine

> **AI-powered resume analysis, recruiter screening, and instant resume roast — optimized for modern tech candidates and Indian market hiring.**

RÉSCORE is a full-stack platform that analyzes resumes using state-of-the-art LLMs. Upload your PDF or DOCX to receive a multi-dimensional breakdown including ATS compatibility, a brutal honest roast, writing style archetypes, credibility screening, Indian tech market tuning, GitHub project mapping, and recruiter candidate fit assessment.

📖 **[Read the Full User Guide & Blueprint (USER_GUIDE.md)](./USER_GUIDE.md)**

---

## ✨ Key Features & Capabilities

| Module | Description |
|---|---|
| 🎯 **ATS Score Ring** | Overall match percentage, keyword gap analysis (present vs missing), and section impact scoring |
| 🔥 **Brutal Roast Panel** | Line-by-line critique categorized into `MILD`, `SPICY`, and `NUCLEAR` severity ratings |
| 💡 **AI Prompt Synthesizer** | 1-click generator that compiles all resume gaps, roasts, and red flags into a pre-crafted prompt for ChatGPT / Claude / Gemini |
| 🧠 **Writer Archetype** | Diagnoses writing style tone (*The Modest Achiever*, *The Buzzword Stacker*, etc.) with positioning advice |
| 🛡️ **Credibility Index** | Detects timeline red flags, suspicious employment gaps, and unquantified fluff |
| 🇮🇳 **Indian Market Lens** | Targeted placement insights for Tier-1/2 campuses, notice period formatting, and CTC positioning |
| 🏆 **Hackathon & Project Scorer** | X-Y-Z formula evaluation (*Accomplished [X] measured by [Y] doing [Z]*) |
| 🐙 **GitHub Sync Panel** | Analyzes linked repositories to find active, high-star projects missing from your resume |
| 👔 **Recruiter Portal & Screening** | Match candidate resumes against job descriptions, generate tailored interview questions, and manage pipeline candidates |
| 📱 **Mobile Navigation Drawer** | Mobile-responsive design with hamburger slide-over menu for seamless navigation across all 8 analysis sections |
| ⚡ **Render Keep-Alive Service** | Built-in background self-ping loop calling `/health` every 10 minutes to maintain 100% server uptime on cloud hosts |

---

## 🏗️ Architecture & Tech Stack

### Backend (`/backend`)
- **Framework**: FastAPI + Uvicorn
- **Authentication & Roles**: Clerk OAuth with auto-role persistence and database inference
- **Database**: SQLAlchemy + SQLModel (NeonDB PostgreSQL with connection recycling `pool_recycle=300` & SQLite fallback)
- **AI Engine**: NVIDIA NIM / OpenRouter (`minimaxai/minimax-m2` OpenAI-compatible API)
- **Video Intelligence**: Google Gemini 2.0 Flash
- **Parsing**: `pdfminer.six` + `mammoth` (PDF / DOCX text extraction)

### Frontend (`/frontend`)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Custom Dark-mode Vanilla CSS + Tailwind Utility Classes
- **Animations**: Framer Motion
- **Routing**: React Router v7
- **Auth**: `@clerk/react`

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.11+
- Node.js 18+
- Clerk API Keys ([clerk.com](https://clerk.com))
- NVIDIA NIM or OpenRouter API Key
- NeonDB PostgreSQL URL ([neon.tech](https://neon.tech)) *(Optional — falls back to local SQLite `rescore.db`)*

---

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload
```

Backend will run at `http://localhost:8000`.

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend will run at `http://localhost:5173`.

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)
```env
NVIDIA_API_KEY=nvapi-...
GEMINI_API_KEY=AIza...
DATABASE_URL=postgresql://user:password@host/dbname  # Optional - falls back to SQLite
GITHUB_TOKEN=ghp_...                                 # Optional
RENDER_EXTERNAL_URL=https://your-backend.onrender.com # For keep-alive self-pings
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## 🔌 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health & keep-alive monitor |
| `POST` | `/api/resume/analyze` | Upload candidate resume + optional JD for full analysis |
| `GET` | `/api/resume/{session_id}` | Fetch a candidate analysis session |
| `POST` | `/api/recruiter/analyze` | Screen candidate against JD & generate interview questions |
| `GET` | `/api/recruiter/{session_id}` | Fetch recruiter screening report |
| `GET` | `/api/dashboard/me` | Auto-detect and persist user role from database activity |
| `GET` | `/api/dashboard/resumes` | Fetch user session history |

---

## 📁 Repository Structure

```
Rescore/
├── USER_GUIDE.md           # Detailed platform blueprint & user guide
├── backend/
│   ├── routes/
│   │   ├── resume.py       # Candidate resume upload & master analysis
│   │   ├── recruiter.py    # Recruiter candidate screening & questions
│   │   ├── dashboard.py   # User roles & session history
│   │   ├── tailor.py       # Multi-role resume versioning
│   │   └── history.py      # Session history
│   ├── database.py         # DB connection pooling & SQLite fallback
│   ├── models.py           # SQLModel database schemas
│   └── main.py             # FastAPI entry point & /health self-ping loop
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── results/    # RoastPanel, ATSScoreRing, GitHubSync, etc.
    │   │   ├── ui/         # Buttons, Drawers, Modals
    │   │   └── RoleGuard.tsx
    │   ├── pages/          # AnalyzePage, ResultsPage, DashboardPage, RecruiterPage
    │   ├── router.tsx
    │   └── App.tsx         # Landing page hero & PC showcase
    └── vite.config.ts
```

---

## 📄 License

MIT © 2026 RÉSCORE. Built with obsession in Chennai.
