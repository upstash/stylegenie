# StyleGenie: Fashion Image Generator and Search Engine

Welcome to our fashion image generator and search engine project. This fascinating project effectively combines the power of [Upstash Vector](https://upstash.com/vector) and Dall-E, index and search images from more than 10 online retail stores, such as Nike, Calvin Klein, and Prada.

## Demo

https://stylegenie.vercel.app

Note: The demo supports 10 requests per day. If you would like to test the system more than 10 times, please contact me.

## Features

👗 **Fashion Product Generation**: You can enter a specific item like 'thick woolen sweater in burgundy for a cozy winter' and the system will generate a photorealistic image of the described product. 

🔍 **Product Similarity Search**: We leverage the search capabilities of Upstash Vector to index the images. 

🛒 **Direct Purchase**: The system also provides the product links, leading to a seamless online shopping experience.

👀 **Query Expansion**: The system also supports query expansion. You can revise the generated image and the system will generate a new image based on the revised description.

## Stack

- **Backend**: FastAPI (Fly.io)
- **Frontend**: React.js (Vercel)
- **Data Storage**: Upstash Vector
- **AI**: OpenAI DALL-E and ChatGPT
- **Model**: OpenAI CLIP
- **Crawler**: Selenium

## Architecture

![Structure](https://github.com/upstash/stylegenie/blob/master/architecture.png)

## How it Works

Enter a product description and the system employs DALL-E model to generate high-quality images of the described product. When a query is received with the generated image, the system efficiently retrieves the relevant images from the index. Along with the product links are provided to guide users directly to the online retail shops where the items can be purchased.

## Project Setup and Deployment

1. Clone or download this repository to a directory on your local machine.

2. Navigate into the directory using your terminal.

3. Get your Upstash Vector url and token from [here](https://www.upstash.com).

4. Get your OpenAI API key from [here](https://help.openai.com/en/articles/4936850-where-do-i-find-my-api-key).

5. Install the Fly CLI by running `curl -L https://fly.io/install.sh | sh`.

6. Run `flyctl auth login` to authenticate the CLI.

7. Run `flyctl launch` to create and deploy the application.

8. Set your environment variables using `flyctl secrets set KEY=VALUE`.

9. Run `flyctl deploy` to deploy the application with the updated environment variables.

10. Send a POST request to `https://app_name.fly.dev/image` with the following JSON body. Revise list and with model are optional.

```json
{
    "gender": "woman",
    "product_description": "Blue dress",
    "revise_list": ["make the dress longer", "make the dress black"],
    "with_model": false
}
```

11. The response will contain the generated image and the product links. Which you can post to `https://app_name.fly.dev/query` to query the indexed images.

```json
{
    "image_url": "https://oaidalleapiprodscus.blob.core.windows.net/dalle/0d3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e3e",
}
```

## Future Work

StyleGenie is a work in progress. We are planning to add more features and improve the existing ones. Here are some of the features we are planning to add:

- **Price Field**: This will allow users to see the price of the product in the search results.

- **Filtering**: This will allow users to filter the search results based on the gender, brand, and other attributes.

- **More Stores**: This will allow users to search for products from a wider range of stores.

- **Crawler Improvements**: This will allow us to crawl more fields from the product pages.

- **Crawler Automation**: This will allow us to update the index more frequently.


## Contributing

We welcome contributions from the community. If you would like to contribute, please open an issue or a pull request. 

Sharing the project on social media and with your friends is also a great way to contribute.