import asyncio
import os
import httpx
import json
import logging
import time
from urllib.parse import urlencode
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

# GitHub authorization codes can only be exchanged once. Browsers and hosting
# proxies may retry a callback after the first request has already succeeded,
# so keep the successful redirect briefly and return it on a duplicate request.
_oauth_callback_cache: dict[str, tuple[float, str]] = {}
_oauth_callback_lock = asyncio.Lock()
_OAUTH_CALLBACK_CACHE_TTL_SECONDS = 300


def _remove_expired_callback_cache_entries(now: float) -> None:
    expired_codes = [
        code
        for code, (expires_at, _) in _oauth_callback_cache.items()
        if expires_at <= now
    ]
    for expired_code in expired_codes:
        del _oauth_callback_cache[expired_code]

@router.get("/github/login")
def github_login():
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&scope=repo"
        f"&redirect_uri={GITHUB_REDIRECT_URI}"
    )
    return RedirectResponse(url=github_auth_url)



@router.get("/github/callback")
async def github_callback(code: str):
    async with _oauth_callback_lock:
        now = time.monotonic()
        _remove_expired_callback_cache_entries(now)
        cached_result = _oauth_callback_cache.get(code)
        if cached_result:
            logger.info("Returning cached GitHub OAuth callback redirect for a duplicate code")
            return RedirectResponse(url=cached_result[1])

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

        redirect_url = f"{FRONTEND_URL}/github?{urlencode({'github_token': token_data['access_token']})}"
        _oauth_callback_cache[code] = (now + _OAUTH_CALLBACK_CACHE_TTL_SECONDS, redirect_url)
        return RedirectResponse(url=redirect_url)

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
