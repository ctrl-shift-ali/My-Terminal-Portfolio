import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { getTerminalHomepage, isTerminalRequest } from "../shared/terminal-output.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const staticPath = path.resolve(__dirname, "..", "dist", "public");

  app.get("/", (req, res, next) => {
    const userAgent = String(req.headers["user-agent"] || "");
    if (isTerminalRequest(userAgent)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.send(getTerminalHomepage());
    }
    next();
  });

  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = Number(process.env.PORT || 3000);
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Please stop the running server or choose a different port.`);
      process.exit(1);
    } else {
      console.error(error);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer().catch(console.error);
