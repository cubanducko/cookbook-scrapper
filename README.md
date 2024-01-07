# Cookbook Scrapper

Cookbook Scrapper is a Node.js project designed to scrape and normalize recipes from various websites. The goal is to generate consistent data across different recipe sources.

## Requirements

- Node.js v18 or higher

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/cubanducko/cookbook-scrapper.git
cd cookbook-scrapper
npm install
```

## Usage

There are three main scripts you can run:

- `scrapper`: This script scrapes recipe data from various websites.
- `chatgpt-auth`: This script authenticates with ChatGPT. It's required to run this script before running the normalize script.
- `normalize`: This script normalizes the scraped recipe data. It uses ChatGPT to help with the normalization process.

You can run these scripts with npm run <script-name>. For example, to run the scrapper script, you would use:

```
npm run scrapper
```

To normalize the data, you would first run the `chatgpt-auth` script and then the `normalize` script:

```
npm run chatgpt-auth
npm run normalize
```

## Contributing

If you find a bug or have a suggestion, please open an issue on the GitHub repository.

## License

This project is licensed under the MIT license.
