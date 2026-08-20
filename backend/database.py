from sqlmodel import create_engine, SQLModel, Session
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./rescore.db")

# Simple check to avoid crashing if user hasn't replaced the placeholder
if not DATABASE_URL or "your_neondb_url" in DATABASE_URL:
    DATABASE_URL = "sqlite:///./rescore.db"

engine_kwargs = {
    "pool_pre_ping": True,
}

if "postgresql" in DATABASE_URL:
    engine_kwargs.update({
        "pool_recycle": 300,
        "pool_size": 10,
        "max_overflow": 20,
    })

engine = create_engine(DATABASE_URL, **engine_kwargs)

def init_db():
    global engine
    try:
        SQLModel.metadata.create_all(engine)
    except Exception as e:
        print(f"Database initialization failed: {e}")
        if "sqlite" not in str(engine.url):
            print("Falling back to local SQLite for this session...")
            engine = create_engine("sqlite:///./rescore.db")
            SQLModel.metadata.create_all(engine)

def get_session():
    global engine
    try:
        with Session(engine) as session:
            yield session
    except Exception as e:
        print(f"DB Session error ({e}). Attempting connection recovery...")
        if "sqlite" not in str(engine.url):
            print("PostgreSQL connection failed. Falling back to local SQLite...")
            engine = create_engine("sqlite:///./rescore.db")
            SQLModel.metadata.create_all(engine)
            with Session(engine) as fallback_session:
                yield fallback_session
        else:
            raise e
