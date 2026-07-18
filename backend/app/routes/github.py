import os
import httpx
import json
import logging
from fastapi import APIRouter , HTTPException
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.review import Review
from app.services.gemini import get_code_review

load_dotenv()

logger = logging.getLogger(__name__)

router = APIRouter()

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000").rstrip("/")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
GITHUB_REDIRECT_URI = f"{BACKEND_URL}/api/github/callback"

@router.get("/github/login")
def github_login():
    github_auth_url = (
        f"http://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&scope=repo"
        f"&redirect_uri={GITHUB_REDIRECT_URI}"
    )
    return RedirectResponse(url=github_auth_url)



@router.get("/github/callback")
async def github_callback(code: str):
    async with httpx.AsyncClient(timeout=30.0) as client:
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": GITHUB_REDIRECT_URI,
            },
            headers={"Accept": "application/json"}
        )
    token_data = token_response.json()

    if "access_token" not in token_data:
      error_code = token_data.get("error", "unknown_error")
      error_description = token_data.get("error_description", "Unknown GitHub OAuth error")
      logger.warning(
          "GitHub OAuth token exchange failed: status=%s error=%s description=%s redirect_uri=%s",
          token_response.status_code,
          error_code,
          error_description,
          GITHUB_REDIRECT_URI,
      )
      raise HTTPException(status_code=400, detail=f"GitHub OAuth token exchange failed: {error_description}")

    
    access_token = token_data["access_token"]

    return RedirectResponse(
        url=f"{FRONTEND_URL}?github_token={access_token}"
    )

@router.get("/github/repos")
async def get_repos(token: str):
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(
            "https://api.github.com/user/repos",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json"
            },
            params={"sort": "updated", "per_page": 50}
        )
    if response.status_code != 200:
        raise HTTPException(status_code = response.status_code, detail="Failed to fetch repos")
    
    repos = response.json()
    return[
        {
            "name" : r["name"],
            "full_name": r["full_name"],
            "private" : r["private"],
            "language": r["language"],
            "updated_at" : r["updated_at"]
        }
        for r in repos
    ]
@router.get("/github/tree")
async def get_repo_tree(token: str, repo: str):
    async with httpx.AsyncClient(timeout= 30.0) as client:
        response = await client.get(
            f"https://api.github.com/repos/{repo}/git/trees/HEAD",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json"
            },
            params={"recursive": "1"}
        )
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail = "Failed to fetch tree")
    
    tree_data = response.json()
    files=[
        item for item in tree_data.get("tree", [])
        if item["type"] == "blob"
    ]
    return files

@router.get("/github/file")
async def get_file_content(token: str, repo: str, path: str):
    async with httpx.AsyncClient(timeout= 30.0) as client:
        response = await client.get(
            f"https://api.github.com/repos/{repo}/contents/{path}",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
    
    if response.status_code != 200:
        raise HTTPException(status_code= response.status_code, detail= "Failed to fetch file")
    
    file_data= response.json()

    import base64
    content = base64.b64decode(file_data["content"]).decode("utf-8")
    
    return{
        "name": file_data["name"],
        "path": file_data["path"],
        "content": content
    }


@router.get("/github/review-file")
@router.post("/github/review-file")
async def review_github_file(token: str, repo: str, path: str, db: Session = Depends(get_db)):
    async with httpx.AsyncClient(timeout=30.0) as client:
        response= await client.get(
            f"https://api.github.com/repos/{repo}/contents/{path}",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
    
    if response.status_code != 200:
        raise HTTPException(status_code = response.status_code, detail = "Failed to fetch file" )
    
    import base64
    file_data = response.json()
    code = base64.b64decode(file_data["content"]).decode("utf-8")
    language = path.split(".")[-1]

    result = await get_code_review(code, language)

    review = Review(
        code=code,
        language=language,
        issues = json.dumps(result["issues"]),
        score = result["score"],
        summary = result["summary"]
    )
    db.add(review)
    db.commit()

    return result


