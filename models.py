from pydantic import BaseModel
from typing import List, Optional

class ResultReq(BaseModel):
    image_url: str
    
class ImageReq(BaseModel):
    prompt: str
    gender: str 
    with_model: Optional[bool] = False
    revise_list: Optional[List[str]] = []
    
class ResultResp(BaseModel):
    result: List
    
class ImageResp(BaseModel):
    image_url: str
    