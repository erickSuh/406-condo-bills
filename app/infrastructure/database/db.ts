import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrationManager';

const dbName = 'condo_bills.db';
let db: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const initDatabase = async () => {
  if (db) return db;

  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      console.log('execute database initDatabase');
      db = await SQLite.openDatabaseAsync(dbName);

      await runMigrations(db);

      return db;
    } catch (error) {
      db = null;
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
};
