import os
import sys
import time
import requests
import mimetypes

# Base configurations
API_URL = "http://localhost:8000/api/resume/parse"
RESUME_FOLDER = r"d:\Projects\Rescore\Resume sample"
SLEEP_INTERVAL_SEC = 180  # 3 minutes

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
        # Fallback to python's guess or standard octet-stream
        guess = mimetypes.guess_type(file_path)[0]
        return guess or "application/octet-stream"

def scan_for_resumes(root_folder):
    """
    Recursively scans the folder and returns a list of supported resume paths
    and their inferred roles (based on subfolder name).
    """
    supported_extensions = {".pdf", ".docx", ".doc", ".svg", ".png", ".jpg", ".jpeg"}
    resumes = []
    
    print(f"Scanning '{root_folder}' recursively for resume files (pdf, docx, doc, svg, png, jpg, jpeg)...")
    
    for dirpath, _, filenames in os.walk(root_folder):
        # Infer role based on category subfolders under the word directory
        # e.g., 'word/IT' -> role is 'IT Professional'
        folder_name = os.path.basename(dirpath)
        inferred_role = None
        if folder_name in ["Accounts", "IT", "Manufacture", "Production", "Sales"]:
            inferred_role = f"{folder_name} Professional"
            
        for filename in filenames:
            if filename.startswith("~$"):
                continue
            ext = os.path.splitext(filename)[1].lower()
            if ext in supported_extensions:
                full_path = os.path.join(dirpath, filename)
                resumes.append({
                    "path": full_path,
                    "filename": filename,
                    "inferred_role": inferred_role
                })
                
    return resumes

def run_batch_parsing():
    if not os.path.exists(RESUME_FOLDER):
        print(f"Error: The directory '{RESUME_FOLDER}' does not exist.")
        sys.exit(1)
        
    resumes = scan_for_resumes(RESUME_FOLDER)
    total_files = len(resumes)
    
    if total_files == 0:
        print("No supported resume files (.pdf, .docx, .doc, .svg, .png, .jpg, .jpeg) found in the specified directory.")
        sys.exit(0)
        
    print(f"Found {total_files} resume files to process.")
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
            
        # Prepare multi-part form request
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
            
        # Move to next file immediately
        if index < total_files:
            print("-" * 60)
            
    print("\n" + "=" * 60)
    print("BATCH PROCESSING COMPLETED SUMMARY")
    print("=" * 60)
    print(f"Total resumes found:   {total_files}")
    print(f"Successfully parsed:   {success_count}")
    print(f"Failed / Errored:      {fail_count}")
    print("=" * 60)

if __name__ == "__main__":
    run_batch_parsing()
