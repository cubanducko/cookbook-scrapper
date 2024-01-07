import { Recipe } from "../databases/data.ts";
import { FreeChatGPTAssistant } from "./chatgpt/free-chatgpt-assistant.ts";
import { normalizerPrompt } from "./chatgpt/prompt.ts";
import { load } from "cheerio";

// Since we are using the free version of ChatGPT, this is a bit flaky
// Bot protection can be tricky, responses can be inconsistent
// It's free, so we can't complain ¯\_(ツ)_/¯
export async function recipeFreeNormalizer(
  api: FreeChatGPTAssistant,
  html: string
): Promise<Recipe[]> {
  const cleanedHTML = cleanupHTML(html);
  const response = await api.sendMessage(
    normalizerPrompt.replace("{{html}}", cleanedHTML)
  );

  return getJSONFromResponse(response);
}

function cleanupHTML(html: string) {
  const $ = load(html);

  // Remove class attribute from all elements
  $("[class]").removeAttr("class");

  // Remove href attribute from all elements
  $("[href]").removeAttr("href");

  // Remove comments from the HTML
  $("*")
    .contents()
    .filter(function () {
      return this.nodeType === 8;
    })
    .remove();

  return $.html();
}

function getJSONFromResponse(htmlResponse: string) {
  const $ = load(htmlResponse);
  const code = $("code").text();
  if (!code) {
    // Try to parse the whole HTML if no code snippet is available
    return JSON.parse(htmlResponse);
  } else {
    return JSON.parse(code);
  }
}
