import * as SQLite from 'expo-sqlite';
import {
  migration_001_create_tables,
  migration_002_create_tables,
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
          expect.stringContaining('INSERT INTO flow_types (label) VALUES'),
        );
      });

      it('should insert Income and Expense types', async () => {
        await migration_001_create_tables.up(mockDb);

        const insertCall = mockDb.execAsync.mock.calls.find(
          call => call[0] && call[0].includes('INSERT INTO flow_types'),
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

  describe('Migration 002 - Add Test Data', () => {
    it('should define migration with correct version and name', () => {
      expect(migration_002_create_tables.version).toBe(2);
      expect(migration_002_create_tables.name).toBe('add_test_data');
    });

    it('should have up method', () => {
      expect(migration_002_create_tables.up).toBeDefined();
    });

    it('should not have down method', () => {
      expect(migration_002_create_tables.down).toBeUndefined();
    });

    describe('Up Migration', () => {
      it('should insert test data into cash_flow', async () => {
        await migration_002_create_tables.up(mockDb);

        expect(mockDb.execAsync).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO cash_flow'),
        );
      });

      it('should insert with code 1', async () => {
        await migration_002_create_tables.up(mockDb);

        const insertCall = mockDb.execAsync.mock.calls.find(
          call => call[0] && call[0].includes('INSERT INTO cash_flow'),
        );

        expect(insertCall?.[0]).toContain("'1'");
      });

      it('should insert with title', async () => {
        await migration_002_create_tables.up(mockDb);

        const insertCall = mockDb.execAsync.mock.calls.find(
          call => call[0] && call[0].includes('INSERT INTO cash_flow'),
        );

        expect(insertCall?.[0]).toContain("'Title teste'");
      });

      it('should insert with type 0 (Income)', async () => {
        await migration_002_create_tables.up(mockDb);

        const insertCall = mockDb.execAsync.mock.calls.find(
          call => call[0] && call[0].includes('INSERT INTO cash_flow'),
        );

        expect(insertCall?.[0]).toContain('0');
      });
    });
  });

  describe('Migrations Array', () => {
    it('should export migrations array', () => {
      expect(Array.isArray(migrations)).toBe(true);
    });

    it('should contain both migrations', () => {
      expect(migrations).toHaveLength(2);
    });

    it('should have migrations in order', () => {
      expect(migrations[0].version).toBe(1);
      expect(migrations[1].version).toBe(2);
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
    it('should maintain table structure across migrations', async () => {
      // First migration creates tables
      await migration_001_create_tables.up(mockDb);
      const firstCallCount = mockDb.execAsync.mock.calls.length;

      // Reset mocks
      jest.clearAllMocks();

      // Second migration adds data
      await migration_002_create_tables.up(mockDb);

      // Should only have one exec call for insert
      expect(mockDb.execAsync).toHaveBeenCalled();
    });
  });
});
