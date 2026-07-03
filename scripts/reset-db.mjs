#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
for (const file of ["corpsec.db", "corpsec.db-wal", "corpsec.db-shm"]) {
  const p = path.join(dataDir, file);
  if (fs.existsSync(p)) {
    fs.rmSync(p);
    console.log(`Removed ${p}`);
  }
}
console.log("Database files deleted. Run npm run dev to recreate with fresh seed.");
