from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_session
from models import VideoSession
from services.gemini_service import GeminiService
from prompts.templates import VIDEO_PROMPT
import uuid
import os
import shutil

router = APIRouter()
gemini = GeminiService()

@router.post("/analyze")
async def analyze_video(
    file: UploadFile = File(...),
    target_role: str = Form(None),
    db: Session = Depends(get_session)
):
    # 1. Save file temporarily
    temp_dir = "temp_videos"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, f"{uuid.uuid4()}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 2. Analyze with Gemini
        analysis = await gemini.analyze_video(file_path, VIDEO_PROMPT)
        
        # 3. Create Session
        session = VideoSession(
            video_url=file_path, # In real app, this would be S3/GCS URL
            analysis=analysis,
            confidence_score=analysis.get("emotion", {}).get("confidence_score"),
            filler_word_count=analysis.get("delivery", {}).get("filler_words", {}).get("total"),
            pacing_score=analysis.get("delivery", {}).get("words_per_minute"),
            emotion_detected=analysis.get("emotion", {}).get("dominant_emotion"),
            eye_contact_score=analysis.get("eye_contact", {}).get("score"),
            roast_summary=analysis.get("roast")
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        
        return {"session_id": str(session.id), "analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Note: We might want to keep the video or delete it based on requirements
        # For now, keeping it as 'video_url' points to it.
        pass

@router.get("/{session_id}")
async def get_video_result(session_id: str, db: Session = Depends(get_session)):
    session = db.query(VideoSession).filter(VideoSession.id == uuid.UUID(session_id)).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session
