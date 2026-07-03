from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.review import router as review_router
from app.routes.history import router as history_router
from app.db.database import engine, Base
from app.routes.github import router as github_router

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title = "Code Analyzer API",
    version = "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(review_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(github_router, prefix="/api")

@app.get("/")
def health_check():
    return {"status" : "ok", "message": "Code Analyzer API is running"}


import os
required_env_vars = ["GEMINI_API_KEY", "GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"]
for var in required_env_vars:
    if not os.getenv(var):
        raise RuntimeError(f"Missing required environment variable: {var}")