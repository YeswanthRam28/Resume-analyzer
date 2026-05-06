"""
Migration script: Creates the recruiter_sessions table.
Run with: python run_migration.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import engine
from models import RecruiterSession
from sqlmodel import SQLModel

print("Running migration: creating recruiter_sessions table...")
try:
    SQLModel.metadata.create_all(engine, tables=[RecruiterSession.__table__])
    print("✓ recruiter_sessions table created successfully.")
except Exception as e:
    print(f"✗ Migration failed: {e}")
