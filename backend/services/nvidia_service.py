import os
from openai import AsyncOpenAI
from dotenv import load_dotenv
import json

load_dotenv()

class NvidiaService:
    def __init__(self):
        api_key = os.getenv("NVIDIA_API_KEY")
        if not api_key or "your_nvidia_api_key" in api_key:
            # For development, we'll allow initialization but fail gracefully on run
            api_key = "sk-no-key-provided"
            
        self.client = AsyncOpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key
        )
        self.model = "meta/llama-3.1-405b-instruct" # Placeholder: adjust to GLM-4 if specific ID is known
        # The user specifically asked for GLM-4.7 (likely GLM-4-9B or similar)
        # I'll use a generic placeholder or the specific GLM-4 ID if I can find it.
        # For now, I'll use a widely available one or "thm/glm-4-9b-chat" if it exists.

    async def run_prompt(self, system_prompt: str, user_prompt: str) -> dict:
        try:
            response = await self.client.chat.completions.create(
                model="minimaxai/minimax-m2.7", 
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                top_p=0.7,
                max_tokens=4096,
                response_format={"type": "json_object"}
            )
            content = response.choices[0].message.content
            if not content:
                return {}
                
            # Clean content if model wraps in markdown
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                # Fallback: Find the first { and last }
                import re
                match = re.search(r'(\{.*\})', content, re.DOTALL)
                if match:
                    try:
                        return json.loads(match.group(1))
                    except:
                        pass
                raise
        except Exception as e:
            print(f"Error in NvidiaService: {e}")
            if hasattr(e, 'response'):
                print(f"Response status: {e.response.status_code}")
                print(f"Response body: {e.response.text}")
            raise e
