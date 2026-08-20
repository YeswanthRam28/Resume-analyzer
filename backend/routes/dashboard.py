from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_session
from models import User, ResumeSession, RecruiterSession
from auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class RoleUpdate(BaseModel):
    role: str

@router.get("/me")
async def get_my_profile(clerk_id: str = Depends(get_current_user), db: Session = Depends(get_session)):
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    
    # 1. If user already exists in DB and has a role set
    if user and user.role:
        return {"role": user.role, "has_onboarded": True}
        
    # 2. If user exists but role is null, or user doesn't exist yet: check existing DB sessions
    candidate_session = db.query(ResumeSession).filter(ResumeSession.user_id == clerk_id).first()
    if candidate_session:
        inferred_role = "candidate"
        if not user:
            user = User(clerk_id=clerk_id, role=inferred_role)
            db.add(user)
        else:
            user.role = inferred_role
        db.commit()
        return {"role": inferred_role, "has_onboarded": True}

    recruiter_session = db.query(RecruiterSession).filter(RecruiterSession.user_id == clerk_id).first()
    if recruiter_session:
        inferred_role = "interviewer"
        if not user:
            user = User(clerk_id=clerk_id, role=inferred_role)
            db.add(user)
        else:
            user.role = inferred_role
        db.commit()
        return {"role": inferred_role, "has_onboarded": True}

    # 3. Truly new user with no role and no sessions in DB
    if not user:
        user = User(clerk_id=clerk_id)
        db.add(user)
        db.commit()
        db.refresh(user)

    return {"role": user.role, "has_onboarded": False}

@router.post("/role")
async def set_my_role(data: RoleUpdate, clerk_id: str = Depends(get_current_user), db: Session = Depends(get_session)):
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not user:
        user = User(clerk_id=clerk_id, role=data.role)
        db.add(user)
    else:
        user.role = data.role
    db.commit()
    return {"status": "success", "role": user.role}

@router.get("/resumes")
async def get_my_resumes(clerk_id: str = Depends(get_current_user), db: Session = Depends(get_session)):
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not user or not user.role:
        raise HTTPException(status_code=400, detail="Role not set")
        
    if user.role == "candidate":
        resumes = db.query(ResumeSession).filter(ResumeSession.user_id == clerk_id).order_by(ResumeSession.created_at.desc()).all()
        return {"resumes": resumes, "role": "candidate"}
    else:
        resumes = db.query(RecruiterSession).filter(RecruiterSession.user_id == clerk_id).order_by(RecruiterSession.created_at.desc()).all()
        return {"resumes": resumes, "role": "interviewer"}
