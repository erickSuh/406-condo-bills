import { CashFlowItem, FlowType } from './types';
import * as SQLite from 'expo-sqlite';
import { sortCodeNumeric } from './utils/sortCodeNumeric';

export class CashFlowRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async getCashFlowAbleToBeParent(): Promise<CashFlowItem[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.getAllAsync<CashFlowItem>(
        'SELECT * FROM cash_flow WHERE deleted = 0 AND accepts_entries = 0 ORDER BY code',
      );
      return sortCodeNumeric(result || []);
    } catch (error) {
      console.error('Failed to load parentable cash flow items:', error);
      return [];
    }
  }

  async getCashFlowChildren(): Promise<CashFlowItem[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.getAllAsync<CashFlowItem>(
        'SELECT * FROM cash_flow WHERE deleted = 0 ORDER BY code',
      );
      return sortCodeNumeric(result || []);
    } catch (error) {
      console.error('Failed to load child cash flow items:', error);
      return [];
    }
  }

  async getCashFlows(): Promise<CashFlowItem[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.getAllAsync<CashFlowItem>(
        'SELECT * FROM cash_flow WHERE deleted = 0 ORDER BY code',
      );
      return sortCodeNumeric(result || []);
    } catch (error) {
      console.error('Failed to load items:', error);
      return [];
    }
  }

  async deleteCashFlow(id: number): Promise<void> {
    if (!this.db) return;
    try {
      const childrenToDelete = await this.getAllChildrenRecursive(id);
      const idsToDelete = [id, ...childrenToDelete];

      for (const deleteId of idsToDelete) {
        await this.db.runAsync(
          'UPDATE cash_flow SET deleted = 1 WHERE id = ?',
          [deleteId],
        );
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  }

  async getAllChildrenRecursive(parentId: number): Promise<number[]> {
    const visited = new Set<number>();
    return this._getAllChildrenRecursiveHelper(parentId, visited);
  }

  private async _getAllChildrenRecursiveHelper(
    parentId: number,
    visited: Set<number>,
  ): Promise<number[]> {
    if (!this.db || visited.has(parentId)) return [];

    visited.add(parentId);

    try {
      const children = await this.db.getAllAsync<{ id: number }>(
        'SELECT id FROM cash_flow WHERE parent_id = ? AND deleted = 0',
        [parentId],
      );

      let allDescendants: number[] = [];

      for (const child of children || []) {
        if (!visited.has(child.id)) {
          allDescendants.push(child.id);
          const grandchildren = await this._getAllChildrenRecursiveHelper(
            child.id,
            visited,
          );
          allDescendants = [...allDescendants, ...grandchildren];
        }
      }

      return allDescendants;
    } catch (error) {
      console.error('Failed to get children recursively:', error);
      return [];
    }
  }

  async getFlowTypes(): Promise<FlowType[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.getAllAsync<FlowType>(
        'SELECT * FROM flow_types ORDER BY id',
      );
      return result || [];
    } catch (error) {
      console.error('Failed to load flow types:', error);
      return [];
    }
  }

  async getCashFlowByCode(code: string): Promise<CashFlowItem | null> {
    if (!this.db) return null;
    try {
      const result = await this.db.getFirstAsync<CashFlowItem>(
        'SELECT * FROM cash_flow WHERE code = ? AND deleted = 0',
        [code],
      );
      return result || null;
    } catch (error) {
      console.error('Failed to get cash flow by code:', error);
      return null;
    }
  }

  async insertCashFlow(data: {
    code: string;
    title: string;
    type: number;
    parentAccountId?: number;
    acceptsEntries?: number;
  }): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    try {
      const result = await this.db.runAsync(
        `INSERT INTO cash_flow (code, title, type, parent_id, accepts_entries, deleted) 
         VALUES (?, ?, ?, ?, ?, 0)`,
        [
          data.code,
          data.title,
          data.type,
          data.parentAccountId || null,
          data.acceptsEntries || 0,
        ],
      );
      return result.lastInsertRowId as number;
    } catch (error) {
      console.error('Failed to insert cash flow:', error);
      throw error;
    }
  }
}
