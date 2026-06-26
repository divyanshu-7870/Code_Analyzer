import os
import httpx
from fastapi import APIRouter , HTTPException
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_REDIRECT_URI = "http://localhost:8000/api/github/callback"

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
        raise HTTPException(status_code=400, detail="Failed to get access token from Github")
    
    access_token = token_data["access_token"]

    return RedirectResponse(
        url=f"http://localhost:5173?github_token=={access_token}"
    )