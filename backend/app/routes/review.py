from fastapi import APIRouter , HTTPException
from app.schemas.review import ReviewRequest , ReviewResponse
from app.services.gemini import get_code_review

router = APIRouter()

@router.post("/review", response_model = ReviewResponse)
async def review_code(request: ReviewRequest):
    try:
        result = await get_code_review( request.code , request.language)
        return result
    except RuntimeError as e :
        raise HTTPException (status_code = 500 , detail=str(e))