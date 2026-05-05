from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_session
from models import ResumeSession, TailorVersion
from services.nvidia_service import NvidiaService
from prompts.templates import TAILOR_PROMPT
import uuid
import json

router = APIRouter()
nvidia = NvidiaService()

@router.post("/{session_id}")
async def tailor_resume(
    session_id: str,
    target_role: str = None,
    db: Session = Depends(get_session)
):
    # 1. Get existing session
    session = db.query(ResumeSession).filter(ResumeSession.id == uuid.UUID(session_id)).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if not session.analysis:
        raise HTTPException(status_code=400, detail="Resume must be analyzed before tailoring")

    # 2. Prepare analysis feedback for the prompt
    # We simplify the analysis so the prompt stays within token limits
    analysis = session.analysis
    feedback = {
        "roast": analysis.get("roast", {}).get("overall_roast", ""),
        "red_flags": [f["issue"] for f in analysis.get("credibility", {}).get("red_flags", [])],
        "ats_missing": analysis.get("ats", {}).get("keyword_match", {}).get("missing", []),
        "persona": analysis.get("emotion", {}).get("archetype", "")
    }

    # 3. Call AI to tailor
    # We close the DB connection during the long AI call
    db.close()

    try:
        prompt = TAILOR_PROMPT.format(
            resume_text=session.resume_text,
            analysis_feedback=json.dumps(feedback, indent=2),
            jd_text=target_role or session.target_role or "Standard optimization"
        )
        
        result = await nvidia.run_prompt(prompt, "Tailor this resume")
        
        if not result or "tailored_resume_markdown" not in result:
            raise ValueError("Invalid AI response for tailoring")

        # 4. Save version
        with next(get_session()) as new_db:
            new_version = TailorVersion(
                session_id=uuid.UUID(session_id),
                role=target_role or session.target_role or "Tailored Version",
                tailored_text=result["tailored_resume_markdown"],
                ats_score=result.get("ats_prediction", 0)
            )
            new_db.add(new_version)
            new_db.commit()
            new_db.refresh(new_version)
            
            return {
                "version_id": str(new_version.id),
                "tailored_text": new_version.tailored_text,
                "changes_made": result.get("changes_made", []),
                "explanation": result.get("explanation", "")
            }

    except Exception as e:
        print(f"Tailoring failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/versions/{session_id}")
async def get_tailored_versions(session_id: str, db: Session = Depends(get_session)):
    versions = db.query(TailorVersion).filter(TailorVersion.session_id == uuid.UUID(session_id)).all()
    return versions
