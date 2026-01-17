import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrationManager';

const dbName = 'condo_bills.db';
let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(dbName);

  await runMigrations(db);

  return db;
};

export const getDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync(dbName);
  }
  return db;
};
