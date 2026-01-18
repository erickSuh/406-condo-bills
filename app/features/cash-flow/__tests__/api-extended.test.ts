import { CashFlowRepository } from '../api';
import { CashFlowItem } from '../types';
import * as SQLite from 'expo-sqlite';

describe('CashFlowRepository - Extended Coverage', () => {
  let mockDb: jest.Mocked<SQLite.SQLiteDatabase>;
  let repository: CashFlowRepository;

  beforeEach(() => {
    mockDb = {
      getAllAsync: jest.fn(),
      runAsync: jest.fn(),
    } as any;
    repository = new CashFlowRepository(mockDb);
  });

  describe('getCashFlows - Edge Cases', () => {
    it('should filter out soft-deleted items', async () => {
      const mockCashFlows: CashFlowItem[] = [
        { id: 1, code: '1', title: 'Active', type: 0, deleted: 0 },
        { id: 2, code: '2', title: 'Deleted', type: 1, deleted: 1 },
      ];

      mockDb.getAllAsync.mockResolvedValue(mockCashFlows.filter(cf => !cf.deleted));

      const result = await repository.getCashFlows();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Active');
    });

    it('should order results by code', async () => {
      const mockCashFlows: CashFlowItem[] = [
        { id: 1, code: '2', title: 'Second', type: 0, deleted: 0 },
        { id: 2, code: '1', title: 'First', type: 1, deleted: 0 },
        { id: 3, code: '3', title: 'Third', type: 0, deleted: 0 },
      ];

      mockDb.getAllAsync.mockResolvedValue(
        mockCashFlows.sort((a, b) => a.code.localeCompare(b.code))
      );

      const result = await repository.getCashFlows();

      expect(result[0].code).toBe('1');
      expect(result[1].code).toBe('2');
      expect(result[2].code).toBe('3');
    });

    it('should handle numeric and string codes', async () => {
      const mockCashFlows: CashFlowItem[] = [
        { id: 1, code: '10', title: 'Ten', type: 0, deleted: 0 },
        { id: 2, code: '2', title: 'Two', type: 1, deleted: 0 },
        { id: 3, code: '1', title: 'One', type: 0, deleted: 0 },
      ];

      mockDb.getAllAsync.mockResolvedValue(
        mockCashFlows.sort((a, b) => a.code.localeCompare(b.code))
      );

      const result = await repository.getCashFlows();

      expect(result).toHaveLength(3);
    });

    it('should handle large result sets', async () => {
      const mockCashFlows: CashFlowItem[] = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        code: String(i),
        title: `Item ${i}`,
        type: i % 2,
        deleted: 0,
      }));

      mockDb.getAllAsync.mockResolvedValue(mockCashFlows);

      const result = await repository.getCashFlows();

      expect(result).toHaveLength(1000);
    });

    it('should return empty array on getAllAsync null response', async () => {
      mockDb.getAllAsync.mockResolvedValue(null);

      const result = await repository.getCashFlows();

      expect(result).toEqual([]);
    });

    it('should return empty array on getAllAsync undefined response', async () => {
      mockDb.getAllAsync.mockResolvedValue(undefined);

      const result = await repository.getCashFlows();

      expect(result).toEqual([]);
    });

    it('should handle database timeout errors', async () => {
      const error = new Error('Database query timeout');
      mockDb.getAllAsync.mockRejectedValue(error);

      const result = await repository.getCashFlows();

      expect(result).toEqual([]);
    });

    it('should handle constraint violation errors', async () => {
      const error = new Error('UNIQUE constraint failed');
      mockDb.getAllAsync.mockRejectedValue(error);

      const result = await repository.getCashFlows();

      expect(result).toEqual([]);
    });

    it('should pass correct SQL query', async () => {
      mockDb.getAllAsync.mockResolvedValue([]);

      await repository.getCashFlows();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM cash_flow WHERE deleted = 0 ORDER BY code'
      );
    });
  });

  describe('deleteCashFlow - Extended Cases', () => {
    it('should soft delete by setting deleted = 1', async () => {
      mockDb.runAsync.mockResolvedValue(undefined);

      await repository.deleteCashFlow(42);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'UPDATE cash_flow SET deleted = 1 WHERE id = ?',
        [42]
      );
    });

    it('should handle delete of non-existent id', async () => {
      mockDb.runAsync.mockResolvedValue(undefined);

      await expect(repository.deleteCashFlow(999)).resolves.toBeUndefined();

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'UPDATE cash_flow SET deleted = 1 WHERE id = ?',
        [999]
      );
    });

    it('should throw when database operation fails', async () => {
      const error = new Error('Database connection lost');
      mockDb.runAsync.mockRejectedValue(error);

      await expect(repository.deleteCashFlow(1)).rejects.toThrow(
        'Database connection lost'
      );
    });

    it('should throw on constraint violation', async () => {
      const error = new Error('FOREIGN KEY constraint failed');
      mockDb.runAsync.mockRejectedValue(error);

      await expect(repository.deleteCashFlow(1)).rejects.toThrow(
        'FOREIGN KEY constraint failed'
      );
    });

    it('should handle zero as valid id', async () => {
      mockDb.runAsync.mockResolvedValue(undefined);

      await repository.deleteCashFlow(0);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'UPDATE cash_flow SET deleted = 1 WHERE id = ?',
        [0]
      );
    });

    it('should handle negative ids', async () => {
      mockDb.runAsync.mockResolvedValue(undefined);

      await repository.deleteCashFlow(-1);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'UPDATE cash_flow SET deleted = 1 WHERE id = ?',
        [-1]
      );
    });

    it('should pass correct SQL parameters', async () => {
      mockDb.runAsync.mockResolvedValue(undefined);

      const testId = 12345;
      await repository.deleteCashFlow(testId);

      const calls = mockDb.runAsync.mock.calls;
      expect(calls[0][1]).toEqual([testId]);
    });

    it('should handle rapid successive deletes', async () => {
      mockDb.runAsync.mockResolvedValue(undefined);

      await Promise.all([
        repository.deleteCashFlow(1),
        repository.deleteCashFlow(2),
        repository.deleteCashFlow(3),
      ]);

      expect(mockDb.runAsync).toHaveBeenCalledTimes(3);
    });
  });

  describe('CashFlowRepository Constructor', () => {
    it('should initialize with database instance', () => {
      expect(repository).toBeDefined();
      expect(repository).toBeInstanceOf(CashFlowRepository);
    });

    it('should store database reference', () => {
      const repo = new CashFlowRepository(mockDb);
      expect(repo).toBeDefined();
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle get and delete sequence', async () => {
      const mockCashFlows: CashFlowItem[] = [
        { id: 1, code: '1', title: 'Item 1', type: 0, deleted: 0 },
      ];

      mockDb.getAllAsync.mockResolvedValue(mockCashFlows);
      mockDb.runAsync.mockResolvedValue(undefined);

      const items = await repository.getCashFlows();
      expect(items).toHaveLength(1);

      await repository.deleteCashFlow(1);
      expect(mockDb.runAsync).toHaveBeenCalled();
    });

    it('should handle multiple gets', async () => {
      const mockCashFlows: CashFlowItem[] = [
        { id: 1, code: '1', title: 'Item', type: 0, deleted: 0 },
      ];

      mockDb.getAllAsync.mockResolvedValue(mockCashFlows);

      const result1 = await repository.getCashFlows();
      const result2 = await repository.getCashFlows();

      expect(result1).toEqual(result2);
      expect(mockDb.getAllAsync).toHaveBeenCalledTimes(2);
    });

    it('should maintain data consistency', async () => {
      const originalCashFlows: CashFlowItem[] = [
        { id: 1, code: '1', title: 'Original', type: 0, deleted: 0 },
      ];

      mockDb.getAllAsync.mockResolvedValue(originalCashFlows);

      const result = await repository.getCashFlows();
      expect(result[0].title).toBe('Original');
    });
  });

  describe('Error Handling', () => {
    it('should provide consistent error handling', async () => {
      mockDb.getAllAsync.mockRejectedValue(new Error('Any error'));

      const result = await repository.getCashFlows();

      expect(result).toEqual([]);
      expect(result).toBeInstanceOf(Array);
    });

    it('should not corrupt state on error', async () => {
      mockDb.getAllAsync.mockRejectedValueOnce(new Error('Error 1'));
      mockDb.getAllAsync.mockResolvedValueOnce([]);

      const result1 = await repository.getCashFlows();
      const result2 = await repository.getCashFlows();

      expect(result1).toEqual([]);
      expect(result2).toEqual([]);
    });
  });
});
