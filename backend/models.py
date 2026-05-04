from sqlmodel import SQLModel, Field, Column, JSON
from datetime import datetime
from typing import Optional, List
import uuid

class ResumeSession(SQLModel, table=True):
    __tablename__ = "resume_sessions"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    resume_text: str
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    version_label: str = Field(default="v1")
    version_number: int = Field(default=1)
    target_role: Optional[str] = None
    github_username: Optional[str] = None
    analysis: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    ats_score: Optional[int] = None
    credibility_score: Optional[int] = None
    emotion_persona: Optional[str] = None
    roast_rating: Optional[str] = None
    notes: Optional[str] = None

class VideoSession(SQLModel, table=True):
    __tablename__ = "video_sessions"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    video_url: Optional[str] = None
    transcript: Optional[str] = None
    duration_seconds: Optional[int] = None
    analysis: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    confidence_score: Optional[int] = None
    filler_word_count: Optional[int] = None
    pacing_score: Optional[int] = None
    emotion_detected: Optional[str] = None
    eye_contact_score: Optional[int] = None
    roast_summary: Optional[str] = None

class GitHubRepo(SQLModel, table=True):
    __tablename__ = "github_repos"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    session_id: uuid.UUID = Field(foreign_key="resume_sessions.id", ondelete="CASCADE")
    repo_name: str
    stars: int = Field(default=0)
    forks: int = Field(default=0)
    language: Optional[str] = None
    description: Optional[str] = None
    impact_score: Optional[int] = None
    resume_bullet: Optional[str] = None
    commit_activity: Optional[str] = None

class TailorVersion(SQLModel, table=True):
    __tablename__ = "tailor_versions"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    session_id: uuid.UUID = Field(foreign_key="resume_sessions.id", ondelete="CASCADE")
    role: str
    tailored_text: str
    ats_score: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.now)
