import { PlaywrightCrawler } from "crawlee";
import { chromium } from "playwright-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { comiScrapper } from "./elcomidista-scrapper/comi-scrapper";

const recipeSiteMap = {
  elComidista: "https://elpais.com/gastronomia/recetas/1",
};

chromium.use(stealthPlugin());

async function main() {
  const crawler = new PlaywrightCrawler({
    launchContext: {
      launcher: chromium,
      launchOptions: {
        headless: false,
      },
    },

    // Stop crawling after several pages
    maxRequestsPerCrawl: 10,

    async requestHandler(requestContext) {
      const domain = getDomain(requestContext.request.url);

      switch (domain) {
        case getDomain(recipeSiteMap.elComidista):
          await comiScrapper(requestContext);
          break;
      }
    },
  });

  // Run the crawler with initial request
  await crawler.run([recipeSiteMap.elComidista]);
}

function getDomain(url: string) {
  const { hostname } = new URL(url);
  return hostname;
}

main();
