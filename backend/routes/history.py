from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_session
from models import ResumeSession, VideoSession
from typing import List

router = APIRouter()

@router.get("/history")
async def get_history(db: Session = Depends(get_session)):
    resumes = db.query(ResumeSession).order_by(ResumeSession.created_at.desc()).limit(10).all()
    videos = db.query(VideoSession).order_by(VideoSession.created_at.desc()).limit(10).all()
    return {
        "resumes": resumes,
        "videos": videos
    }
