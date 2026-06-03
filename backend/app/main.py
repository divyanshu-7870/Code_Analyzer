from fastapi import FastAPI

app = FastAPI(
    title = "Code Analyzer API",
    version = "1.0.0"
)

@app.get("/")
def health_check():
    return {"status" : "ok", "message": "Code Analyzer API is running"}