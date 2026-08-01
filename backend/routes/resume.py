from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_session
from auth import get_current_user
from models import ResumeSession, GitHubRepo, Resume
from services.parser_service import ParserService
from services.openrouter_service import OpenRouterService
from services.github_service import GitHubService
from services.json_resume_service import generate_html_theme
from prompts.templates import MASTER_RESUME_PROMPT, RESUME_PARSER_PROMPT
from fastapi.responses import HTMLResponse
import asyncio
import uuid

router = APIRouter()
openrouter = OpenRouterService()
github_service = GitHubService()

@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    target_role: str = Form(None),
    github_username: str = Form(None),
    jd_text: str = Form(None),
    db: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    # 1. Parse Resume
    try:
        content = await file.read()
        resume_text = await ParserService.extract_text(content, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 2. Create Session
    session = ResumeSession(
        user_id=current_user,
        resume_text=resume_text,
        file_name=file.filename,
        target_role=target_role,
        github_username=github_username
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    # Store session id before closing to avoid DetachedInstanceError
    session_id_val = session.id

    # 3. Consolidated AI Analysis
    # We close the DB session during the long AI call to avoid SSL idle timeout
    db.close() 

    # Fetch GitHub data if username provided
    github_repos = []
    if github_username:
        github_repos = await github_service.get_user_repos(github_username)
    
    github_data_str = "No GitHub data provided."
    if github_repos:
        github_data_str = "\n".join([
            f"- {r['name']}: {r['description']} ({r['language']}, {r['stars']} stars)"
            for r in github_repos
        ])

    try:
        master_prompt = MASTER_RESUME_PROMPT.format(
            resume_text=resume_text, 
            jd_text=jd_text or "Not provided.",
            github_data=github_data_str
        )
        analysis_result = await openrouter.run_prompt(master_prompt, "Run Master Analysis")
        analysis = analysis_result if isinstance(analysis_result, dict) else {}
    except Exception as e:
        print(f"Master AI Task failed: {e}")
        analysis = {"error": str(e)}

    # Ensure all required keys exist
    for key in ["ats", "roast", "emotion", "credibility", "indian_market", "hackathons", "github_portfolio"]:
        if key not in analysis:
            analysis[key] = {"error": "Missing from AI response"}

    # 4. Update Session
    # Get a FRESH database session after the long wait
    with next(get_session()) as new_db:
        session = new_db.query(ResumeSession).filter(ResumeSession.id == session_id_val).first()
        if session:
            session.analysis = analysis
            
            ats_data = analysis.get("ats", {})
            cred_data = analysis.get("credibility", {})
            emo_data = analysis.get("emotion", {})
            roast_data = analysis.get("roast", {})

            if isinstance(ats_data, dict) and "ats_score" in ats_data:
                session.ats_score = ats_data.get("ats_score")
            if isinstance(cred_data, dict) and "credibility_score" in cred_data:
                session.credibility_score = cred_data.get("credibility_score")
            if isinstance(emo_data, dict) and "archetype" in emo_data:
                session.emotion_persona = emo_data.get("archetype")
            if isinstance(roast_data, dict) and "roast_rating" in roast_data:
                session.roast_rating = roast_data.get("roast_rating")

            new_db.commit()
    
    return {"session_id": str(session_id_val), "analysis": analysis}

@router.get("/{session_id}/theme/{theme_name}")
def get_resume_theme_html(session_id: str, theme_name: str, version_id: str = None, db: Session = Depends(get_session)):
    """Generates and returns HTML for a given JSON Resume theme."""
    session_obj = db.query(ResumeSession).filter(ResumeSession.id == uuid.UUID(session_id)).first()
    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if version_id:
        from models import TailoredVersion
        version_obj = db.query(TailoredVersion).filter(TailoredVersion.id == uuid.UUID(version_id)).first()
        if not version_obj:
            raise HTTPException(status_code=404, detail="Tailored version not found")
        import json
        resume_data = json.loads(version_obj.content)
    else:
        resume_obj = db.query(Resume).filter(Resume.session_id == session_obj.id).first()
        if not resume_obj:
            raise HTTPException(status_code=404, detail="Parsed resume data not found")
        resume_data = {
            "contact_info": resume_obj.contact_info,
            "summary": resume_obj.summary,
            "experience": resume_obj.experience,
            "education": resume_obj.education,
            "skills": resume_obj.skills,
            "projects": resume_obj.projects,
        }

    try:
        html = generate_html_theme(resume_data, theme_name)
        from fastapi.responses import HTMLResponse
        return HTMLResponse(content=html, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{session_id}")
async def get_result(session_id: str, db: Session = Depends(get_session)):
    session = db.query(ResumeSession).filter(ResumeSession.id == uuid.UUID(session_id)).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.get("/{session_id}/parsed")
async def get_parsed_resume(session_id: str, db: Session = Depends(get_session)):
    # First check if it's already parsed
    parsed = db.query(Resume).filter(Resume.session_id == uuid.UUID(session_id)).first()
    if parsed:
        return parsed
        
    # If not, we need to parse it using the original resume text from the session
    session = db.query(ResumeSession).filter(ResumeSession.id == uuid.UUID(session_id)).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    try:
        prompt = RESUME_PARSER_PROMPT.format(resume_text=session.resume_text)
        parsed_result = await openrouter.run_prompt(prompt, "Resume Structured Parsing")
        if not isinstance(parsed_result, dict):
            raise ValueError("AI did not return a valid dictionary")
            
        with next(get_session()) as new_db:
            new_parsed = Resume(
                session_id=session.id,
                contact_info=parsed_result.get("contact_info"),
                summary=parsed_result.get("summary"),
                experience=parsed_result.get("experience"),
                education=parsed_result.get("education"),
                skills=parsed_result.get("skills"),
                projects=parsed_result.get("projects"),
                certifications=parsed_result.get("certifications"),
                achievements=parsed_result.get("achievements"),
                publications=parsed_result.get("publications"),
                languages=parsed_result.get("languages"),
                volunteer_work=parsed_result.get("volunteer_work")
            )
            new_db.add(new_parsed)
            new_db.commit()
            new_db.refresh(new_parsed)
            return new_parsed
    except Exception as e:
        print(f"On-demand parsing failed: {e}")
        raise HTTPException(status_code=500, detail=f"On-demand parsing failed: {str(e)}")

@router.post("/parse")
async def parse_resume(
    file: UploadFile = File(...),
    target_role: str = Form(None),
    github_username: str = Form(None),
    db: Session = Depends(get_session)
):
    # 1. Parse Resume Text
    try:
        content = await file.read()
        resume_text = await ParserService.extract_text(content, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 2. Create Session
    session = ResumeSession(
        resume_text=resume_text,
        file_name=file.filename,
        target_role=target_role,
        github_username=github_username
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    session_id_val = session.id

    # 3. Close the DB session during the long AI call to avoid SSL idle timeout
    db.close() 

    # 4. AI Structured Extraction
    try:
        prompt = RESUME_PARSER_PROMPT.format(resume_text=resume_text)
        parsed_result = await openrouter.run_prompt(prompt, "Resume Structured Parsing")
        if not isinstance(parsed_result, dict):
            raise ValueError("AI did not return a valid dictionary")
    except Exception as e:
        print(f"Resume parsing LLM task failed: {e}")
        raise HTTPException(status_code=500, detail=f"LLM Parsing failed: {str(e)}")

    # 5. Populate and Save the Resume record
    try:
        with next(get_session()) as new_db:
            parsed_resume = Resume(
                session_id=session_id_val,
                contact_info=parsed_result.get("contact_info"),
                summary=parsed_result.get("summary"),
                experience=parsed_result.get("experience"),
                education=parsed_result.get("education"),
                skills=parsed_result.get("skills"),
                projects=parsed_result.get("projects"),
                certifications=parsed_result.get("certifications"),
                achievements=parsed_result.get("achievements"),
                publications=parsed_result.get("publications"),
                languages=parsed_result.get("languages"),
                volunteer_work=parsed_result.get("volunteer_work")
            )
            new_db.add(parsed_resume)
            new_db.commit()
            new_db.refresh(parsed_resume)
    except Exception as e:
        print(f"Saving structured resume record failed: {e}")
        raise HTTPException(status_code=500, detail=f"DB persistence failed: {str(e)}")

    return {
        "session_id": str(session_id_val),
        "parsed_resume": parsed_result
    }

