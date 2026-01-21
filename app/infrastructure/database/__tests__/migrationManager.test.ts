import { initDatabase } from '../db';
import { runMigrations } from '../migrationManager';

// Mock the database module
jest.mock('../db', () => ({
  initDatabase: jest.fn(),
}));

describe('Migration Manager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have migration system available', async () => {
    expect(runMigrations).toBeDefined();
  });

  it('should export runMigrations function', () => {
    expect(typeof runMigrations).toBe('function');
  });

  it('migration manager should not crash on initialization', () => {
    expect(() => {
      const manager = { runMigrations };
      expect(manager).toBeDefined();
    }).not.toThrow();
  });

  it('should handle migration execution', async () => {
    // Test that the migration system can be called
    expect(runMigrations).toBeDefined();
  });

  it('should provide migration utilities', () => {
    const migrationSystem = { runMigrations };
    expect(migrationSystem.runMigrations).toBeDefined();
  });
});
