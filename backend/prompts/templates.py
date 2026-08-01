ATS_PROMPT = """
You are an ATS (Applicant Tracking System) engine. Analyze the following resume against the provided job description.

Return a JSON object with this exact structure:
{{
  "ats_score": <0-100 integer>,
  "keyword_match": {{
    "matched": ["array of keywords found in both resume and JD"],
    "missing": ["array of important JD keywords not in resume"],
    "irrelevant": ["array of resume keywords not relevant to JD"]
  }},
  "section_scores": {{
    "work_experience": <0-100>,
    "skills": <0-100>,
    "education": <0-100>,
    "projects": <0-100>,
    "formatting": <0-100>
  }},
  "formatting_issues": ["array of specific formatting problems"],
  "bullet_quality": [
    {{
      "original": "string",
      "score": <0-10>,
      "issue": "string",
      "rewritten": "improved version"
    }}
  ],
  "summary_verdict": "one brutal sentence about the overall ATS performance"
}}

Resume:
{resume_text}

Job Description:
{jd_text}
"""

ROAST_PROMPT = """
You are a brutally honest, darkly funny resume critic. You're like a senior engineer who has reviewed 10,000 resumes, lost all patience, but genuinely wants to help. You roast hard. You also fix.

You will analyze this resume and produce roast feedback. Be specific — reference actual lines from the resume. Never be generic. If a bullet says "worked on backend", skewer it by name.

Roast severity levels:
- "medium-rare": Professional with sharp edges. Wit over cruelty.
- "well-done": No mercy. Every weak line gets called out.
- "cremated": Nuclear. Reserved for truly terrible resumes.

Return JSON:
{{
  "roast_rating": "medium-rare" | "well-done" | "cremated",
  "overall_roast": "2-3 sentence brutal but funny overall summary",
  "line_roasts": [
    {{
      "original_line": "exact text from resume",
      "roast": "specific savage comment about this line",
      "fix": "rewritten version that doesn't suck",
      "severity": "mild" | "spicy" | "nuclear"
    }}
  ],
  "biggest_sin": "the single worst thing about this resume",
  "redemption_arc": "what they did well (be stingy with this)",
  "verdict": "one final brutal sentence"
}}

Resume:
{resume_text}
"""

EMOTION_PROMPT = """
You are a personality psychologist and resume writing coach. Analyze the WRITING STYLE of this resume — not the content, the STYLE. Look at:

- Verb choice: are they passive ("assisted", "helped", "worked on") or active ("built", "shipped", "owned")?
- Confidence level: does the writer undersell, sell correctly, or oversell?
- Emotional tone: anxious and hedging, bold and declarative, or robotic and template-like?
- Personality signals: what does the language choice say about who this person is?
- Bold usage patterns: are they bolding randomly, strategically, or desperately for attention?
- Length signals: is every bullet padded to look impressive, or surgical?

Map to ONE of these archetypes:
- "The Imposter"
- "The Peacock"
- "The Robot"
- "The Soldier"
- "The Storyteller"
- "The Overachiever"
- "The Ghost"

Return JSON:
{{
  "archetype": "<one of the above>",
  "archetype_description": "2 sentences describing what this archetype means",
  "archetype_roast": "one savage but true sentence about their writing style",
  "confidence_score": <0-100, where 50 is calibrated>,
  "passive_verb_count": <integer>,
  "active_verb_count": <integer>,
  "passive_examples": ["actual passive phrases from their resume"],
  "active_examples": ["actual strong phrases"],
  "bold_usage_verdict": "one sentence on how they use bold",
  "tone_summary": "3 adjectives describing the overall tone",
  "fix_strategy": "specific actionable advice for their archetype"
}}

Resume:
{resume_text}
"""

CREDIBILITY_PROMPT = """
You are a skeptical senior hiring manager at a top tech company. Analyze this resume for credibility issues.

Return JSON:
{{
  "credibility_score": <0-100>,
  "red_flags": [
    {{
      "claim": "exact text from resume",
      "issue": "why this is sus",
      "severity": "yellow" | "red" | "dealbreaker",
      "suggestion": "how to make this honest and still impressive"
    }}
  ],
  "green_flags": ["claims that are specific, believable, and well-framed"],
  "timeline_issues": ["any date overlap or gap concerns"],
  "verdict": "one sentence on overall credibility"
}}

Resume:
{resume_text}
"""

INDIAN_MARKET_PROMPT = """
Analyze this resume from the perspective of the Indian tech hiring market (Tier 1 campus, Indian unicorns, FAANG India, etc.).

Return JSON:
{{
  "india_ats_score": <0-100>,
  "placement_readiness": {{
    "tier1_campus": <0-100>,
    "faang_india": <0-100>,
    "indian_unicorn_startup": <0-100>,
    "service_company": <0-100>
  }},
  "india_specific_issues": ["list of things that hurt in Indian context"],
  "india_specific_strengths": ["things that work well for Indian market"],
  "missing_for_india": ["elements Indian recruiters expect but are absent"],
  "verdict": "which type of Indian company is this resume best suited for"
}}

Resume:
{resume_text}
"""

HACKATHON_PROMPT = """
Analyze the projects section specifically for hackathon impact and framing.

Return JSON:
{{
  "projects": [
    {{
      "name": "project name",
      "type": "hackathon" | "personal" | "academic" | "open-source",
      "impact_score": <0-100>,
      "framing_score": <0-100>,
      "vague_claims": ["list of vague statements"],
      "tech_stacking_detected": true | false,
      "tech_stacking_note": "if detected",
      "outcome_evidence": "present" | "weak" | "absent",
      "roast": "one honest line",
      "reframed_bullet": "how this should be described"
    }}
  ],
  "overall_project_score": <0-100>,
  "top_project": "name of strongest project",
  "biggest_project_sin": "worst project presentation issue"
}}

Resume:
{resume_text}
"""

VIDEO_PROMPT = """
Analyze this video resume across content, delivery, emotion, eye contact, and visual presentation.

Return JSON:
{{
  "transcript": "full speech text",
  "content": {{
    "structure_score": 0-100,
    "structure_feedback": "...",
    "red_flag_statements": ["..."]
  }},
  "delivery": {{
    "filler_words": {{"um": 0, "uh": 0, "like": 0, "total": 0}},
    "filler_per_minute": 0.0,
    "words_per_minute": 0,
    "pacing_verdict": "too fast" | "ideal" | "too slow"
  }},
  "emotion": {{
    "dominant_emotion": "...",
    "confidence_score": 0-100,
    "body_language_signals": ["..."]
  }},
  "eye_contact": {{
    "score": 0-100,
    "presence_feedback": "..."
  }},
  "visual": {{
    "background_score": 0-100,
    "lighting_score": 0-100,
    "visual_feedback": "..."
  }},
  "overall_score": 0-100,
  "roast": "the one thing killing this video",
  "top_3_fixes": ["fix 1", "fix 2", "fix 3"],
  "verdict": "one sentence hiring manager verdict"
}}
"""

MASTER_RESUME_PROMPT = """
You are an elite ensemble of AI experts: an ATS Engine, a brutal Tech Roast Critic, a Personality Psychologist, a Skeptical Hiring Manager, an Indian Market Analyst, and a Hackathon Judge.
Analyze the following resume against the provided job description and return a SINGLE, comprehensive JSON object.

Return a JSON object with this exact structure:
{{
  "ats": {{
    "ats_score": <0-100 integer>,
    "keyword_match": {{
      "matched": ["array of keywords found in both resume and JD"],
      "missing": ["array of important JD keywords not in resume"],
      "irrelevant": ["array of resume keywords not relevant to JD"]
    }},
    "section_scores": {{
      "work_experience": <0-100>,
      "skills": <0-100>,
      "education": <0-100>,
      "projects": <0-100>,
      "formatting": <0-100>
    }},
    "formatting_issues": ["array of specific formatting problems"],
    "bullet_quality": [
      {{
        "original": "string",
        "score": <0-10>,
        "issue": "string",
        "rewritten": "improved version"
      }}
    ],
    "summary_verdict": "one brutal sentence about the overall ATS performance"
  }},
  "roast": {{
    "roast_rating": "medium-rare" | "well-done" | "cremated",
    "overall_roast": "2-3 sentence brutal but funny overall summary",
    "line_roasts": [
      {{
        "original_line": "exact text from resume",
        "roast": "specific savage comment about this line",
        "fix": "rewritten version that doesn't suck",
        "severity": "mild" | "spicy" | "nuclear"
      }}
    ],
    "biggest_sin": "the single worst thing about this resume",
    "redemption_arc": "what they did well (be stingy with this)",
    "verdict": "one final brutal sentence"
  }},
  "emotion": {{
    "archetype": "The Imposter" | "The Peacock" | "The Robot" | "The Soldier" | "The Storyteller" | "The Overachiever" | "The Ghost",
    "archetype_description": "2 sentences describing what this archetype means",
    "archetype_roast": "one savage but true sentence about their writing style",
    "confidence_score": <0-100>,
    "passive_verb_count": <integer>,
    "active_verb_count": <integer>,
    "passive_examples": ["actual passive phrases from their resume"],
    "active_examples": ["actual strong phrases"],
    "bold_usage_verdict": "one sentence on how they use bold",
    "tone_summary": "3 adjectives describing the overall tone",
    "fix_strategy": ["actionable advice 1", "actionable advice 2"]
  }},
  "credibility": {{
    "credibility_score": <0-100>,
    "red_flags": [
      {{
        "claim": "exact text from resume",
        "issue": "why this is sus",
        "severity": "yellow" | "red" | "dealbreaker",
        "suggestion": "how to make this honest and still impressive"
      }}
    ],
    "green_flags": ["claims that are specific, believable, and well-framed"],
    "timeline_issues": ["any date overlap or gap concerns"],
    "verdict": "one sentence on overall credibility"
  }},
  "indian_market": {{
    "india_ats_score": <0-100>,
    "placement_readiness": {{
      "tier1_campus": <0-100>,
      "faang_india": <0-100>,
      "indian_unicorn_startup": <0-100>,
      "service_company": <0-100>
    }},
    "india_specific_issues": ["list of things that hurt in Indian context"],
    "india_specific_strengths": ["things that work well for Indian market"],
    "missing_for_india": ["elements Indian recruiters expect but are absent"],
    "verdict": "which type of Indian company is this resume best suited for"
  }},
  "hackathons": {{
    "projects": [
      {{
        "name": "project name",
        "type": "hackathon" | "personal" | "academic" | "open-source",
        "impact_score": <0-100>,
        "framing_score": <0-100>,
        "vague_claims": ["list of vague statements"],
        "tech_stacking_detected": true | false,
        "tech_stacking_note": "if detected",
        "outcome_evidence": "present" | "weak" | "absent",
        "roast": "one honest line",
        "reframed_bullet": "how this should be described"
      }}
    ],
    "overall_project_score": <0-100>,
    "top_project": "name of strongest project",
    "biggest_project_sin": "worst project presentation issue"
  }},
  "github_portfolio": {{
    "github_strength_summary": "one sentence summarizing their GitHub impact",
    "on_resume": [
      {{
        "repo": "name",
        "description_score": <0-10>,
        "improvement": "how to better describe this on their resume",
        "stars": <int>,
        "forks": <int>,
        "language": "string"
      }}
    ],
    "missing_from_resume": [
      {{
        "repo": "name",
        "suggested_bullet": "bullet point to add to resume",
        "why_include": "reason this repo is worth listing",
        "stars": <int>,
        "forks": <int>,
        "language": "string"
      }}
    ],
    "contradictions": ["list of inconsistencies between resume and GitHub data"]
  }}
}}

Job Description (if available):
{jd_text}

GitHub Repository Data (if provided):
{github_data}

Resume:
{resume_text}
"""

TAILOR_PROMPT = """
You are a world-class resume writer and career coach. Your task is to rewrite a resume to fix specific issues identified in a roast/analysis and, optionally, to align it with a target job description.

Input:
1. Original Resume Text:
{resume_text}

2. Roast & Analysis Feedback:
{analysis_feedback}

3. Target Job Description (if any):
{jd_text}

Goal:
- Fix every single "Red Flag" identified in the analysis.
- Rewrite weak bullets using the X-Y-Z formula (Accomplished [X] as measured by [Y], by doing [Z]).
- Remove fluff and filler words identified in the "Emotion Persona" analysis.
- If a JD is provided, incorporate key missing keywords strategically.
- Maintain a professional, high-impact tone.

Output Format:
Return a JSON object:
{{
  "tailored_resume_json": {{
    "contact_info": {{ "name": "...", "email": "...", "phone": "...", "location": "...", "linkedin": "...", "github": "...", "website": "..." }},
    "summary": "...",
    "experience": [ {{ "role": "...", "company": "...", "location": "...", "start_date": "...", "end_date": "...", "bullet_points": ["..."] }} ],
    "education": [ {{ "institution": "...", "degree": "...", "field_of_study": "...", "start_date": "...", "end_date": "...", "gpa": "..." }} ],
    "skills": {{ "languages": ["..."], "frameworks": ["..."], "tools": ["..."] }},
    "projects": [ {{ "name": "...", "description": "...", "technologies": ["..."], "link": "..." }} ]
  }},
  "changes_made": ["list of major improvements made"],
  "ats_prediction": <estimated 0-100 score for this new version>,
  "explanation": "short summary of the tailoring strategy used"
}}
"""

RECRUITER_PROMPT = """
You are an expert talent acquisition specialist and professional resume analyst. Parse and assess the following resume with clinical precision.

CRITICAL SECTION MAPPING RULE:
Resumes use many different names for the same sections. You MUST intelligently map them:
- "Summary", "Profile", "About", "About Me", "Objective", "Career Objective", "Professional Summary", "Personal Statement", "Overview", "Abstract", "Executive Summary", "Introduction" → map to the "summary" field
- "Experience", "Work Experience", "Employment", "Employment History", "Professional Experience", "Work History", "Career History", "Industry Experience" → map to the "experience" array
- "Education", "Academic Background", "Academics", "Qualifications", "Educational Background", "Academic Qualifications", "Schooling" → map to the "education" array
- "Skills", "Technical Skills", "Core Competencies", "Competencies", "Expertise", "Key Skills", "Technologies", "Tech Stack", "Tools", "Proficiencies" → map to the "skills" object
- "Projects", "Personal Projects", "Key Projects", "Academic Projects", "Side Projects", "Portfolio", "Work Samples", "Notable Projects" → map to the "projects" array
- "Certifications", "Certificates", "Licenses", "Professional Certifications", "Professional Development", "Credentials" → map to the "certifications" array
- "Awards", "Achievements", "Honors", "Accomplishments", "Recognition", "Awards & Recognition" → map to the "achievements" array
- "Publications", "Research", "Papers", "Research Papers", "Research Work", "Published Work" → map to the "publications" array
- "Volunteer", "Volunteering", "Volunteer Work", "Community Service", "Social Work", "Non-profit" → map to the "volunteer" array
- "Languages", "Language Skills", "Spoken Languages" → map to the skills.languages array
- "Interests", "Hobbies", "Activities", "Extracurricular", "Personal Interests" → map to the "interests" array

Return ONLY a valid JSON object with the following structure:
{{
  "parsed_resume": {{
    "candidate_name": "Full name extracted from resume",
    "contact": {{
      "email": "email or null",
      "phone": "phone number or null",
      "location": "city, country or null",
      "linkedin": "LinkedIn URL or null",
      "github": "GitHub URL or null",
      "website": "portfolio/website URL or null"
    }},
    "summary": "Extracted summary/profile text verbatim, or null if not present",
    "experience": [
      {{
        "company": "Company name",
        "title": "Job title",
        "duration": "e.g. Jan 2022 - Mar 2024",
        "duration_months": <calculated number of months as integer>,
        "location": "Location or null",
        "highlights": ["bullet point 1", "bullet point 2"]
      }}
    ],
    "education": [
      {{
        "institution": "University/College/School name",
        "degree": "e.g. B.Tech, M.S., Ph.D.",
        "field": "Field of study",
        "graduation_year": "Year or Expected Year",
        "gpa": "GPA/CGPA or null",
        "highlights": ["honors, relevant coursework, etc."]
      }}
    ],
    "skills": {{
      "technical": ["list of technical/hard skills"],
      "soft": ["list of soft skills explicitly mentioned"],
      "languages_spoken": ["spoken/written languages if listed"],
      "tools": ["specific tools, frameworks, platforms"]
    }},
    "projects": [
      {{
        "name": "Project name",
        "description": "What the project does",
        "technologies": ["tech stack used"],
        "impact": "Measurable outcome or impact, or null"
      }}
    ],
    "certifications": ["certification 1", "certification 2"],
    "achievements": ["achievement 1", "achievement 2"],
    "publications": ["publication 1"],
    "volunteer": ["volunteer experience 1"],
    "interests": ["interest 1", "interest 2"],
    "total_experience_years": <calculated float, e.g. 2.5>,
    "career_level": "one of: Fresher / Entry-Level / Junior / Mid-Level / Senior / Lead / Principal / Executive"
  }},
  "professional_assessment": {{
    "overall_score": <0-100 integer representing overall candidate quality>,
    "executive_summary": "2-3 sentence professional summary of the candidate for a recruiter",
    "communication_style": "Professional assessment of how the candidate presents themselves on paper — word choice, clarity, confidence",
    "leadership_indicators": ["specific evidence of leadership extracted from resume text"],
    "personality_profile": {{
      "archetype": "Choose ONE primary descriptor that best defines this candidate's dominant professional energy. Must be exactly one of: Driven / Relentless / Decisive / Focused / Precise / Bold / Analytical / Strategic / Visionary / Methodical / Pragmatic / Adaptive / Optimistic / Ambitious / Tenacious / Composed / Resilient / Inventive / Resourceful / Iterative / Systematic / Experimental / Commanding / Influential / Principled / Deliberate / Authoritative",
      "traits": ["Pick 3 secondary descriptors from the same list that complement the archetype"],
      "work_style": "Inferred working style based on language patterns and role choices",
      "collaboration_index": <0-10 float>,
      "innovation_index": <0-10 float>,
      "attention_to_detail": <0-10 float>,
      "growth_trajectory": "Assessment of career growth direction and velocity"
    }},
    "strengths": ["Professional strength 1", "Professional strength 2", "Professional strength 3"],
    "red_flags": ["Professional concern 1 with brief rationale"],
    "green_flags": ["Positive signal 1", "Positive signal 2"],
    "skill_gaps": ["Missing skill or experience that would strengthen the profile"],
    "culture_fit_signals": ["Signal suggesting team/culture preferences"],
    "recommended_interview_questions": [
      {{
        "question": "Tailored interview question based on resume",
        "rationale": "Why this question is relevant"
      }}
    ],
    "hire_recommendation": "one of: Strong Recommend / Recommend / Neutral / Do Not Recommend",
    "hire_reasoning": "1-2 sentence professional rationale for the recommendation"
  }}
}}

Resume to analyze:
{resume_text}
"""

RESUME_PARSER_PROMPT = """
You are a precise resume parser. Your job is to extract sections of the following resume and map them into the exact JSON schema provided below. 

Return ONLY a valid JSON object matching this schema structure:
{{
  "contact_info": {{
    "name": "Full name or null",
    "email": "email address or null",
    "phone": "phone number or null",
    "location": {{
      "city": "City or null",
      "state": "State/Region or null"
    }},
    "linkedin": "LinkedIn URL or null",
    "portfolio": "Portfolio/Website URL or null"
  }},
  "summary": "Verbatim professional summary or null",
  "experience": [
    {{
      "title": "Job title",
      "company": "Company name",
      "location": "Location or null",
      "start_date": "YYYY-MM or string",
      "end_date": "YYYY-MM or string or null (if current)",
      "is_current": true/false,
      "bullets": ["bullet point 1", "bullet point 2"]
    }}
  ],
  "education": [
    {{
      "institution": "University/School name",
      "location": "Location or null",
      "degree": "Degree name",
      "field": "Field of study",
      "start_date": "YYYY or string or null",
      "end_date": "YYYY or string or null",
      "gpa": "GPA or null"
    }}
  ],
  "skills": {{
    "programming_languages": ["list of programming languages"],
    "frameworks_tools": ["list of tools/frameworks"],
    "methodologies": ["list of methodologies/processes"],
    "domains": ["areas of expertise"]
  }},
  "projects": [
    {{
      "name": "Project name",
      "description": "Project description",
      "technologies": ["tech stack"],
      "impact": "measurable impact or outcome or null"
    }}
  ],
  "certifications": ["certification 1"],
  "achievements": ["award or achievement 1"],
  "publications": ["publication title/citation 1"],
  "languages": ["language 1"],
  "volunteer_work": ["volunteer role 1"]
}}

Resume Text:
{resume_text}
"""

