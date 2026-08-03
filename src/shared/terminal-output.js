import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function readAsset(fileNames) {
  const candidates = Array.isArray(fileNames) ? fileNames : [fileNames];
  for (const fileName of candidates) {
    const fullPath = path.join(rootDir, "src", "assets", fileName);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, "utf8").trimEnd();
    }
  }

  return "";
}

export function getTerminalHomepage() {
  const titleArt = readAsset(["terminal-ascii-title.txt", "ascii-art-title.txt"]);
  const meArt = readAsset(["terminal-ascii-me.txt", "ascii-art-me.txt"]);

  return [
    "Welcome to the terminal homepage of maliabeer.dev!",
    "guest@Linux ~ % ssh ssh.maliabeer.dev",
    "",
    `\x1b[32m${titleArt}\x1b[0m`,
    "",
    "is a builder & creator working at the intersection of technology, design, and human expression.",
    "Currently shipping small tools and writing about what's learned along the way, also working on a few side projects, like website development, Object Oriented Programming (OOPs), and open source contributions.",
    "Previously studied computer science, with a soft spot for HCI, generative systems, and terminals that look nicer than they need to.",
    "Diving into the world of web development, AI, Machine and Deep Learning. I craft innovative solutions that blend creativity with technology. My journey is fueled by a passion for learning and a commitment to excellence in every project I undertake.",
    "",
    meArt,
    "",
  ].join("\n");
}

export function isTerminalRequest(userAgent = "") {
  const agent = String(userAgent).toLowerCase();
  return /(curl|wget|httpie|fetch|lynx|links|elinks|python-requests|terminal)/i.test(agent);
}
