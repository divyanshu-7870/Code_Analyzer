from fastapi import APIRouter , HTTPException
from app.schemas.review import ReviewRequest , ReviewResponse , ApplyRequest, ApplyResponse
from app.services.gemini import get_code_review, apply_code_fix

router = APIRouter()

@router.post("/review", response_model = ReviewResponse)
async def review_code(request: ReviewRequest):
    try:
        result = await get_code_review( request.code , request.language)
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