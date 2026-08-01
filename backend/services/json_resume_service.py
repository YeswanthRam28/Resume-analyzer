import json
import os
import tempfile
import subprocess
from pathlib import Path

def map_to_json_resume(db_data: dict) -> dict:
    contact = db_data.get("contact_info", {}) or {}
    
    # Handle location properly whether it's a string or dict
    location = contact.get("location", "")
    loc_dict = {}
    if isinstance(location, dict):
        loc_dict = {
            "city": location.get("city", ""),
            "region": location.get("state", "")
        }
    else:
        loc_dict = {"city": str(location)}

    profiles = []
    if contact.get("linkedin"):
        profiles.append({"network": "LinkedIn", "url": contact.get("linkedin")})
    if contact.get("github"):
        profiles.append({"network": "GitHub", "url": contact.get("github")})

    json_resume = {
        "basics": {
            "name": contact.get("name", "Candidate Name"),
            "email": contact.get("email", ""),
            "phone": contact.get("phone", ""),
            "url": contact.get("website", ""),
            "summary": db_data.get("summary", ""),
            "location": loc_dict,
            "profiles": profiles
        },
        "work": [],
        "education": [],
        "skills": [],
        "projects": []
    }

    # Map Experience -> work
    for exp in db_data.get("experience") or []:
        json_resume["work"].append({
            "name": exp.get("company", ""),
            "position": exp.get("role", ""),
            "location": exp.get("location", ""),
            "startDate": exp.get("start_date", ""),
            "endDate": exp.get("end_date", ""),
            "highlights": exp.get("bullet_points", [])
        })

    # Map Education -> education
    for edu in db_data.get("education") or []:
        json_resume["education"].append({
            "institution": edu.get("institution", ""),
            "area": edu.get("field_of_study", ""),
            "studyType": edu.get("degree", ""),
            "startDate": edu.get("start_date", ""),
            "endDate": edu.get("end_date", ""),
            "score": edu.get("gpa", "")
        })

    # Map Skills
    skills_data = db_data.get("skills") or {}
    for category, items in skills_data.items():
        if items:
            json_resume["skills"].append({
                "name": category.capitalize(),
                "keywords": items
            })

    # Map Projects -> projects
    for proj in db_data.get("projects") or []:
        json_resume["projects"].append({
            "name": proj.get("name", ""),
            "description": proj.get("description", ""),
            "keywords": proj.get("technologies", []),
            "url": proj.get("link", ""),
            "highlights": []
        })

    return json_resume


def generate_html_theme(resume_data: dict, theme_name: str) -> str:
    """Converts internal resume data to JSON Resume format and renders to HTML."""
    json_resume = map_to_json_resume(resume_data)
    
    # Save to a temporary file
    with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False, encoding='utf-8') as f:
        json.dump(json_resume, f)
        temp_path = f.name

    try:
        engine_dir = Path(__file__).parent.parent / 'template_engine'
        render_script = engine_dir / 'render.js'
        
        # Run Node script
        # Command: node render.js <theme> <json_path>
        result = subprocess.run(
            ['node', str(render_script), theme_name, temp_path],
            cwd=str(engine_dir),
            capture_output=True,
            text=True,
            check=True
        )
        html_output = result.stdout
        return html_output
    except subprocess.CalledProcessError as e:
        print("Node rendering error:", e.stderr)
        raise RuntimeError(f"Failed to render theme {theme_name}: {e.stderr}")
    finally:
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
