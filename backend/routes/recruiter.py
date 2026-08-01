from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_session
from auth import get_current_user
from models import RecruiterSession
from services.parser_service import ParserService
from services.openrouter_service import OpenRouterService
from prompts.templates import RECRUITER_PROMPT
import uuid

router = APIRouter()
openrouter = OpenRouterService()

@router.post("/analyze")
async def recruiter_analyze(
    file: UploadFile = File(...),
    db: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    # 1. Parse Resume
    try:
        content = await file.read()
        resume_text = await ParserService.extract_text(content, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 2. Run AI Analysis
    try:
        prompt = RECRUITER_PROMPT.format(resume_text=resume_text)
        result = await openrouter.run_prompt(prompt, "Recruiter Analysis")
        if not isinstance(result, dict):
            raise ValueError("AI did not return a valid dictionary")
    except Exception as e:
        print(f"Recruiter Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    # 3. Extract key fields for DB indexing
    parsed = result.get("parsed_resume", {})
    assessment = result.get("professional_assessment", {})
    personality = assessment.get("personality_profile", {})

    # 4. Save to DB
    try:
        session = RecruiterSession(
            user_id=current_user,
            file_name=file.filename,
            resume_text=resume_text,
            parsed_resume=parsed,
            professional_assessment=assessment,
            candidate_name=parsed.get("candidate_name"),
            career_level=parsed.get("career_level"),
            archetype=personality.get("archetype"),
            overall_score=assessment.get("overall_score"),
            hire_recommendation=assessment.get("hire_recommendation"),
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        result["session_id"] = str(session.id)
    except Exception as e:
        print(f"DB save failed (non-fatal): {e}")
        result["session_id"] = None

    return result

@router.get("/{session_id}")
async def get_recruiter_session(session_id: str):
    with next(get_session()) as db:
        session = db.query(RecruiterSession).filter(
            RecruiterSession.id == uuid.UUID(session_id)
        ).first()
        if not session:
            raise HTTPException(status_code=404, detail="Recruiter session not found")
        return {
            "session_id": str(session.id),
            "parsed_resume": session.parsed_resume,
            "professional_assessment": session.professional_assessment,
        }

@router.get("/")
async def list_recruiter_sessions():
    with next(get_session()) as db:
        sessions = db.query(RecruiterSession).order_by(
            RecruiterSession.created_at.desc()
        ).limit(50).all()
        return [
            {
                "id": str(s.id),
                "candidate_name": s.candidate_name,
                "career_level": s.career_level,
                "archetype": s.archetype,
                "overall_score": s.overall_score,
                "hire_recommendation": s.hire_recommendation,
                "created_at": s.created_at,
            }
            for s in sessions
        ]
