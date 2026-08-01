import os
from openai import AsyncOpenAI
from dotenv import load_dotenv
import json
import re

load_dotenv()

class OpenRouterService:
    def __init__(self):
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key or "your_openrouter_api_key" in api_key:
            # For development, we'll allow initialization but fail gracefully on run
            api_key = "sk-no-key-provided"
            
        self.client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key
        )
        self.model = "deepseek/deepseek-v4-flash" # As requested by user

    async def run_prompt(self, system_prompt: str, user_prompt: str) -> dict:
        try:
            response = await self.client.chat.completions.create(
                model=self.model, 
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
            
            # Fix trailing commas which cause 'Expecting property name enclosed in double quotes'
            content = re.sub(r',\s*([\}\]])', r'\1', content)
            
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                print("JSONDecodeError encountered. Attempting to repair JSON...")
                try:
                    import json_repair
                    repaired = json_repair.repair_json(content, return_objects=True)
                    if isinstance(repaired, dict):
                        return repaired
                except ImportError:
                    print("json-repair library not installed. Falling back to regex extraction.")
                
                # Ultimate Fallback: Find the first { and last }
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
            print(f"Error in OpenRouterService: {e}")
            if hasattr(e, 'response'):
                print(f"Response status: {e.response.status_code}")
                print(f"Response body: {e.response.text}")
            raise e
