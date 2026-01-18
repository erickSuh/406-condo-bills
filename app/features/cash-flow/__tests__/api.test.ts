import { CashFlowRepository } from '../api';
import * as SQLite from 'expo-sqlite';

describe('CashFlowRepository', () => {
  let mockDb: jest.Mocked<SQLite.SQLiteDatabase>;
  let repository: CashFlowRepository;

  beforeEach(() => {
    mockDb = {
      getAllAsync: jest.fn(),
      runAsync: jest.fn(),
    } as any;
    repository = new CashFlowRepository(mockDb);
  });

  describe('getCashFlows', () => {
    it('should return array of cash flows', async () => {
      const mockCashFlows = [
        {
          id: 1,
          code: '1',
          title: 'Income',
          type: 0,
          deleted: 0,
        },
      ];

      mockDb.getAllAsync.mockResolvedValue(mockCashFlows);

      const result = await repository.getCashFlows();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM cash_flow WHERE deleted = 0 ORDER BY code',
      );
      expect(result).toEqual(mockCashFlows);
    });

    it('should return empty array when no cash flows exist', async () => {
      mockDb.getAllAsync.mockResolvedValue(null);

      const result = await repository.getCashFlows();

      expect(result).toEqual([]);
    });

    it('should handle database error gracefully', async () => {
      const error = new Error('Database error');
      mockDb.getAllAsync.mockRejectedValue(error);

      const result = await repository.getCashFlows();

      expect(result).toEqual([]);
    });

    it('should return empty array when db is not available', async () => {
      const repositoryWithoutDb = new CashFlowRepository(null as any);
      const result = await repositoryWithoutDb.getCashFlows();

      expect(result).toEqual([]);
    });
  });

  describe('deleteCashFlow', () => {
    it('should update cash flow deleted status', async () => {
      mockDb.runAsync.mockResolvedValue(undefined);

      await repository.deleteCashFlow(1);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'UPDATE cash_flow SET deleted = 1 WHERE id = ?',
        [1],
      );
    });

    it('should throw error when database operation fails', async () => {
      const error = new Error('Delete failed');
      mockDb.runAsync.mockRejectedValue(error);

      await expect(repository.deleteCashFlow(1)).rejects.toThrow(
        'Delete failed',
      );
    });

    it('should not throw when db is not available', async () => {
      const repositoryWithoutDb = new CashFlowRepository(null as any);
      await expect(
        repositoryWithoutDb.deleteCashFlow(1),
      ).resolves.toBeUndefined();
    });
  });
});
