import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import  fs from "fs";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function startServer() {
  const app = express();
  const server = createServer(app);
  const staticPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname, "public") : path.resolve(__dirname, "..", "dist", "public");
  
  app.get("/", (_req, res, next) => {
    const userAgent = String(_req.headers["user-agent"] || "").toLowerCase();
    if (userAgent.includes("curl")) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      try {
        const titleArt = fs.readFileSync(path.resolve(__dirname, "..", "src", "assets", "terminal-ascii-title.txt"), "utf8");
        const meArt = fs.readFileSync(path.resolve(__dirname, "..", "src", "assets", "terminal-ascii-me.txt"), "utf8");
        return res.send(
          `Welcome to the terminal homepage of maliabeer.dev!\n` +
            `guest@Linux ~ % ssh ssh.maliabeer.dev\n\n` +
            `\x1b[32m${titleArt}\x1b[0m\n\n` +
            `is a builder & creator working at the intersection of technology, design, and human expression.\n` +
            `Currently shipping small tools and writing about what's learned along the way, also working on a few side projects, like website development, Object Oriented Programming (OOPs), and open source contributions.\n` +
            `Previously studied computer science, with a soft spot for HCI, generative systems, and terminals that look nicer than they need to.\n` +
            `Diving into the world of web development, AI, Machine and Deep Learning. I craft innovative solutions that blend creativity with technology. My journey is fueled by a passion for learning and a commitment to excellence in every project I undertake.\n\n` +
            `${meArt}\n`
        );
      } catch (e) {
        return res.send("Welcome to my terminal site!\n");
      }
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
    console.log(`Server running on http:
  });
}
startServer().catch(console.error);
