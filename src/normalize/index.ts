import { Dataset } from "crawlee";
import { ScrapperRawData, databases } from "../databases/data.ts";
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
    const recipeId = getUniqueName(item);
    const filePath = getNormalizedFilePath(database, recipeId);
    if (fs.existsSync(filePath)) {
      continue;
    }

    const recipe = await recipeFreeNormalizer(api, item.body);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(recipe, null, 2));
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

function getUniqueName(data: ScrapperRawData) {
  const url = new URL(data.url);
  const name = url.pathname
    .replaceAll("/", "-")
    .replace("-", "")
    .replace(".html", "");
  return name;
}

main();
