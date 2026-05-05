import os
from google import genai
from dotenv import load_dotenv
import json
import asyncio

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or "your_gemini_api_key" in api_key:
            api_key = "AIza-no-key-provided"
        
        self.client = genai.Client(api_key=api_key)
        # Using 1.5-flash because the logs show 2.0-flash has a 'limit: 0' in the user's region
        self.model_id = 'gemini-2.5-flash'

    async def analyze_video(self, video_path: str, prompt: str) -> dict:
        try:
            # 1. Upload the file
            # Pass the file path directly so the SDK can infer the mime type from the extension
            video_file = self.client.files.upload(file=video_path)

            # 2. Wait for processing
            while video_file.state == "PROCESSING":
                await asyncio.sleep(2)
                video_file = self.client.files.get(name=video_file.name)

            if video_file.state == "FAILED":
                raise ValueError("Video processing failed")

            # 3. Generate content
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=[video_file, prompt]
            )

            # 4. Extract JSON
            content = response.text
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                print("JSONDecodeError in Gemini video analysis. Attempting repair...")
                try:
                    import json_repair
                    repaired = json_repair.repair_json(content, return_objects=True)
                    if isinstance(repaired, dict):
                        return repaired
                except:
                    pass
                
                import re
                match = re.search(r'(\{.*\})', content, re.DOTALL)
                if match:
                    try:
                        import json_repair
                        return json_repair.repair_json(match.group(1), return_objects=True)
                    except:
                        try:
                            return json.loads(match.group(1))
                        except:
                            pass
                raise
        except Exception as e:
            print(f"Error in GeminiService: {e}")
            raise e
        finally:
            # Cleanup
            try:
                self.client.files.delete(name=video_file.name)
            except:
                pass
