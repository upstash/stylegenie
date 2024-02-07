import os
import image_controller
import chatgpt
import models
from fastapi import FastAPI, HTTPException, Request
from slowapi.errors import RateLimitExceeded
from slowapi import Limiter, _rate_limit_exceeded_handler
from fastapi.middleware.cors import CORSMiddleware
from slowapi.util import get_remote_address
import upstash_vector as uv
from openai import OpenAI

upstash_url = os.environ.get("UPSTASH_URL")
upstash_token = os.environ.get("UPSTASH_TOKEN")
openai_key = os.environ.get("OPENAI_KEY")

if not (upstash_url and upstash_token and openai_key):
    raise Exception("Environment variables not set.")

index = uv.Index(url=upstash_url, token=upstash_token)
client = OpenAI(api_key=openai_key)


limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/image")
@limiter.limit("220/day")
async def image(image: models.ImageReq, request: Request):    
    result = chatgpt.is_valid_prompt(client, image.prompt)
    
    if result == "False":
        raise HTTPException(status_code=400, detail="Prompt is not valid.")
    
    #append prompt to beginning of revise list
    if image.revise_list:
        image.revise_list.insert(0, image.prompt)
        image.prompt = chatgpt.merge_prompts(client, image.revise_list)
    
    base_prompt = f"{image.prompt}, for {image.gender}, photorealistic, plain product, white background, single product."
    base_prompt_with_model = f"{image.prompt} with {image.gender} fashion model wearing it and showing full body of model with a white background."
    
    if image.with_model:
        # Generate image with model
        image_url = image_controller.generate_product_image(client, base_prompt_with_model)
    else:
        # Generate image without model
        image_url = image_controller.generate_product_image(client, base_prompt)
                
    resp = models.ImageResp(image_url=image_url)
    
    return resp


@app.post("/query")
@limiter.limit("20/day")
async def query(result: models.ResultReq , request: Request):    
    if not (result.image_url):
        raise HTTPException(status_code=400, detail="Image URL is required.")    
            
    try:
        embedding = image_controller.transform_image(result.image_url)
    except:
        raise HTTPException(status_code=400, detail="Error transform image embedding.")
    
    try:
        res = index.query(
        vector=embedding, 
        top_k=6, 
        include_metadata=True, 
        include_vectors=False,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error querying index: {e}")

    resp = models.ResultResp(result=res)

    return resp
