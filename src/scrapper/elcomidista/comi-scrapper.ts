// Facts about "elcomidista"
// The main URL to extract recipes is https://elpais.com/gastronomia/recetas/{page}
// Max number of pages at 07/01/2024 is 118 with 27 results per page
// Some links are weekly menus, with multiple recipes inside (might be duplicates)

import { CheerioCrawlingContext, Dataset } from "crawlee";
import { databases } from "../../databases/data.ts";

// This only matches search page links
const recipeSearchRegex =
  /^https:\/\/elpais\.com\/gastronomia\/recetas\/(\d+)\/?$/;

// This selector seems semantic enough (as of 07/01/2024), I doubt it will change
const recipeLinkSelector = "main article header h2 a";

// Dataset

export async function comiScrapper(context: CheerioCrawlingContext) {
  const { request } = context;
  const isSearchPage = recipeSearchRegex.test(request.url);

  if (isSearchPage) {
    await scrapeRecipeSearchPage(context);
  } else {
    await scrapeRecipe(context);
  }
}

async function scrapeRecipeSearchPage({
  $,
  enqueueLinks,
}: CheerioCrawlingContext) {
  // Get all links from the page
  // Filter out the ones that are not recipes
  // For each recipe link, enqueue it
  // For each search page link, enqueue it to scrape more recipes

  const recipeLinks = $(recipeLinkSelector)
    .map((i, link) => $(link).attr("href"))
    .get();

  if (recipeLinks.length === 0) {
    return;
  }

  await enqueueLinks({
    urls: recipeLinks,
    label: "DETAIL",
  });

  const nextLink = $('a:contains("Siguiente")');
  const nextLinkUrl = nextLink.attr("href");
  if (!nextLinkUrl) {
    return;
  }

  await enqueueLinks({
    urls: [nextLinkUrl],
    label: "NAVIGATION",
  });
}

async function scrapeRecipe({ request, $ }: CheerioCrawlingContext) {
  const articleBody = $('[data-dtm-region="articulo_cuerpo"]');
  const articleHTML = articleBody.html();
  const dataset = await Dataset.open(databases.elComidista);
  await dataset.pushData({
    url: request.url,
    body: articleHTML,
  });
}
