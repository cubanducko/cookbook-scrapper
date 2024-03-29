import { Dataset } from "crawlee";
import { Recipe, ScrapperRawData, databases } from "../databases/data.ts";
import { recipeFreeNormalizer } from "./recipe-normalizer.ts";
import { FreeChatGPTAssistant } from "./chatgpt/free-chatgpt-assistant.ts";
import fs from "fs";
import path from "path";
import { getDirname } from "../common/paths.ts";

async function main() {
  parseDatabaseContent(databases.elComidista);
}

async function parseDatabaseContent(database: string) {
  const content = await getDatabaseContent(database);
  const api = new FreeChatGPTAssistant();

  for (const item of content) {
    const rootRecipeId = getUniqueName(item);
    const rootFilePath = getNormalizedFilePath(database, rootRecipeId);
    const dir = path.dirname(rootFilePath);

    if (fs.existsSync(rootFilePath)) {
      continue;
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      const recipes = await recipeFreeNormalizer(api, item.body);
      recipes.forEach((recipe, index) => {
        const filePath = getNormalizedFilePath(
          database,
          getUniqueName(item, index)
        );
        fs.writeFileSync(filePath, JSON.stringify(recipe, null, 2));
      });
    } catch (e) {
      console.log(`Error normalizing ${rootRecipeId}`);
      continue;
    }
  }
}

function getNormalizedFilePath(database: string, filename: string) {
  return path.join(getDirname(), `../../data/${database}/${filename}.json`);
}

async function getDatabaseContent(database: string) {
  const dataset: Dataset<ScrapperRawData> = await Dataset.open(database);
  const content = await dataset.getData();
  return content.items;
}

function getUniqueName(data: ScrapperRawData, index?: number) {
  const url = new URL(data.url);
  const name = url.pathname
    .replaceAll("/", "-")
    .replace("-", "")
    .replace(".html", "");

  return !index ? name : `${name}-${index}`;
}

main();
