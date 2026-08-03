import path from "node:path";
import { fileURLToPath } from "node:url";
import { createReadStream, existsSync } from "node:fs";
import { getTerminalHomepage, isTerminalRequest } from "../shared/terminal-output.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist", "public");

export default async function handler(req, res) {
  const userAgent = String(req.headers["user-agent"] || "");

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  if (req.url && req.url.split("?")[0] === "/" && isTerminalRequest(userAgent)) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(getTerminalHomepage());
    return;
  }

  const assetPath = req.url && req.url !== "/" ? req.url.split("?")[0] : "/index.html";
  const safePath = path.normalize(assetPath).replace(/^\/+/, "");
  const fullPath = path.join(distDir, safePath);

  if (safePath && existsSync(fullPath) && !fullPath.endsWith(path.sep)) {
    res.statusCode = 200;
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    createReadStream(fullPath).pipe(res);
    return;
  }

  if (existsSync(path.join(distDir, "index.html"))) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    createReadStream(path.join(distDir, "index.html")).pipe(res);
    return;
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("Not found");
}
