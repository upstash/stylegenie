from crawler import Crawler
import upstash_vector as uv
import os

nike_man_urls = {
    "pants": "https://www.nike.com/w/mens-pants-tights-2kq19znik1",
    "sweatshirts": "https://www.nike.com/w/mens-hoodies-pullovers-6riveznik1",
    "jackets": "https://www.nike.com/w/mens-jackets-vests-50r7yznik1",
    "tops": "https://www.nike.com/w/mens-tops-t-shirts-9om13znik1",
    "shorts": "https://www.nike.com/w/mens-shorts-38fphznik1",
}

nike_woman_urls = {
    "sweatshirts":"https://www.nike.com/w/womens-hoodies-pullovers-5e1x6z6rive",
    "pants": "https://www.nike.com/w/womens-pants-tights-2kq19z5e1x6",
    "leggings": "https://www.nike.com/w/womens-tights-leggings-29sh2z5e1x6",
    "jackets": "https://www.nike.com/w/womens-jackets-vests-50r7yz5e1x6",
    "tops": "https://www.nike.com/w/womens-tops-t-shirts-5e1x6z9om13",
    "shorts": "https://www.nike.com/w/womens-shorts-38fphz5e1x6",
}

upstash_url = os.environ.get("UPSTASH_URL")
token = os.environ.get("UPSTASH_TOKEN")
index = uv.Index(url=upstash_url, token=token)

nikeCrawler = Crawler(
    index=index,
    man_urls=nike_man_urls,
    woman_urls=nike_woman_urls,
    brand="nike",
    product_list_locator="product-card",
    product_link_locator="product-card__link-overlay",
    image_selector='div > figure > a.product-card__img-link-overlay > div > img',
    product_image_src="src",
)

list = [ nikeCrawler ]

for crawler in list:
    print("-------------------- Scraping " + crawler.brand + " --------------------")
    crawler.setup_driver()
    crawler.scrape()
    crawler.close_driver()
    print("-------------------- Scraping " + crawler.brand + " finished --------------------")