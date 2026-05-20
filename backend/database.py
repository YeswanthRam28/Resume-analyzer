from sqlmodel import create_engine, SQLModel, Session
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./rescore.db")

# Simple check to avoid crashing if user hasn't replaced the placeholder
if not DATABASE_URL or "your_neondb_url" in DATABASE_URL:
    DATABASE_URL = "sqlite:///./rescore.db"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

def init_db():
    global engine
    try:
        SQLModel.metadata.create_all(engine)
    except Exception as e:
        print(f"Database initialization failed: {e}")
        # Optionally fallback to local sqlite if Neon fails
        if "sqlite" not in str(engine.url):
            print("Falling back to local SQLite for this session...")
            engine = create_engine("sqlite:///./rescore.db")
            SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
