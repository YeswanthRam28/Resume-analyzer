# 🚀 RÉSCORE — Ultimate User Guide & Platform Blueprint

Welcome to the definitive user guide for **RÉSCORE** — the state-of-the-art AI-powered Resume Intelligence and Screening Platform. 

RÉSCORE bridges the gap between candidates seeking brutal, honest feedback to pass ATS filters and recruiters screening candidates for technical roles.

---

## 📑 Table of Contents

1. [Platform Overview](#-platform-overview)
2. [Authentication & Smart Role Onboarding](#-authentication--smart-role-onboarding)
3. [Landing Page Experience](#-landing-page-experience)
4. [Candidate Experience & Analysis Dashboard](#-candidate-experience--analysis-dashboard)
   - [Upload & AI Ingestion](#1-upload--ai-ingestion)
   - [ATS Analytics](#2-ats-analytics)
   - [Brutal Roast Mode & Prompt Synthesizer](#3-brutal-roast-mode--prompt-synthesizer)
   - [The Writer Archetype](#4-the-writer-archetype)
   - [Credibility Index](#5-credibility-index)
   - [Indian Market Lens](#6-indian-market-lens)
   - [Project Impact & Hackathon Scorer](#7-project-impact--hackathon-scorer)
   - [GitHub Sync Panel](#8-github-sync-panel)
   - [AI Redemption & Multi-Role Tailoring](#9-ai-redemption--multi-role-tailoring)
5. [Recruiter & Technical Interviewer Portal](#-recruiter--technical-interviewer-portal)
   - [Candidate Screening Engine](#1-candidate-screening-engine)
   - [Recruiter Dashboard & Pipeline](#2-recruiter-dashboard--pipeline)
6. [Mobile Optimization & Responsive Design](#-mobile-optimization--responsive-design)
7. [Technical Architecture & Database Stability](#-technical-architecture--database-stability)

---

## 🌟 Platform Overview

RÉSCORE is designed with a **Dual-Persona Architecture**:
- **Candidates**: Receive brutal line-by-line feedback, keyword gap analysis, Indian tech market tuning, and a 1-click ChatGPT/Claude prompt generator.
- **Recruiters & Interviewers**: Upload candidate resumes against specific job descriptions to instantly receive match percentages, red flag warnings, candidate strengths, and customized interview question sets.

---

## 🔐 Authentication & Smart Role Onboarding

### Clerk Secure Sign-In
Authentication is managed via Clerk OAuth and passwordless login. 
- Click **Sign In** or **Get Started** from the navbar.
- Upon authentication, users are redirected seamlessly to their personalized dashboard.

### Smart Role Auto-Detection
When signing up or logging in for the first time:
1. Users are presented with the **Global Role Selector Modal** (*Candidate / Job Seeker* vs *Recruiter / Interviewer*).
2. **Smart Database Inference**: If a user has previously created a resume analysis session or recruiter screening, RÉSCORE automatically detects their historical activity from NeonDB PostgreSQL and sets their role seamlessly — avoiding unnecessary repeated onboarding prompts.

---

## 🎨 Landing Page Experience

The landing page ([App.tsx](file:///d:/Projects/Rescore/frontend/src/App.tsx)) is built with dark-mode aesthetic, mesh gradients, custom mouse cursor tracking, and fluid Framer Motion micro-animations.

### Hero Section
- **Branding Header**: *"YOUR RESUME IS LYING TO YOU. WE FIX THAT."*
- **Interactive Score Preview Card**: Displays a floating 3D-styled card showing real-time score badges (`67/100 →`).
- **Instant Call-to-Action**: "Analyze Now" takes candidates directly to file ingestion.

### PC / Desktop Interactive Showcase
When viewed on desktop screens, scrolling down unlocks rich interactive showcase modules:
- **Live Marquee**: Real-time feature ticker scrolling through platform capabilities.
- **Problem Breakdown**: Visual statistics highlighting why 75% of resumes fail ATS parsers.
- **500vh Horizontal Scroll Feature Showcase**: A 4-panel pinned horizontal scroll track displaying:
  1. *ATS Score Ring & Keyword Breakdown*
  2. *Roast Mode Terminal Simulation*
  3. *GitHub Sync Heatmap*
  4. *Multi-Role Resume Selector*
- **How It Works**: 3-step timeline (`01 Upload`, `02 Tear Apart`, `03 Level Up`).
- **Mask Reveal Comparison**: Dynamic before/after score comparison (`54/100 → 91/100`).
- **Use Cases**: Custom persona cards for *Fresh Grads*, *Hackathon Builders*, *Career Switchers*, *FAANG Aspirants*, *Research Students*, and *Startup Founders*.

---

## 📊 Candidate Experience & Analysis Dashboard

The Candidate Dashboard ([ResultsPage.tsx](file:///d:/Projects/Rescore/frontend/src/pages/ResultsPage.tsx)) provides deep intelligence across 8 specialized dimensions.

### 1. Upload & AI Ingestion
- Upload PDF or DOCX files via `/analyze`.
- The AI Engine extracts structural text, analyzes sentence semantics, and benchmarks against thousands of tech job specs.

### 2. ATS Analytics
- **SVG Score Ring**: Visual percentage score (0-100).
- **Keyword Gap Match**: Highlights keywords present vs missing critical keywords required for your target role.
- **Section-by-Section Scoring**: Breakdown of formatting, impact verbs, and structural hierarchy.

### 3. Brutal Roast Mode & Prompt Synthesizer
- **Line-by-Line Roast**: Categorized into 3 severity levels:
  - 🟡 `MILD`: Minor phrasing or formatting fixes.
  - 🟠 `SPICY`: Vague bullet points lacking quantitative metrics.
  - 🔴 `NUCLEAR`: Major sins, buzzword overuse, or unverifiable claims.
- **Biggest Sin & Verdict**: A summary of your resume's primary weakness.
- **💡 "Prompt?" AI Synthesizer**: Toggling the *Prompt?* button opens a modal containing a pre-crafted, context-rich LLM prompt containing all your ATS gaps, red flags, missing keywords, and line roasts. Simply copy and paste it into ChatGPT, Claude, or Gemini to get a completely rewritten, 1-page resume instantly!

### 4. The Writer Archetype
Diagnoses your writing tone and resume personality (e.g., *The Modest Achiever*, *The Buzzword Stacker*, *The Silent Builder*) with clear guidance on how to shift toward an authoritative tech leader tone.

### 5. Credibility Index
Scans for suspicious dates, overlapping employment timelines, unquantified achievements, and generic claims ("responsible for backend development").

### 6. Indian Market Lens
Tailored specifically for tier-1/tier-2 Indian tech ecosystems:
- CTC & Notice Period formatting advice.
- College & Hackathon positioning tips.
- Service-to-Product company pivot guidance.

### 7. Project Impact & Hackathon Scorer
Evaluates your project bullets on the **X-Y-Z Formula**: *"Accomplished [X] as measured by [Y], by doing [Z]."*

### 8. GitHub Sync Panel
Analyzes your linked GitHub profile to identify high-star, active repositories missing from your resume and provides pre-written resume bullets to include them.

### 9. AI Redemption & Multi-Role Tailoring
Access `/tailor/:sessionId` to generate multiple targeted versions of your resume for specific job descriptions (e.g., *Frontend React Specialist*, *Full Stack Developer*, *Backend Engineer*).

---

## 👔 Recruiter & Technical Interviewer Portal

### 1. Candidate Screening Engine
Recruiters access `/analyze` under recruiter mode or navigate to `/recruiter/:sessionId`:
- **Job Description Matching**: Upload candidate resume + target job description.
- **Fit Breakdown**: Match score percentage, required vs missing technical skills, candidate strengths, and red flag warnings.
- **Tailored Interview Question Generator**: Generates technical interview questions specifically probing weak or vague areas identified on the candidate's resume.

### 2. Recruiter Dashboard & Pipeline
Located at `/dashboard` for recruiters:
- **Candidate Pipeline Table**: View all screened candidates with search filtering by name, role, or score.
- **Status Toggles**: Mark candidates as *Shortlisted*, *Screening*, or *Rejected*.
- **Quick Links**: One-click jump to full candidate analysis reports.

---

## 📱 Mobile Optimization & Responsive Design

RÉSCORE is tuned for mobile viewports:
- **Sticky Navigation Bar**: Clean top header with brand logo, quick dashboard link, and user profile avatar.
- **Slide-Out Mobile Drawer**: A mobile hamburger menu (`Menu` icon) that slides out smoothly, providing instant touch shortcuts to all 8 analysis sections, AI Redemption, and Video Analysis.
- **Hero-Focused Landing Page**: Mobile landing page is streamlined to the hero section, avoiding vertical scrolling fatigue.
- **Non-Overlapping Cards**: `RoastPanel` action buttons (`PROMPT?`, `SHARE MY ROAST`) and candidate header filenames automatically wrap and truncate cleanly on narrow screens.

---

## ⚙️ Technical Architecture & Database Stability

- **Frontend**: React 18, TypeScript, TailwindCSS, Framer Motion, Lucide Icons, Clerk Auth.
- **Backend**: FastAPI (Python), Pydantic v2, GLM-4 / Gemini AI Analysis Pipeline.
- **Database**: NeonDB PostgreSQL with SQLAlchemy pooling (`pool_recycle=300`, `pool_size=10`) and SQLite fallback for database connectivity.

---

*Documentation maintained by RÉSCORE Engine v1.0. Built with obsession in Chennai.*
