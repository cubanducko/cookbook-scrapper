import fs from "fs";
import path from "path";
import { getDirname } from "../common/paths.ts";
import { getRealChromium } from "../common/real-browser.ts";

// This is ultra-hacky
// Basically open a chromium browser, init session on chatgpt manually and save the storage state
// This can be made automatic in the future, but for now, it works
async function recordAuth() {
  const chromium = getRealChromium();
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the login page
  await page.goto("https://chat.openai.com/auth/login");
  await page.getByText("Log in").click();

  // Wait until the document title is "ChatGPT" and where are not in the logIn page
  // You have only 60s to log in, so be quick 🏃‍♂️
  await page.waitForSelector("id=prompt-textarea", { timeout: 60 * 1000 });

  // Save the storage state
  const authTokens = await context.storageState();

  // Save storage to file
  const __dirname = getDirname();
  const filePath = path.join(__dirname, "../../auth/storage.json");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(authTokens));

  await browser.close();
}

recordAuth();
