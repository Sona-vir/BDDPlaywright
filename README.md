# Playwright BDD Framework

A beginner-friendly BDD automation framework using Playwright as the browser
automation library and Cucumber as the test runner. It does not use the
Playwright Test runner.

## A. Project architecture

```text
features/                 Gherkin feature files and tagged scenarios
step-definitions/         Cucumber steps that call the page objects
pages/                    Page Object Model classes and UI interactions
hooks/                    Per-scenario browser lifecycle and failure evidence
config/                   Environment-specific settings and configuration loader
test-runner/              Cucumber CLI launcher with report setup
utils/                    Place for future shared helpers
reports/                  Generated Cucumber HTML report
screenshots/              Screenshots captured when scenarios fail
cucumber.js               Cucumber support-code and formatter configuration
playwright.config.ts      Browser/runtime settings consumed by the hooks
tsconfig.json             TypeScript and ts-node compiler settings
package.json              Dependencies and convenient npm scripts
```

## B. Install dependencies

Install Node.js (18 or later) and npm, then run:

```sh
npm install
```

## C. Install Playwright browsers

The default browser is Chromium:

```sh
npx playwright install chromium
```

To install all supported browsers:

```sh
npx playwright install
```

## D. Configure environments

`TEST_ENV` selects `config/.env.qa` (the default) or `config/.env.uat`.
Each environment file provides `BASE_URL`, `USERNAME`, and `PASSWORD`, with
optional `BROWSER`, `HEADLESS`, and `TIMEOUT` values. Edit those files or set
the variables in the process environment. Process variables take precedence
over dotenv values.

Example:

```dotenv
BASE_URL=https://www.saucedemo.com/
USERNAME=standard_user
PASSWORD=secret_sauce
BROWSER=chromium
HEADLESS=true
TIMEOUT=30000
```

Choose an environment in PowerShell:

```powershell
$env:TEST_ENV = "uat"
npm run test:bdd
```

Supported `BROWSER` values are `chromium`, `firefox`, and `webkit`.

## E. Run all BDD tests

```sh
npm run test:bdd
```

All feature files under `features/` are discovered by `cucumber.js`.

## F. Run a specific feature

```sh
npm run test:bdd -- features/login.feature
```

## G. Run a scenario or tag

These are Cucumber/Gherkin scenarios, so use the Cucumber runner for `@smoke`
and `@regression` tags. `npx playwright test --grep "@smoke"` runs Playwright
Test specs and does not discover this project's `.feature` files.

Run the smoke scenario:

```sh
npm run test:bdd -- --tags "@smoke"
```

Run the regression scenario:

```sh
npm run test:bdd -- --tags "@regression"
```

Run a scenario by its name:

```sh
npm run test:bdd -- --name "Successful login with valid credentials"
```

Alternatively, Cucumber can be called directly:

```sh
npx cucumber-js --tags "@smoke"
```

## H. Run in headed mode

```sh
npm run test:bdd:headed
```

This sets `HEADLESS=false` for the process. To use the report launcher in
headed mode, set `HEADLESS=false` in the selected environment file and run
`npm run test:bdd:html`.

## I. Generate the HTML report

Every Cucumber run writes `reports/cucumber-report.html`. To launch the run
through the TypeScript runner (and create the reports directory if needed):

```sh
npm run test:bdd:html
```

The report includes the feature, scenario, step results and durations, failure
messages, and attached screenshots for failed scenarios.

## J. Failure screenshots

The Cucumber `After` hook checks the scenario result. When a scenario fails,
it saves a full-page PNG under `screenshots/` and attaches the image to the
Cucumber report. The hook then closes the page, context, and browser whether
the scenario passed or failed.

## K. End-to-end execution flow

1. A feature file declares scenarios and tags using Gherkin.
2. Cucumber discovers each feature and executes its steps.
3. Step definitions match each Gherkin step and call the page object.
4. The page object uses Playwright `Page` locators to interact with SauceDemo.
5. Cucumber hooks launch a Playwright browser, create an isolated
   `BrowserContext`, and create a `Page` for each scenario.
6. Playwright drives the browser, which interacts with the application.
7. Cucumber records step results, durations, failures, and screenshot
   attachments in the HTML report.

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```

The feature file uses Gherkin (`Given`, `When`, `Then`) to describe behavior.
Step definitions bind those steps to TypeScript. The Page Object Model
centralizes selectors and UI actions. Hooks control browser setup, teardown,
and failure screenshots. The runner invokes Cucumber, not Playwright Test.
