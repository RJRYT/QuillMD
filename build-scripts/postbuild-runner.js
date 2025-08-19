import { spawn } from "child_process";
import path from "path";

const PROJECT_ROOT = process.cwd();

/**
 * List scripts (relative to project root) that should run after the build.
 * Order is respected (sequential).
 */
const scripts = [
  "build-scripts/generate-rss.js",
  "build-scripts/generate-sitemap.js",
];

/**
 * Run a Node script as a child process and inherit stdio.
 * Resolves on exit code 0, rejects otherwise.
 */
function runScript(scriptRelativePath) {
  return new Promise((resolve, reject) => {
    const scriptAbs = path.resolve(PROJECT_ROOT, scriptRelativePath);
    console.log(`\n→ Running: node ${scriptAbs}`);

    const child = spawn(process.execPath, [scriptAbs], {
      stdio: "inherit",
      env: process.env,
      windowsHide: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`✓ ${scriptRelativePath} finished`);
        resolve();
      } else {
        reject(new Error(`${scriptRelativePath} exited with code ${code}`));
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

async function main() {
  try {
    for (const s of scripts) {
      await runScript(s);
    }
    console.log("\nAll post-build scripts completed successfully.");
    // explicit success exit (optional)
    process.exit(0);
  } catch (err) {
    console.error("\nPost-build scripts failed:", err);
    process.exit(1);
  }
}

main();
