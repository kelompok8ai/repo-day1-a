import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import fs from "fs";
import path from "path";
import * as schema from "./schema";
import { seedDatabase } from "./seed";
import { repairDatabaseSchema } from "./repair";

const globalForDb = globalThis as unknown as {
  sqlite?: Database.Database;
  seeded?: boolean;
};

function getDbPath() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, "corpsec.db");
}

function createSqlite() {
  const dbPath = getDbPath();
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return sqlite;
}

export function getDb() {
  if (!globalForDb.sqlite) {
    globalForDb.sqlite = createSqlite();
    const db = drizzle(globalForDb.sqlite, { schema });
    migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    repairDatabaseSchema(globalForDb.sqlite);

    if (!globalForDb.seeded) {
      seedDatabase(db);
      globalForDb.seeded = true;
    }
  }

  return drizzle(globalForDb.sqlite, { schema });
}
