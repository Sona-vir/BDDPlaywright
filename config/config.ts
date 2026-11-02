// dotenv loads the selected environment before any scenario reads its settings.
import dotenv from "dotenv";
import { userInfo } from "node:os";
import { resolve } from "node:path";

export type BrowserName = "chromium" | "firefox" | "webkit";

const testEnvironment = process.env.TEST_ENV ?? "qa";
if (!["qa", "uat"].includes(testEnvironment)) {
  throw new Error(
    `Unsupported TEST_ENV "${testEnvironment}". Choose "qa" or "uat".`,
  );
}

const environmentPath = resolve(__dirname, `.env.${testEnvironment}`);
const environmentResult = dotenv.config({ path: environmentPath });
if (environmentResult.error) {
  throw new Error(
    `Unable to load ${environmentPath}: ${environmentResult.error.message}`,
  );
}

function requiredEnvironmentValue(name: string): string {
  // Windows reserves USERNAME for the logged-in account, which can shadow .env credentials.
  const isWindowsAccountName =
    name === "USERNAME" &&
    process.platform === "win32" &&
    process.env.USERNAME?.trim().toLowerCase() ===
      userInfo().username.toLowerCase();
  const value = (
    isWindowsAccountName
      ? environmentResult.parsed?.[name] ?? process.env[name]
      : process.env[name] ?? environmentResult.parsed?.[name]
  )?.trim();
  if (!value) {
    throw new Error(
      `Missing ${name}. Set it in ${environmentPath} or in the process environment.`,
    );
  }
  return value;
}

function readBoolean(name: string, defaultValue: boolean): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  if (value === undefined || value === "") return defaultValue;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${name} must be "true" or "false", received "${value}".`);
}

function readBrowserName(): BrowserName {
  const value = (process.env.BROWSER ?? "chromium").trim().toLowerCase();
  if (value === "chromium" || value === "firefox" || value === "webkit") {
    return value;
  }
  throw new Error(
    `Unsupported BROWSER "${value}". Choose chromium, firefox, or webkit.`,
  );
}

const timeout = Number(process.env.TIMEOUT ?? "30000");
if (!Number.isInteger(timeout) || timeout <= 0) {
  throw new Error(`TIMEOUT must be a positive integer, received "${timeout}".`);
}

export const config = Object.freeze({
  testEnvironment,
  baseUrl: requiredEnvironmentValue("BASE_URL"),
  username: requiredEnvironmentValue("USERNAME"),
  password: requiredEnvironmentValue("PASSWORD"),
  browser: readBrowserName(),
  headless: readBoolean("HEADLESS", true),
  timeout,
});
