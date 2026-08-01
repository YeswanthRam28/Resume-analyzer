from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from contextlib import asynccontextmanager
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database on startup
    init_db() 
    yield

app = FastAPI(title="RÉSCORE API", lifespan=lifespan)

# Configure CORS
# Set FRONTEND_URL in Vercel env vars to restrict origins in production
frontend_url = os.getenv("FRONTEND_URL", "*")
allow_origins = ["*"] if frontend_url == "*" else [frontend_url, "http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "RÉSCORE API is running"}

# Include routers
from routes import resume, history, tailor, recruiter, dashboard
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
app.include_router(history.router, prefix="/api/history", tags=["history"])
app.include_router(tailor.router, prefix="/api/tailor", tags=["tailor"])
app.include_router(recruiter.router, prefix="/api/recruiter", tags=["recruiter"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
