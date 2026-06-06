import json
import re
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv()

client = genai.Client(api_key = os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """
You are a senior software engineer conducting a professional code review.
Your job is to analyze code and return structured feedback

STRICT_RULES :
- Return only valid JSON. No explaination, no markdown, no backticks.
- Every issue must have all required fields.
- line_number must be an integer matching the actual line in the code.
- severity must be exactly : "high" , "medium" , or "low"
- category must be exactly : "bug" , "security" , "performance", or "style"
- If code has no issues return: {"issues" :[] , "score" : 100 , "summary" : "No issues found".}

SCORING :
- Start at 100
- Deduct 15 per high severity issue
- Deduct 8 per medium severity issue
- Deduct 3 per low severity issue
- Minimum score is 0
"""

def build_review_prompt(code : str , language : str) -> str :
    return f"""

Review this {language} code:

'''{language}
{code}
'''

Return a JSON object with exactly this structure:
{{
    "issues" : [
    {{
        "line_number" : <integer>,
        "severity" : < "high" | "medium" | "low">,
        "category" : < "bug" | "security" | "performance" | "style" >,
        "description" : <string, what is wrong>,
        "suggestion" : <string , how to fix it>,
        "fixed_code_snippet" : <string, the corrected line or block only>
    }}
    ],
    "score" : <integer 0-100>,
    "summary" : <string, 1-2 sentence overall assessment>

}}

"""

async def get_code_review(code: str , language : str) -> dict:
    # model = genai.GenerativeModel(
    #     model_name = "gemini-1.5-flash",
    #     system_instruction=SYSTEM_PROMPT
    # )

    prompt = build_review_prompt(code, language)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.1,
            ),
        )
        raw = response.text.strip()

        raw = re.sub(r"```json|```", "", raw).strip()

        parsed = json.loads(raw)

        if "issues" not in parsed:
            raise ValueError("Missing issues key in response")

        return parsed
    except json.JSONDecodeError:
        return {
            "issues": [],
            "score": 0,
            "summary": "Review failed - could not parse AI response.",
        }
    except Exception as e:
        raise RuntimeError(f"Gemini API error: {str(e)}")



async def apply_code_fix(
    original_code:str,
    language:str,
    issue_description:str,
    suggestion:str,
    fixed_code_snippet:str
) -> dict:
    prompt = f"""
You are a senior software Engineer. Apply the following fix to the code.

ORIGINAL CODE:
``` {language}
{original_code}
```

ISSUE: {issue_description}
SUGGESTION: {suggestion}
FIXED SNIPPET: {fixed_code_snippet}

STRICT RULES:
- Return ONLY vaid JSON, no markdown , no backticks
- Apply the fixed correctly while keeping the rest of the code unchanged
- Return exactly this structure: 
{{
    "fixed_code": <the complete corrected code as string>
    "message": <one sentence describing what was fixed>
}}
"""
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
            ),
        )
        raw = response.text.strip()
        raw = re.sub(r"```json|```", "", raw).strip()
        parsed = json.loads(raw)

        if "fixed_code" not in parsed:
            raise ValueError("Missing fixed_code in response")

        return parsed

    except json.JSONDecodeError:
        return {
            "fixed_code": original_code,
            "message": "Fix could not be applied - returned original code.",
        }
    except Exception as e:
        raise RuntimeError(f"Gemini API error : {str(e)}")



# # Temporary - delete after testing
# if __name__ == "__main__":
#     for model in client.models.list():
#         print(model.name)