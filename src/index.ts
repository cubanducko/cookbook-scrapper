import { PlaywrightCrawler } from "crawlee";
import { chromium } from "playwright-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

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
    maxRequestsPerCrawl: 50,

    async requestHandler({ request, enqueueLinks, log }) {
      log.info(request.url);
      // Add all links from page to RequestQueue
      await enqueueLinks();
    },
  });

  // Run the crawler with initial request
  await crawler.run(["https://crawlee.dev"]);
}

main();
