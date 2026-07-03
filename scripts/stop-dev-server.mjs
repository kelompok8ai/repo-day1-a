#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const lockPath = path.join(process.cwd(), ".next", "dev", "lock");

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function killPid(pid) {
  if (!pid || Number.isNaN(pid)) return;
  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // already gone
  }
}

let stopped = 0;

if (fs.existsSync(lockPath)) {
  try {
    const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    killPid(Number(lock.pid));
    stopped += 1;
    console.log(`Stopped dev server (PID ${lock.pid}, port ${lock.port ?? "?"})`);
  } catch {
    // ignore malformed lock
  }
  fs.rmSync(lockPath, { force: true });
}

const pids = new Set(
  run("pgrep -f 'next dev|next-server \\(v'")
    .split("\n")
    .map((v) => Number(v.trim()))
    .filter(Boolean)
);

for (const pid of pids) {
  killPid(pid);
  stopped += 1;
  console.log(`Stopped process PID ${pid}`);
}

if (stopped === 0) {
  console.log("No running Next.js dev server found.");
} else {
  console.log(`Done. Run "npm run dev" to start fresh on port 3000.`);
}
