import { Dataset } from "crawlee";
import { DatabaseItem, databases } from "../databases/data.ts";
import { recipeFreeNormalizer } from "./recipe-normalizer.ts";
import { FreeChatGPTAssistant } from "./chatgpt/free-chatgpt-assistant.ts";

async function main() {
  const content = await getDatabaseContent();
  const api = new FreeChatGPTAssistant();

  for (const item of content) {
    const result = await recipeFreeNormalizer(api, item.body);
    console.log(result);
  }
}

async function getDatabaseContent() {
  const dataset: Dataset<DatabaseItem> = await Dataset.open(
    databases.elComidista
  );
  const content = await dataset.getData();
  return content.items;
}

main();
