from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from contextlib import asynccontextmanager
import os
import asyncio
import urllib.request
from datetime import datetime

async def self_ping_loop():
    """
    Background worker that pings the /health endpoint every 10 minutes
    to prevent Render free tier from spinning down due to inactivity.
    """
    print("🚀 [Keep-Alive] Self-ping service initialized (Pinging every 10 mins)")
    await asyncio.sleep(10)  # Wait 10 seconds for initial server startup

    while True:
        external_url = os.getenv("RENDER_EXTERNAL_URL") or os.getenv("BACKEND_URL")
        target_url = f"{external_url.rstrip('/')}/health" if external_url else "http://127.0.0.1:8000/health"
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        try:
            def _ping():
                req = urllib.request.Request(
                    target_url, 
                    headers={"User-Agent": "RESCORE-KeepAlive/1.0"}
                )
                with urllib.request.urlopen(req, timeout=15) as resp:
                    return resp.status

            status = await asyncio.to_thread(_ping)
            print(f"[{timestamp}] 🟢 [Keep-Alive] Self-ping to {target_url} -> Status: {status}")
        except Exception as e:
            print(f"[{timestamp}] ⚠️ [Keep-Alive] Self-ping to {target_url} -> Error: {e}")

        # Sleep for 10 minutes (600 seconds)
        await asyncio.sleep(600)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database on startup
    init_db() 
    # Start self-pinging background loop for Render keep-alive
    ping_task = asyncio.create_task(self_ping_loop())
    yield
    # Cleanup task on shutdown
    ping_task.cancel()

app = FastAPI(title="RÉSCORE API", lifespan=lifespan)

# Configure CORS
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

@app.get("/health")
async def health_check():
    """Health check endpoint for keep-alive monitoring and Render status checks."""
    return {
        "status": "healthy",
        "service": "RÉSCORE API",
        "timestamp": datetime.now().isoformat()
    }

# Include routers
from routes import resume, history, tailor, recruiter, dashboard
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
app.include_router(history.router, prefix="/api/history", tags=["history"])
app.include_router(tailor.router, prefix="/api/tailor", tags=["tailor"])
app.include_router(recruiter.router, prefix="/api/recruiter", tags=["recruiter"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
