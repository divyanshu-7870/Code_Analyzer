from pydantic import BaseModel
from typing import List, Literal


class ReviewRequest(BaseModel) :
    code : str
    language : str

class Issue(BaseModel) :
    line_number : int
    severity : Literal["high", "medium", "low"]
    category : Literal["bug", "security", "performance", "style"]
    description : str
    suggestion : str
    fixed_code_snippet : str

class ReviewResponse(BaseModel) :
    issues : List[Issue]
    score : int
    summary : str

class ApplyRequest(BaseModel) :
    original_code : str
    language : str
    issue_description : str
    suggestion : str
    fixed_code_snippet : str

class ApplyResponse(BaseModel):
    fixed_code: str
    message: str
    