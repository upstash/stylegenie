from io import BytesIO
from PIL import Image
from torchvision import transforms
from transformers import CLIPModel
import numpy as np
import requests
import torch


def generate_product_image(client, prompt):
    """
    Generates a product image using OpenAI's DALL·E model.

    Args:
    - api_key (str): The API key for accessing OpenAI's services.
    - prompt (str): The prompt for generating the image.

    Returns:
    - str: The path to the saved image.
    """

    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        style="vivid",
        n=1
    )
        
    return response.data[0].url

def transform_image(image_url):
    """
    Preprocesses an image and returns its embedding using the provided CLIP model and preprocessing transforms.
    
    Args:
    - model (CLIPModel): The CLIP model.
    - preprocess (transforms.Compose): The preprocessing transforms.
    - image_path (str): The path to the input image.
    
    Returns:
    - np.array: The image embedding as a numpy array.
    """
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    
    preprocess = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ])
    
    headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"}
    image_response = requests.get(image_url, headers=headers)
    image_response.raise_for_status()
    image = Image.open(BytesIO(image_response.content))
    query_embedding = preprocess(image).unsqueeze(0)
    with torch.no_grad():
        features = model.get_image_features(pixel_values=query_embedding)
    embedding = features.squeeze().cpu().numpy()
    return embedding.astype(np.float32)