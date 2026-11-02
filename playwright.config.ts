// Shared Playwright runtime settings for Cucumber hooks.
// The default export must remain mutable because Playwright Test augments config objects.
import { config } from "./config/config";

export const playwrightConfig = {
  baseUrl: config.baseUrl,
  browser: config.browser,
  headless: config.headless,
  timeout: config.timeout,
};

export default playwrightConfig;
