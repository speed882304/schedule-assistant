const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const appDir = path.join(__dirname, "..");
const apiDir = path.join(appDir, "app", "api");
const bakDir = path.join(appDir, "app", "_api_bak");

const workerUrl = process.env.WORKER_URL || "";

if (workerUrl) {
  process.env.NEXT_PUBLIC_CHAT_API_URL = workerUrl;
  console.log(`Worker URL: ${workerUrl}`);
} else {
  console.log("No WORKER_URL set - chat will try /api/chat (won't work in production)");
}

// Move API routes out of the way
if (fs.existsSync(apiDir)) {
  fs.cpSync(apiDir, bakDir, { recursive: true });
  fs.rmSync(apiDir, { recursive: true, force: true });
  console.log("Moved app/api/ → app/_api_bak/");
}

try {
  execSync("npx next build", { stdio: "inherit", cwd: appDir });
  console.log("\nBuild complete! Output → out/");
} finally {
  if (fs.existsSync(bakDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
    const entries = fs.readdirSync(bakDir, { withFileTypes: true });
    for (const entry of entries) {
      fs.cpSync(
        path.join(bakDir, entry.name),
        path.join(apiDir, entry.name),
        { recursive: true }
      );
    }
    fs.rmSync(bakDir, { recursive: true, force: true });
    console.log("Restored app/api/");
  }
}
