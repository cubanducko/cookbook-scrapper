// Facts about "elcomidista"
// The main URL to extract recipes is https://elpais.com/gastronomia/recetas/{page}
// Max number of pages at 07/01/2024 is 118 with 27 results per page
// Some links are weekly menus, with multiple recipes inside (might be duplicates)

import { Dataset, PlaywrightCrawlingContext } from "crawlee";

// This only matches search page links
const recipeSearchRegex =
  /^https:\/\/elpais\.com\/gastronomia\/recetas\/(\d+)\/?$/;

// This selector seems semantic enough (as of 07/01/2024), I doubt it will change
const recipeLinkSelector = "main article header h2 a";

export async function comiScrapper(context: PlaywrightCrawlingContext) {
  const { request } = context;
  const isSearchPage = recipeSearchRegex.test(request.url);

  if (isSearchPage) {
    await scrapeRecipeSearchPage(context);
  } else {
    await scrapeRecipe(context);
  }
}

async function scrapeRecipeSearchPage({
  page,
  enqueueLinks,
}: PlaywrightCrawlingContext) {
  // Get all links from the page
  // Filter out the ones that are not recipes
  // For each recipe link, enqueue it
  // For each search page link, enqueue it to scrape more recipes

  const recipeLinks = await page.$$eval(recipeLinkSelector, (links) =>
    links.map((link) => link.getAttribute("href"))
  );

  if (recipeLinks.length === 0) {
    return;
  }

  // Enqueue types seem to be broken
  await enqueueLinks({
    urls: recipeLinks,
    label: "DETAIL",
  } as any);

  const nextLink = page.getByText("Siguiente");
  const nextLinkUrl = await nextLink?.getAttribute("href");
  if (!nextLinkUrl) {
    return;
  }

  // Enqueue types seem to be broken
  await enqueueLinks({
    urls: [nextLinkUrl],
    label: "NAVIGATION",
  } as any);
}

async function scrapeRecipe({ request, page }: PlaywrightCrawlingContext) {
  const articleBody = await page.$('[data-dtm-region="articulo_cuerpo"]');
  const articleHTML = await articleBody.innerHTML();
  await Dataset.pushData({
    url: request.url,
    body: articleHTML,
  });
}
