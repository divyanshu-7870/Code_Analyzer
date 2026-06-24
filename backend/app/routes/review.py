import json
from fastapi import APIRouter , HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.review import ReviewRequest , ReviewResponse , ApplyRequest, ApplyResponse
from app.services.gemini import get_code_review, apply_code_fix
from app.db.database import get_db
from app.models.review import Review

router = APIRouter()

@router.post("/review", response_model = ReviewResponse)
async def review_code(request: ReviewRequest, db: Session = Depends(get_db)):
    try:
        result = await get_code_review( request.code , request.language)

        review = Review(
            code=request.code,
            language=request.language,
            issues=json.dumps(result["issues"]),
            score=result["score"],
            summary=result["summary"]
        )

        db.add(review)
        db.commit()

        return result
    except RuntimeError as e :
        raise HTTPException (status_code = 500 , detail=str(e))
    
@router.post("/apply", response_model=ApplyResponse)
async def apply_fix(request: ApplyRequest):
    try:
        result = await apply_code_fix(
            original_code=request.original_code,
            language=request.language,
            issue_description=request.issue_description,
            suggestion=request.suggestion,
            fixed_code_snippet=request.fixed_code_snippet
        )
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))