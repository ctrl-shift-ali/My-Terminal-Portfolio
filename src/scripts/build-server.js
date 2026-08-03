

import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

mkdirSync(path.join(rootDir, "dist"), { recursive: true });
copyFileSync(
  path.join(rootDir, "server", "index.js"),
  path.join(rootDir, "dist", "index.js")
);

console.log("Server bundled to dist/index.js");
