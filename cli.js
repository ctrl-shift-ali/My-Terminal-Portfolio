#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;

function getPackageManagerCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function spawnCommand(command, args, options = {}) {
  const useShell = process.platform === "win32" && /\.(cmd|bat)$/i.test(command);

  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: "inherit",
      cwd: rootDir,
      shell: useShell,
      ...options,
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed: ${command} ${args.join(" ")} (code ${code})`));
      }
    });

    proc.on("error", reject);
  });
}

function printHelp() {
  console.log("Usage: node cli.js <command> [options]\n");
  console.log("Commands:");
  console.log("  dev       Start the Vite development server");
  console.log("  build     Build the frontend and bundle the server");
  console.log("  start     Rebuild and run the production server");
  console.log("  preview   Preview the production build");
  console.log("  terminal  Print the terminal-style homepage to the shell");
  console.log("  help      Show this help message\n");
  console.log("Options:");
  console.log("  --port <number>   Use a specific port for dev/start\n");
  console.log("Examples:");
  console.log("  node cli.js dev");
  console.log("  node cli.js dev --port 3001");
  console.log("  node cli.js build");
  console.log("  node cli.js start");
  console.log("  node cli.js start --port 3001");
  console.log("  curl ");
}

function printTerminalOutput() {
  const portraitArt = readFileSync(path.join(rootDir, "src", "assets", "terminal-ascii-me.txt"), "utf8").trimEnd();
  const now = new Date();
  const formatted = now.toDateString().replace(/^(\w+) (\w+) (\d+) (\d+)$/, (_m, wd, mo, d, y) => {
    const day = d.padStart(2, " ");
    return `${wd} ${mo} ${day} ${y}`;
  });
  const time = now.toTimeString().slice(0, 8);
  console.log(portraitArt);
}

function parsePort(args) {
  const portFlagIndex = args.findIndex((arg) => arg === "--port" || arg === "-p");
  if (portFlagIndex !== -1 && args.length > portFlagIndex + 1) {
    const port = parseInt(args[portFlagIndex + 1], 10);
    if (!Number.isNaN(port) && port > 0 && port < 65536) {
      return port;
    }
  }

  const numericArg = args.find((arg) => /^\d+$/.test(arg));
  if (numericArg) {
    const port = parseInt(numericArg, 10);
    if (!Number.isNaN(port) && port > 0 && port < 65536) {
      return port;
    }
  }

  return undefined;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] ? args[0].toLowerCase() : "dev";
  const commandArgs = args.slice(1);
  const port = parsePort(commandArgs);

  try {
    switch (command) {
      case "dev": {
        const packageManager = getPackageManagerCommand();
        const env = { ...process.env };
        if (port) env.PORT = String(port);
        await spawnCommand(packageManager, ["run", "dev"], { env });
        break;
      }
      case "build": {
        const packageManager = getPackageManagerCommand();
        await spawnCommand(packageManager, ["run", "build"]);
        break;
      }
      case "start": {
        await spawnCommand(getPackageManagerCommand(), ["run", "build"]);
        const nodeCmd = process.execPath;
        const env = { ...process.env, NODE_ENV: "production" };
        if (port) env.PORT = String(port);
        await spawnCommand(nodeCmd, ["dist/index.js"], { env });
        break;
      }
      case "preview": {
        const packageManager = getPackageManagerCommand();
        const env = { ...process.env };
        if (port) env.PORT = String(port);
        await spawnCommand(packageManager, ["run", "preview"], { env });
        break;
      }
      case "terminal":
      case "print": {
        printTerminalOutput();
        break;
      }
      case "help":
      case "--help":
      case "-h": {
        printHelp();
        break;
      }
      default: {
        console.error(`Unknown command: ${command}`);
        printHelp();
        process.exit(1);
      }
    }
  } catch (error) {
    console.error(error.message || error);
    process.exit(1);
  }
}

main();
