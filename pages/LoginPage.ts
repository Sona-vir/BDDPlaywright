// The Page Object Model keeps selectors and UI behavior out of step definitions.
import assert from "node:assert/strict";
import type { Page } from "playwright";
import { config } from "../config/config";

export class LoginPage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly loginButton;
  private readonly errorMessage;
  private readonly productsHeading;

  constructor(private readonly page: Page) {
    // Playwright's Page represents one tab and provides locator and navigation APIs.
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.errorMessage = page.locator('[data-test="error"]');
    this.productsHeading = page.locator(".title");
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(config.baseUrl);
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.page.waitForURL("**/inventory.html");
    await this.productsHeading.waitFor({ state: "visible" });
    assert.equal(
      await this.productsHeading.innerText(),
      "Products",
      "The inventory page should show the Products heading.",
    );
  }

  async verifyLoginError(): Promise<void> {
    assert.equal(
      await this.errorMessage.isVisible(),
      true,
      "An error message should be visible after an invalid login.",
    );
    assert.match(
      (await this.errorMessage.innerText()).toLowerCase(),
      /username and password do not match/,
      "The error message should explain that the credentials are invalid.",
    );
  }
}
