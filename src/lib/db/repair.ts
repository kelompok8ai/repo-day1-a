import type Database from "better-sqlite3";

function columnNames(sqlite: Database.Database, table: string): Set<string> {
  const rows = sqlite.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  return new Set(rows.map((r) => r.name));
}

function addColumnIfMissing(
  sqlite: Database.Database,
  table: string,
  column: string,
  definition: string
) {
  if (!columnNames(sqlite, table).has(column)) {
    sqlite.exec(`ALTER TABLE ${table} ADD ${column} ${definition}`);
  }
}

/** Repair databases where migrations were partially applied (e.g. missing 0002). */
export function repairDatabaseSchema(sqlite: Database.Database) {
  addColumnIfMissing(sqlite, "users", "username", "text");
  addColumnIfMissing(sqlite, "users", "password", "text");
  addColumnIfMissing(sqlite, "users", "divisi", "text");
  addColumnIfMissing(sqlite, "users", "board_position", "text");

  addColumnIfMissing(sqlite, "memorandum", "memo_date", "text");
  addColumnIfMissing(sqlite, "memorandum", "submitted_by_user_id", "integer REFERENCES users(id)");
  addColumnIfMissing(sqlite, "memorandum", "pimpinan_decision", "text");
  addColumnIfMissing(sqlite, "memorandum", "sent_to_sekdireksi_at", "text");
  addColumnIfMissing(sqlite, "memorandum", "received_by_sekdireksi_at", "text");
  addColumnIfMissing(sqlite, "memorandum", "sent_to_sekkom_at", "text");
  addColumnIfMissing(sqlite, "memorandum", "received_by_sekkom_at", "text");
  addColumnIfMissing(sqlite, "memorandum", "route_type", "text");
  addColumnIfMissing(sqlite, "memorandum", "target_member_ids", "text");
  addColumnIfMissing(sqlite, "memorandum", "board_decision", "text");
  addColumnIfMissing(sqlite, "memorandum", "disposition", "text");
  addColumnIfMissing(sqlite, "memorandum", "return_to_pengusul_comment", "text");
  addColumnIfMissing(sqlite, "memorandum", "returned_to_pengusul_at", "text");

  const tables = sqlite
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='memorandum_approvals'")
    .get();
  if (!tables) {
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS memorandum_approvals (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        memorandum_id integer NOT NULL,
        user_id integer NOT NULL,
        role text NOT NULL,
        stage text NOT NULL,
        decision text,
        comment text,
        disposition text,
        signature_data text,
        acted_at text,
        created_at text NOT NULL,
        FOREIGN KEY (memorandum_id) REFERENCES memorandum(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
  }

  const notifications = sqlite
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='notifications'")
    .get();
  if (!notifications) {
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        user_id integer NOT NULL,
        memorandum_id integer,
        type text NOT NULL,
        message text NOT NULL,
        is_read integer DEFAULT 0 NOT NULL,
        created_at text NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (memorandum_id) REFERENCES memorandum(id)
      );
    `);
  }
}
