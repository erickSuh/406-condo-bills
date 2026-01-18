import * as SQLite from 'expo-sqlite';

export type Migration = {
  version: number;
  name: string;
  up: (db: SQLite.SQLiteDatabase) => Promise<void>;
  down?: (db: SQLite.SQLiteDatabase) => Promise<void>;
};

export const migration_001_create_tables: Migration = {
  version: 1,
  name: 'create_tables',
  up: async (db: SQLite.SQLiteDatabase) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS flow_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execAsync(`
      INSERT INTO flow_types (label) VALUES
      ('Income'),
      ('Expense');
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cash_flow (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        title TEXT NOT NULL,
        type INTEGER NOT NULL DEFAULT 0,
        deleted INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(type) REFERENCES flow_types(id)
      );
    `);
  },
  down: async (db: SQLite.SQLiteDatabase) => {
    await db.execAsync('DROP TABLE IF EXISTS flow_types;');
    await db.execAsync('DROP TABLE IF EXISTS cash_flow;');
  },
};

export const migrations: Migration[] = [migration_001_create_tables];
