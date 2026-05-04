from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_session
from models import ResumeSession, GitHubRepo
from services.parser_service import ParserService
from services.nvidia_service import NvidiaService
from prompts.templates import MASTER_RESUME_PROMPT
import asyncio
import uuid

router = APIRouter()
nvidia = NvidiaService()

@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    target_role: str = Form(None),
    github_username: str = Form(None),
    jd_text: str = Form(None),
    db: Session = Depends(get_session)
):
    # 1. Parse Resume
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
    
    # Store session id before closing to avoid DetachedInstanceError
    session_id_val = session.id

    # 3. Consolidated AI Analysis
    # We close the DB session during the long AI call to avoid SSL idle timeout
    db.close() 

    try:
        master_prompt = MASTER_RESUME_PROMPT.format(resume_text=resume_text, jd_text=jd_text or "Not provided.")
        analysis_result = await nvidia.run_prompt(master_prompt, "Run Master Analysis")
        analysis = analysis_result if isinstance(analysis_result, dict) else {}
    except Exception as e:
        print(f"Master AI Task failed: {e}")
        analysis = {"error": str(e)}

    # Ensure all required keys exist
    for key in ["ats", "roast", "emotion", "credibility", "indian_market", "hackathons"]:
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

@router.get("/{session_id}")
async def get_result(session_id: str, db: Session = Depends(get_session)):
    session = db.query(ResumeSession).filter(ResumeSession.id == uuid.UUID(session_id)).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session
