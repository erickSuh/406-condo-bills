import { SQLiteDatabase } from 'expo-sqlite';

export interface DatabaseContextType {
  db: SQLiteDatabase | null;
  isReady: boolean;
  error: Error | null;
}
