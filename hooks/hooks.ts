// Cucumber hooks manage one browser lifecycle per scenario and preserve failure evidence.
import {
  After,
  Before,
  Status,
  World,
  setDefaultTimeout,
  setWorldConstructor,
} from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "playwright";
import { chromium, firefox, webkit } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { playwrightConfig } from "../playwright.config";
import { LoginPage } from "../pages/LoginPage";

const browserTypes = { chromium, firefox, webkit };

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  loginPage?: LoginPage;

  get loginPageObject(): LoginPage {
    if (!this.loginPage) {
      throw new Error("The scenario's LoginPage has not been initialized.");
    }

    return this.loginPage;
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(playwrightConfig.timeout);

Before(async function (this: CustomWorld) {
  // A Browser is the launched engine; BrowserContext isolates scenario state.
  this.browser = await browserTypes[playwrightConfig.browser].launch({
    headless: playwrightConfig.headless,
  });
  this.context = await this.browser.newContext({
    baseURL: playwrightConfig.baseUrl,
  });
  this.page = await this.context.newPage();
  this.loginPage = new LoginPage(this.page);
});

After(async function (this: CustomWorld, scenario) {
  try {
    if (scenario.result?.status === Status.FAILED && this.page) {
      const screenshotsDirectory = resolve(process.cwd(), "screenshots");
      await mkdir(screenshotsDirectory, { recursive: true });
      const safeScenarioName = scenario.pickle.name
        .replace(/[^a-zA-Z0-9-_]+/g, "_")
        .replace(/^_+|_+$/g, "");
      const screenshotPath = resolve(
        screenshotsDirectory,
        `${safeScenarioName}_${Date.now()}.png`,
      );
      const screenshot = await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });
      // Cucumber's HTML formatter embeds this attachment in the report.
      this.attach(screenshot, "image/png");
    }
  } finally {
    try {
      await this.page?.close();
    } finally {
      try {
        await this.context?.close();
      } finally {
        await this.browser?.close();
      }
    }
  }
});
