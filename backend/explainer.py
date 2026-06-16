import os
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if GEMINI_API_KEY:
    from google import genai
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None

def generate_explanation(code: str, step_data: dict) -> str:
    if not client:
        line_num = step_data.get("line", "?")
        return f"Executing line {line_num}. Add GEMINI_API_KEY to backend/.env to see AI explanations!"
    
    prompt = f"""
You are an expert Python tutor explaining code execution step-by-step.
The user is executing the following Python code:
```python
{code}
```

We are currently at line {step_data.get('line')}.
The current execution state (JSON) is:
{json.dumps(step_data, indent=2)}

Please provide a concise, 1-2 sentence explanation of what is happening on this exact line and how the state changed. 
Be educational but brief. Do not use code blocks for your answer, just plain text or light markdown.
"""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg or "Quota" in error_msg:
            return "Gemini Rate Limit Reached (Free Tier). Please wait a minute for the quota to reset."
        return f"AI Generation Failed: {error_msg}"
