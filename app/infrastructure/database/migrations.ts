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
      INSERT OR IGNORE INTO flow_types (id, label) VALUES
      (0, 'Income'),
      (1, 'Expense');
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cash_flow (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        title TEXT NOT NULL,
        type INTEGER NOT NULL DEFAULT 0,
        parent_id INTEGER,
        accepts_entries INTEGER NOT NULL DEFAULT 0,
        deleted INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(type) REFERENCES flow_types(id)
      );
    `);

    await db.execAsync(`
      INSERT OR IGNORE INTO cash_flow (code, title, type, accepts_entries) VALUES
      ('1', 'Receita', 0, 0),
      ('2', 'Despesa', 1, 0),
      ('3', 'Despesas bancárias', 1, 0),
      ('4', 'Outras receitas', 0, 0);
    `);
  },
  down: async (db: SQLite.SQLiteDatabase) => {
    await db.execAsync('DROP TABLE IF EXISTS flow_types;');
    await db.execAsync('DROP TABLE IF EXISTS cash_flow;');
  },
};

export const migrations: Migration[] = [migration_001_create_tables];
