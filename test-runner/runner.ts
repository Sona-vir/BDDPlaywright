// Cucumber remains the BDD runner; this launcher invokes its CLI with the project config.
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

async function run(): Promise<void> {
  const projectRoot = resolve(__dirname, "..");
  await mkdir(resolve(projectRoot, "reports"), { recursive: true });

  const cucumberCli = resolve(
    projectRoot,
    "node_modules",
    "@cucumber",
    "cucumber",
    "bin",
    "cucumber.js",
  );
  const child = spawn(
    process.execPath,
    [cucumberCli, ...process.argv.slice(2)],
    {
      cwd: projectRoot,
      stdio: "inherit",
    },
  );

  child.on("error", (error) => {
    console.error("Could not start the Cucumber CLI:", error);
    process.exitCode = 1;
  });
  child.on("exit", (code, signal) => {
    if (signal) {
      console.error(`Cucumber stopped after receiving ${signal}.`);
    }
    process.exitCode = code ?? 1;
  });
}

void run().catch((error: unknown) => {
  console.error("The BDD runner could not start:", error);
  process.exitCode = 1;
});
