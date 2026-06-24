import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.review import Review

router = APIRouter()

@router.get("/history")
def get_history(db: Session = Depends(get_db)):
    reviews = db.query(Review).order_by(Review.created_at.desc()).all()

    result = []
    
    for r in reviews:
        result.append({
            "id" : r.id,
            "code": r.code,
            "language": r.language,
            "issues": json.loads(r.issues),
            "score": r.score,
            "summary": r.summary,
            "created_at": r.created_at
        })
    
    return result