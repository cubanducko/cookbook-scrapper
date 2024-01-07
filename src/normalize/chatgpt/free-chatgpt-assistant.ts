import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { getRealChromium } from "../../common/real-browser.ts";
import { Page } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultAuthPath = path.join(__dirname, "../../../auth/storage.json");
const chatGPTUrl = "https://chat.openai.com";

export class FreeChatGPTAssistant {
  private authContext: any;

  constructor(authPath = defaultAuthPath) {
    const authPathExists = fs.existsSync(authPath);
    if (!authPathExists) {
      throw new Error(
        `Auth context is not provided, please execute "npm run chatgpt-auth" and log in`
      );
    }
    this.authContext = JSON.parse(
      fs.readFileSync(authPath, { encoding: "utf-8" })
    );
  }

  async sendMessage(prompt: string, url = chatGPTUrl) {
    const page = await this.getChatGPTPage(url);

    await this.fillPromptInput(page, prompt);
    const html = await this.getLastMessageHTML(page);

    await page.close();

    return html;
  }

  private async getChatGPTPage(url: string) {
    const chromium = getRealChromium();
    const browser = await chromium.launch({
      headless: false,
    });
    const context = await browser.newContext({
      storageState: this.authContext,
    });
    const page = await context.newPage();
    await page.goto(url);
    await page.waitForSelector("id=prompt-textarea");
    return page;
  }

  private async fillPromptInput(page: Page, prompt: string) {
    const promptInput = page.locator("id=prompt-textarea");
    await promptInput.fill(prompt);

    const sendButton = page.getByTestId("send-button");
    await sendButton.click();

    // Wait for prompt to generate
    // This is super slow, so we extend the timeout to 120s
    await page.waitForTimeout(1000);
    await page.waitForFunction(
      () =>
        document.querySelector<HTMLButtonElement>('[data-testid="send-button"]')
          ?.disabled === true,
      { timeout: 120000 }
    );
  }

  async getLastMessageHTML(page: Page) {
    const messages = await page.$$('[data-message-author-role="assistant"]');
    if (messages.length === 0) {
      throw new Error("No messages found");
    }

    const lastMessage = messages[messages.length - 1];
    const html = await lastMessage.innerHTML();
    return html;
  }
}
