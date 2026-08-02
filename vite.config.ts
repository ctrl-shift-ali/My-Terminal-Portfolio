import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    {
      name: "terminal-homepage-curl",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method !== "GET") {
            return next();
          }

          const url = req.url?.split("?")[0] || "";
          const userAgent = String(req.headers["user-agent"] || "").toLowerCase();

          if (url === "/" && userAgent.includes("curl")) {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            try {
              const meArt = fs.readFileSync(path.resolve(__dirname, "src", "assets", "terminal-ascii-me.txt"), "utf8");
              return res.end(
                `Welcome to the terminal homepage of maliabeer.dev!\n` +
                `${meArt}\n`
              );
            } catch (error) {
              return res.end("An error occurred! Check your Internet connection.\n");
            }
          }

          next();
        });
      },
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  server: {
    port: Number(process.env.PORT) || 3000,
    host: true,
  },
  preview: {
    port: Number(process.env.PORT) || 3000,
    host: true,
  },
  build: {
    // Server (server/index.js) serves this folder as static assets in production.
    outDir: "dist/public",
    emptyOutDir: true,
  },
});
