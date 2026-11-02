// Step definitions translate readable Gherkin steps into reusable page-object calls.
import { Given, Then, When } from "@cucumber/cucumber";
import { config } from "../config/config";
import type { CustomWorld } from "../hooks/hooks";

Given("I navigate to the login page", async function (this: CustomWorld) {
  await this.loginPageObject.navigateToLoginPage();
});

When(
  "I enter valid username and password",
  async function (this: CustomWorld) {
    await this.loginPageObject.enterUsername(config.username);
    await this.loginPageObject.enterPassword(config.password);
  },
);

When(
  "I enter invalid username and password",
  async function (this: CustomWorld) {
    await this.loginPageObject.enterUsername(`invalid_${config.username}`);
    await this.loginPageObject.enterPassword(`invalid_${config.password}`);
  },
);

When("I click the login button", async function (this: CustomWorld) {
  await this.loginPageObject.clickLogin();
});

Then(
  "I should be successfully logged in",
  async function (this: CustomWorld) {
    await this.loginPageObject.verifySuccessfulLogin();
  },
);

Then(
  "I should see a login error message",
  async function (this: CustomWorld) {
    await this.loginPageObject.verifyLoginError();
  },
);
