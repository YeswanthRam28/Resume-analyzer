"""
Migration script: Creates the recruiter_sessions table.
Run with: python run_migration.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import engine
from models import RecruiterSession, Resume
from sqlmodel import SQLModel, create_engine

print("Running migration: creating recruiter_sessions and resume tables...")
try:
    SQLModel.metadata.create_all(engine, tables=[RecruiterSession.__table__, Resume.__table__])
    print("[OK] recruiter_sessions and resume tables created successfully.")
except Exception as e:
    print(f"[FAIL] Primary DB migration failed: {e}")
    print("Falling back to local SQLite...")
    try:
        local_engine = create_engine("sqlite:///./rescore.db")
        SQLModel.metadata.create_all(local_engine, tables=[RecruiterSession.__table__, Resume.__table__])
        print("[OK] Tables created in local SQLite (rescore.db).")
    except Exception as fallback_err:
        print(f"[FAIL] SQLite fallback also failed: {fallback_err}")
