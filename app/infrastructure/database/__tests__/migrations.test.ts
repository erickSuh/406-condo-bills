import * as SQLite from 'expo-sqlite';
import {
  migration_001_create_tables,
  migrations,
  Migration,
} from '../migrations';

describe('Database Migrations', () => {
  let mockDb: jest.Mocked<SQLite.SQLiteDatabase>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = {
      execAsync: jest.fn(),
      runAsync: jest.fn(),
      getAllAsync: jest.fn(),
    } as any;
  });

  describe('Migration 001 - Create Tables', () => {
    it('should define migration with correct version and name', () => {
      expect(migration_001_create_tables.version).toBe(1);
      expect(migration_001_create_tables.name).toBe('create_tables');
    });

    it('should have up method', () => {
      expect(migration_001_create_tables.up).toBeDefined();
      expect(typeof migration_001_create_tables.up).toBe('function');
    });

    it('should have down method', () => {
      expect(migration_001_create_tables.down).toBeDefined();
      expect(typeof migration_001_create_tables.down).toBe('function');
    });

    describe('Up Migration', () => {
      it('should create flow_types table', async () => {
        await migration_001_create_tables.up(mockDb);

        expect(mockDb.execAsync).toHaveBeenCalledWith(
          expect.stringContaining('CREATE TABLE IF NOT EXISTS flow_types'),
        );
      });

      it('should create cash_flow table', async () => {
        await migration_001_create_tables.up(mockDb);

        expect(mockDb.execAsync).toHaveBeenCalledWith(
          expect.stringContaining('CREATE TABLE IF NOT EXISTS cash_flow'),
        );
      });

      it('should insert flow types', async () => {
        await migration_001_create_tables.up(mockDb);

        expect(mockDb.execAsync).toHaveBeenCalledWith(
          expect.stringContaining('INSERT OR IGNORE INTO flow_types'),
        );
      });

      it('should insert Income and Expense types', async () => {
        await migration_001_create_tables.up(mockDb);

        const insertCall = mockDb.execAsync.mock.calls.find(
          call =>
            call[0] && call[0].includes('INSERT OR IGNORE INTO flow_types'),
        );

        expect(insertCall).toBeDefined();
        expect(insertCall?.[0]).toContain('Income');
        expect(insertCall?.[0]).toContain('Expense');
      });

      it('should define correct flow_types columns', async () => {
        await migration_001_create_tables.up(mockDb);

        const createTableCall = mockDb.execAsync.mock.calls.find(
          call =>
            call[0] &&
            call[0].includes('CREATE TABLE IF NOT EXISTS flow_types'),
        );

        expect(createTableCall?.[0]).toContain('id');
        expect(createTableCall?.[0]).toContain('label');
        expect(createTableCall?.[0]).toContain('created_at');
        expect(createTableCall?.[0]).toContain('updated_at');
      });

      it('should define correct cash_flow columns', async () => {
        await migration_001_create_tables.up(mockDb);

        const createTableCall = mockDb.execAsync.mock.calls.find(
          call =>
            call[0] && call[0].includes('CREATE TABLE IF NOT EXISTS cash_flow'),
        );

        expect(createTableCall?.[0]).toContain('id');
        expect(createTableCall?.[0]).toContain('code');
        expect(createTableCall?.[0]).toContain('title');
        expect(createTableCall?.[0]).toContain('type');
        expect(createTableCall?.[0]).toContain('deleted');
        expect(createTableCall?.[0]).toContain('created_at');
        expect(createTableCall?.[0]).toContain('updated_at');
      });

      it('should set defaults for cash_flow columns', async () => {
        await migration_001_create_tables.up(mockDb);

        const createTableCall = mockDb.execAsync.mock.calls.find(
          call =>
            call[0] && call[0].includes('CREATE TABLE IF NOT EXISTS cash_flow'),
        );

        expect(createTableCall?.[0]).toContain('DEFAULT 0');
        expect(createTableCall?.[0]).toContain('DEFAULT CURRENT_TIMESTAMP');
      });

      it('should define foreign key relationship', async () => {
        await migration_001_create_tables.up(mockDb);

        const createTableCall = mockDb.execAsync.mock.calls.find(
          call =>
            call[0] && call[0].includes('CREATE TABLE IF NOT EXISTS cash_flow'),
        );

        expect(createTableCall?.[0]).toContain('FOREIGN KEY');
        expect(createTableCall?.[0]).toContain('REFERENCES flow_types');
      });

      it('should handle exec errors', async () => {
        mockDb.execAsync.mockRejectedValue(new Error('Create table failed'));

        await expect(migration_001_create_tables.up(mockDb)).rejects.toThrow(
          'Create table failed',
        );
      });
    });

    describe('Down Migration', () => {
      it('should drop flow_types table', async () => {
        await migration_001_create_tables.down?.(mockDb);

        expect(mockDb.execAsync).toHaveBeenCalledWith(
          'DROP TABLE IF EXISTS flow_types;',
        );
      });

      it('should drop cash_flow table', async () => {
        await migration_001_create_tables.down?.(mockDb);

        expect(mockDb.execAsync).toHaveBeenCalledWith(
          'DROP TABLE IF EXISTS cash_flow;',
        );
      });

      it('should handle drop errors', async () => {
        mockDb.execAsync.mockRejectedValue(new Error('Drop failed'));

        await expect(
          migration_001_create_tables.down?.(mockDb),
        ).rejects.toThrow('Drop failed');
      });
    });
  });

  describe('Migrations Array', () => {
    it('should export migrations array', () => {
      expect(Array.isArray(migrations)).toBe(true);
    });

    it('should contain migration', () => {
      expect(migrations.length).toBeGreaterThan(0);
    });

    it('should have first migration as version 1', () => {
      expect(migrations[0].version).toBe(1);
    });

    it('should have unique versions', () => {
      const versions = migrations.map(m => m.version);
      const uniqueVersions = new Set(versions);
      expect(uniqueVersions.size).toBe(versions.length);
    });

    it('should have all required migration properties', () => {
      migrations.forEach(migration => {
        expect(migration).toHaveProperty('version');
        expect(migration).toHaveProperty('name');
        expect(migration).toHaveProperty('up');
        expect(typeof migration.version).toBe('number');
        expect(typeof migration.name).toBe('string');
        expect(typeof migration.up).toBe('function');
      });
    });
  });

  describe('Migration Interface Compliance', () => {
    it('should comply with Migration interface', () => {
      const migration = migration_001_create_tables as Migration;
      expect(migration.version).toBeDefined();
      expect(migration.name).toBeDefined();
      expect(migration.up).toBeDefined();
    });

    it('should have consistent migration structure', () => {
      migrations.forEach(migration => {
        expect(typeof migration.version).toBe('number');
        expect(typeof migration.name).toBe('string');
        expect(typeof migration.up).toBe('function');

        if (migration.down) {
          expect(typeof migration.down).toBe('function');
        }
      });
    });
  });

  describe('Data Integrity', () => {
    it('should create tables with correct structure', async () => {
      await migration_001_create_tables.up(mockDb);

      expect(mockDb.execAsync).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS flow_types'),
      );
      expect(mockDb.execAsync).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS cash_flow'),
      );
    });

    it('should use INSERT OR IGNORE for idempotent migrations', async () => {
      await migration_001_create_tables.up(mockDb);

      const insertCalls = mockDb.execAsync.mock.calls.filter(call =>
        call[0]?.includes('INSERT OR IGNORE'),
      );

      expect(insertCalls.length).toBeGreaterThan(0);
    });
  });
});
