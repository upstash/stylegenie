import os
import image_controller
import chatgpt
import models
from fastapi import FastAPI, HTTPException, Request, File, UploadFile
from slowapi.errors import RateLimitExceeded
from slowapi import Limiter, _rate_limit_exceeded_handler
from fastapi.middleware.cors import CORSMiddleware
from slowapi.util import get_remote_address
from transformers import CLIPModel
import upstash_vector as uv
from typing import Optional
from openai import OpenAI

upstash_url = os.environ.get("UPSTASH_URL")
upstash_token = os.environ.get("UPSTASH_TOKEN")
openai_key = os.environ.get("OPENAI_KEY")

if not (upstash_url and upstash_token and openai_key):
    raise Exception("Environment variables not set.")

index = uv.Index(url=upstash_url, token=upstash_token)
client = OpenAI(api_key=openai_key)
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")

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
    
    base_prompt = f"a product photo of a cloth, featuring clean lines and styling. Description: {image.prompt} for {image.gender}. Plain white background. Single product."
    base_prompt_with_model = f"{image.prompt}, product for gender {image.gender}, fashion model wearing it and showing full body of model with a white background."
    
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
async def query(request: Request, file: Optional[UploadFile] = File(None)):
    
    form = await request.form()
    
    gender = form.get("gender")
    
    if not (file):
        image_url = form.get("image_url")
        if not image_url:
            raise HTTPException(status_code=400, detail="Image URL or file is required.")
            
    if file:
        if file.size > 5242880:
            raise HTTPException(status_code=400, detail="File size too large. Max 5MB.")
        try:
            embedding = image_controller.transform_image(model, file, True)
        except:
            raise HTTPException(status_code=400, detail="Error transform image embedding.")
    else:
        try:
            embedding = image_controller.transform_image(model, image_url, False)
        except:
            raise HTTPException(status_code=400, detail="Error transform image embedding.")
    
    try:
        gf = ""
        if gender:
            gf = f"gender = '{gender}'"
        
        res = index.query(
        vector=embedding, 
        top_k=6, 
        include_metadata=True, 
        include_vectors=False,
        filter=gf
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error querying index: {e}")

    resp = models.ResultResp(result=res)

    return resp
