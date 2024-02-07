from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import numpy as np
from PIL import Image
from torchvision import transforms
import torch
from transformers import CLIPModel
import requests
from io import BytesIO

class Crawler:
    def __init__(self, index, man_urls, woman_urls, brand, product_list_type=None, product_list_locator=None, product_link_type=None, product_image_type=None, product_link_locator=None, product_image_locator=None, image_selector=None,image_selector_src=None, product_image_src=None, product_image_prefix=None, image_parser=None, show_more_button_type=None, show_more_button_locator=None, cookie_button_type=None, cookie_button_locator=None, close_button_type=None, close_button_locator=None, region_button_type=None, region_button_locator=None, contains_alpha_images=False):
      """
        Initializes the Crawler object.

        Args:
        - index (object): The index object for the vector database.
        - man_urls (dict): Dictionary containing URLs for men's categories.
        - woman_urls (dict): Dictionary containing URLs for women's categories.
        - brand (str): The brand name for the products being crawled.
        - product_list_type (str): Type of element containing the products.
        - product_list_locator (str): Locator for the product list element.
        - product_link_type (str): Type of element containing the product link.
        - product_image_type (str): Type of element containing the product image.
        - product_link_locator (str): Locator for the product link element.
        - product_image_locator (str): Locator for the product image element.
        - image_selector (str): CSS selector for the product image.
        - image_selector_src (str): Attribute name containing the image source in the image_selector.
        - product_image_src (str): Attribute name containing the image source in the product_image_locator.
        - product_image_prefix (str): Prefix to be added to the product image URL.
        - image_parser (str): Parser for the product image URL for srcset images (e.g: "2x" , "500w").
        - show_more_button_type (str): Type of element for the "Show More" button.
        - show_more_button_locator (str): Locator for the "Show More" button.
        - cookie_button_type (str): Type of element for the cookie consent button.
        - cookie_button_locator (str): Locator for the cookie consent button.
        - close_button_type (str): Type of element for the close button.
        - close_button_locator (str): Locator for the close button.
        - region_button_type (str): Type of element for the region selection button.
        - region_button_locator (str): Locator for the region selection button.
        - contains_alpha_images (bool): Whether the images contain alpha channels.
      """
      self.index = index
      self.man_urls = man_urls
      self.woman_urls = woman_urls
      self.brand = brand
      self.product_list_type = product_list_type
      self.product_list_locator = product_list_locator
      self.product_link_type = product_link_type
      self.product_link_locator = product_link_locator
      self.product_image_type = product_image_type
      self.product_image_locator = product_image_locator
      self.image_selector = image_selector
      self.image_selector_src = image_selector_src
      self.product_image_src = product_image_src
      self.product_image_prefix = product_image_prefix
      self.image_parser = image_parser
      self.cookie_button_type = cookie_button_type
      self.cookie_button_locator = cookie_button_locator
      self.close_button_type = close_button_type
      self.close_button_locator = close_button_locator
      self.region_button_type = region_button_type
      self.region_button_locator = region_button_locator
      self.show_more_button_type = show_more_button_type
      self.show_more_button_locator = show_more_button_locator
      self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
      self.preprocess = transforms.Compose([
          transforms.Resize((224, 224)),
          transforms.ToTensor(),
          transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])
      self.contains_alpha_images = contains_alpha_images
      self.driver = None
      self.wait = None

    def setup_driver(self):
        """
        Set up the Chrome WebDriver for scraping.
        """
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.page_load_strategy = 'eager'
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument('--ignore-certificate-errors')
        chrome_options.add_argument('--allow-running-insecure-content')
        user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        chrome_options.add_argument(f'user-agent={user_agent}')
        chrome_options.add_argument("--incognito")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_argument("--disable-user-media-security=true")
        self.driver = webdriver.Chrome(options=chrome_options)
        self.wait = WebDriverWait(self.driver, 20)

    def crawl(self):
        """
        Crawles the URLs provided in the constructor.
        """
        urls_list = [self.man_urls, self.woman_urls]
        for index, urls in enumerate(urls_list):
          for category, url in urls.items():
              print(f"Scraping images for {self.getGenderByIndex(index)}'s {category}...")
              self.driver.get(url)

              now = time.time()
              while True:
                  self.driver.execute_script('window.scrollTo({top: 0, left: document.body.scrollHeight, behavior: "smooth"});')
                  time.sleep(1)

                  if self.cookie_button_locator != None: 
                      try:
                          self.driver.find_element(self.stringToByType(self.cookie_button_type), self.cookie_button_locator).click()
                      except:
                          self.cookie_button_locator = None

                  if self.close_button_locator != None: 
                    try:
                        self.driver.find_element(self.stringToByType(self.close_button_type), self.close_button_locator).click()
                    except:
                        self.close_button_locator = None

                  if self.region_button_locator != None: 
                    try:
                        self.driver.find_element(self.stringToByType(self.region_button_type), self.region_button_locator).click()
                    except:
                        self.region_button_locator = None

                  if self.show_more_button_locator != None:
                      try:
                          self.driver.find_element(self.stringToByType(self.show_more_button_type), self.show_more_button_locator).click()
                      except:
                          self.show_more_button_locator = None
                  
                  self.driver.execute_script('window.scrollTo({top: document.body.scrollHeight, left: 1, behavior: "smooth"});')
                  time.sleep(1)

                  if time.time() - now > 15:
                      break

              self.wait.until(EC.presence_of_element_located((self.stringToByType(self.product_list_type), self.product_list_locator)))
              product_images = self.driver.find_elements(self.stringToByType(self.product_list_type), self.product_list_locator)

              for img in product_images:
                  try:
                      product_link = img.find_element(self.stringToByType(self.product_link_type), self.product_link_locator).get_attribute("href")

                      if self.product_image_locator != None:
                          product_image = img.find_element(self.stringToByType(self.product_image_type), self.product_image_locator).get_attribute(self.product_image_src)
                      else:
                          product_image = img.find_element(By.CSS_SELECTOR, self.image_selector).get_attribute(self.product_image_src)
                      
                      if product_image == None and self.image_selector != None:
                          try:
                              product_image = img.find_element(By.CSS_SELECTOR, self.image_selector).get_attribute(self.image_selector_src)
                          except:
                              self.log("Error while scraping product image. product_link: " + product_link + " product_image: " + product_image)
                              continue
                      
                      if product_image != None and self.product_image_prefix != None:
                          product_image = "https:" + product_image
                          
                      if product_link == None or product_image == None:
                          self.log("Error while scraping product image. product_link: " + product_link + " product_image: " + product_image)
                          continue
                      

                      if self.image_parser != None:
                          try:
                              product_image = product_image.split(",")[1].replace(" " + self.image_parser, "").replace(" ", "")
                          except:
                              self.log("Error while parsing image. product_image: " + product_image)
                              continue
                          
                      self.put_vector(product_link, product_image, self.brand, category, self.getGenderByIndex(index))

                  except Exception as e:
                      self.log("Error while scraping product image. e: " + str(e))
                      continue
                
    def put_vector(self, product_link, product_image, brand, category, gender):
        try:
          now = time.time()
          metadata = {"url": product_link, "image": product_image, "brand": brand, "category": category, "gender": gender, "created_at": now, "updated_at": now}
          headers = {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          }
          response = requests.get(product_image, headers=headers)
          image = Image.open(BytesIO(response.content))
          
          if self.contains_alpha_images:
            image = self.rgbaToRgb(image)
          
          embedding = self.transform_image(image).tolist()
          resp = self.index.upsert(vectors = [(product_link, embedding, metadata)])
          print("Upserted product to Upstash Vector DB. resp: ", resp)
        except Exception as e:
          print("Error while upserting product to Upstash Vector DB. e: ", e)
          self.log("Error while upserting product to Upstash Vector DB. e: " + str(e))

    def transform_image(self, image):
      """
        Transforms an image into a CLIP embedding.
      """
      image = self.preprocess(image)
      image = image.unsqueeze(0)
      with torch.no_grad():
          features = self.model.get_image_features(pixel_values=image)
      embedding = features.squeeze().cpu().numpy()
      return embedding.astype(np.float32)

    def close_driver(self):
        """
        Closes the Chrome WebDriver.
        """
        if self.driver:
            self.driver.quit()
    
    def stringToByType(self, type):
        """
        Converts a string to a Selenium By type.
        """

        if type == "CLASS_NAME":
            return By.CLASS_NAME
        elif type == "CSS_SELECTOR":
            return By.CSS_SELECTOR
        elif type == "TAG_NAME":
            return By.TAG_NAME
        elif type == "XPATH":
            return By.XPATH
        elif type == "ID":
            return By.ID
        elif type == None:
            return By.CLASS_NAME
        else:
            return By.CLASS_NAME
        
    def rgbaToRgb(self, image):
        """
        Converts an RGBA image to RGB with a white background.
        """
        rgba_img = image.convert('RGBA')
        new_img = Image.new('RGBA', rgba_img.size, (255, 255, 255))
        final_img = Image.alpha_composite(new_img, rgba_img)
        rgb_image = final_img.convert('RGB')
        return rgb_image
        
    def getGenderByIndex(self, index):
        if index == 0:
            return "man"
        elif index == 1:
            return "woman"
        else:
            return "unisex"

    def log(self, message):
        #write to a log file
        with open("log.txt", "a") as f:
            f.write("[" + str(time.time()) + "] " + message + "\n")