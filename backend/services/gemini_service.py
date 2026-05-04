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
        self.model_id = 'gemini-2.0-flash'

    async def analyze_video(self, video_path: str, prompt: str) -> dict:
        try:
            # 1. Upload the file
            # In the new SDK, files are uploaded via client.files.upload
            with open(video_path, 'rb') as f:
                video_file = self.client.files.upload(file=f)

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
                import re
                match = re.search(r'(\{.*\})', content, re.DOTALL)
                if match:
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
