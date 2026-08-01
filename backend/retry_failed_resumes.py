import os
import sys
import requests
import mimetypes

# Base configurations
API_URL = "http://localhost:8000/api/resume/parse"

# The exact list of failed or null resumes extracted from the latest batch log
FAILED_RESUMES = [
    # Accounts - returned None
    {
        "path": r"d:\Projects\Rescore\Resume sample\Resume sample\word\Accounts\account-manager-corporate-v1.doc",
        "inferred_role": "Accounts Professional"
    },
    # IT - returned None (all software-project-manager .doc files)
    {
        "path": r"d:\Projects\Rescore\Resume sample\Resume sample\word\IT\software-project-manager-v1.doc",
        "inferred_role": "IT Professional"
    },
    {
        "path": r"d:\Projects\Rescore\Resume sample\Resume sample\word\IT\software-project-manager-v14.doc",
        "inferred_role": "IT Professional"
    },
    {
        "path": r"d:\Projects\Rescore\Resume sample\Resume sample\word\IT\software-project-manager-v15.doc",
        "inferred_role": "IT Professional"
    },
    {
        "path": r"d:\Projects\Rescore\Resume sample\Resume sample\word\IT\software-project-manager-v5.doc",
        "inferred_role": "IT Professional"
    },
    {
        "path": r"d:\Projects\Rescore\Resume sample\Resume sample\word\IT\software-project-manager-v9.doc",
        "inferred_role": "IT Professional"
    },
    # Production - returned None
    {
        "path": r"d:\Projects\Rescore\Resume sample\Resume sample\word\Production\bharathi.png",
        "inferred_role": "Production Professional"
    },
    {
        "path": r"d:\Projects\Rescore\Resume sample\Resume sample\word\Production\picking-packer-resume-template.doc",
        "inferred_role": "Production Professional"
    },
    # Sales - returned None (new from latest batch run)
    {
        "path": r"d:\Projects\Rescore\Resume sample\Resume sample\word\Sales\sales-senior-level_v1.doc",
        "inferred_role": "Sales Professional"
    },
    {
        "path": r"d:\Projects\Rescore\Resume sample\Resume sample\word\Sales\Sales_Engineer.doc",
        "inferred_role": "Sales Professional"
    },
    {
        "path": r"d:\Projects\Rescore\Resume sample\Resume sample\word\Sales\warehouse-associate-resume-template.doc",
        "inferred_role": "Sales Professional"
    },
]

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

def run_retry_parsing():
    total_files = len(FAILED_RESUMES)
    
    print(f"Retrying parsing for the {total_files} resumes that failed or returned null in the log.")
    print("-" * 60)
    
    success_count = 0
    fail_count = 0
    
    for index, resume in enumerate(FAILED_RESUMES, start=1):
        file_path = resume["path"]
        filename = os.path.basename(file_path)
        inferred_role = resume["inferred_role"]
        mime_type = get_mime_type(file_path)
        
        print(f"\n[{index}/{total_files}] Processing: {filename}")
        print(f"  Path: {file_path}")
        if inferred_role:
            print(f"  Inferred Role: {inferred_role}")
            
        if not os.path.exists(file_path):
            print(f"  [ERROR] File does not exist at path: {file_path}")
            fail_count += 1
            continue
            
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
