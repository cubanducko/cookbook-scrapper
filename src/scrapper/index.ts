import { CheerioCrawler } from "crawlee";
import { comiScrapper } from "./elcomidista/comi-scrapper.ts";

const recipeSiteMap = {
  elComidista: "https://elpais.com/gastronomia/recetas/1",
};

async function main() {
  const crawler = new CheerioCrawler({
    // Stop crawling after several pages
    // maxRequestsPerCrawl: 10,

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
