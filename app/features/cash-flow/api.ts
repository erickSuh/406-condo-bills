import { CashFlowItem } from './types';
import * as SQLite from 'expo-sqlite';

export class CashFlowRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async getCashFlows(): Promise<CashFlowItem[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.getAllAsync<CashFlowItem>(
        'SELECT * FROM cash_flow WHERE deleted = 0 ORDER BY code',
      );
      return result || [];
    } catch (error) {
      console.error('Failed to load items:', error);
      return [];
    }
  }

  async deleteCashFlow(id: number): Promise<void> {
    if (!this.db) return;
    try {
      await this.db.runAsync('UPDATE cash_flow SET deleted = 1 WHERE id = ?', [
        id,
      ]);
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  }
}
