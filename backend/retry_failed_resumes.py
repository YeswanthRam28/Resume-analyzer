import os
import sys
import requests
import mimetypes
import json
from sqlalchemy import create_engine, text

# Base configurations
API_URL = "http://127.0.0.1:8000/api/resume/parse"
RESUME_FOLDER = r"d:\Projects\Rescore\Resume sample"

def get_mime_type(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return "application/pdf"
    elif ext == ".docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif ext == ".doc":
        return "application/msword"
    elif ext == ".svg":
        return "image/svg+xml"
    elif ext == ".png":
        return "image/png"
    elif ext in [".jpg", ".jpeg"]:
        return "image/jpeg"
    else:
        guess = mimetypes.guess_type(file_path)[0]
        return guess or "application/octet-stream"

def get_db_connection():
    from dotenv import load_dotenv
    load_dotenv()
    db_url = os.getenv("DATABASE_URL", "sqlite:///./rescore.db")
    if not db_url or "your_neondb_url" in db_url:
        db_url = "sqlite:///./rescore.db"
    return create_engine(db_url)

def should_process_file(engine, filename):
    """
    Check if the file has already been successfully parsed with a non-null candidate name.
    """
    query = text("""
        SELECT r.contact_info 
        FROM resume r
        JOIN resume_sessions s ON s.id = r.session_id
        WHERE s.file_name = :filename
    """)
    try:
        with engine.connect() as conn:
            result = conn.execute(query, {"filename": filename}).fetchall()
            if not result:
                return True # No record in database -> process
            
            # Check if any record has a valid non-null name
            for row in result:
                contact_info = row[0]
                if contact_info:
                    # Robust check for both Postgres (dict) and SQLite (str) json structures
                    if isinstance(contact_info, str):
                        try:
                            contact_info = json.loads(contact_info)
                        except:
                            pass
                    if isinstance(contact_info, dict):
                        name = contact_info.get("name")
                        if name and name != "None" and name != "Unknown":
                            return False # Found a successful parse -> skip
            return True # All found records have null/empty names -> process
    except Exception as e:
        print(f"Database check failed for {filename}: {e}. Defaulting to processing.")
        return True

def scan_for_resumes(root_folder, engine):
    supported_extensions = {".pdf", ".docx", ".doc", ".svg", ".png", ".jpg", ".jpeg"}
    resumes = []
    
    print(f"Scanning '{root_folder}' for failed or null resumes...")
    
    for dirpath, _, filenames in os.walk(root_folder):
        folder_name = os.path.basename(dirpath)
        inferred_role = None
        if folder_name in ["Accounts", "IT", "Manufacture", "Production", "Sales"]:
            inferred_role = f"{folder_name} Professional"
            
        for filename in filenames:
            if filename.startswith("~$"):
                continue
            ext = os.path.splitext(filename)[1].lower()
            if ext in supported_extensions:
                if should_process_file(engine, filename):
                    full_path = os.path.join(dirpath, filename)
                    resumes.append({
                        "path": full_path,
                        "filename": filename,
                        "inferred_role": inferred_role
                    })
                
    return resumes

def run_retry_parsing():
    engine = get_db_connection()
    resumes = scan_for_resumes(RESUME_FOLDER, engine)
    total_files = len(resumes)
    
    if total_files == 0:
        print("All resumes are already successfully parsed and saved with valid candidate names!")
        sys.exit(0)
        
    print(f"Found {total_files} resumes that need to be parsed (failed or returned null).")
    print("-" * 60)
    
    success_count = 0
    fail_count = 0
    
    for index, resume in enumerate(resumes, start=1):
        file_path = resume["path"]
        filename = resume["filename"]
        inferred_role = resume["inferred_role"]
        mime_type = get_mime_type(file_path)
        
        print(f"\n[{index}/{total_files}] Processing: {filename}")
        print(f"  Path: {file_path}")
        if inferred_role:
            print(f"  Inferred Role: {inferred_role}")
            
        try:
            with open(file_path, "rb") as f:
                files = {
                    "file": (filename, f, mime_type)
                }
                data = {}
                if inferred_role:
                    data["target_role"] = inferred_role
                
                print(f"  Sending POST request to {API_URL}...")
                response = requests.post(API_URL, files=files, data=data)
                
                if response.status_code == 200:
                    res_json = response.json()
                    session_id = res_json.get("session_id")
                    candidate_name = res_json.get("parsed_resume", {}).get("contact_info", {}).get("name", "Unknown")
                    print(f"  [SUCCESS] Parsed successfully!")
                    print(f"    Session ID: {session_id}")
                    print(f"    Candidate Name: {candidate_name}")
                    success_count += 1
                else:
                    print(f"  [FAILURE] Server returned status code {response.status_code}")
                    print(f"    Response body: {response.text}")
                    fail_count += 1
                    
        except Exception as e:
            print(f"  [ERROR] An error occurred during request execution: {e}")
            fail_count += 1
            
        if index < total_files:
            print("-" * 60)
            
    print("\n" + "=" * 60)
    print("RETRY PROCESSING COMPLETED SUMMARY")
    print("=" * 60)
    print(f"Total resumes retried: {total_files}")
    print(f"Successfully parsed:   {success_count}")
    print(f"Failed / Errored:      {fail_count}")
    print("=" * 60)

if __name__ == "__main__":
    run_retry_parsing()
