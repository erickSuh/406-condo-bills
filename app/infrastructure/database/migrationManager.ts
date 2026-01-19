import * as SQLite from 'expo-sqlite';
import { migrations } from './migrations';

export const runMigrations = async (db: SQLite.SQLiteDatabase) => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const appliedMigrations = await db.getAllAsync<{ version: number }>(
      'SELECT version FROM schema_migrations ORDER BY version',
    );

    const appliedVersions = appliedMigrations.map(m => m.version);

    for (const migration of migrations) {
      if (!appliedVersions.includes(migration.version)) {
        console.log(
          `Running migration ${migration.version}: ${migration.name}`,
        );

        await migration.up(db);

        await db.runAsync(
          'INSERT OR IGNORE INTO schema_migrations (version, name) VALUES (?, ?)',
          [migration.version, migration.name],
        );

        console.log(`✅ Migration ${migration.version} completed`);
      }
    }

    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

export const rollbackMigration = async (
  db: SQLite.SQLiteDatabase,
  version: number,
) => {
  try {
    const migration = migrations.find(m => m.version === version);

    if (!migration || !migration.down) {
      throw new Error(`Migration ${version} does not support rollback`);
    }

    console.log(`Rolling back migration ${version}: ${migration.name}`);

    await migration.down(db);

    await db.runAsync('DELETE FROM schema_migrations WHERE version = ?', [
      version,
    ]);

    console.log(`✅ Rollback migration ${version} completed`);
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  }
};

export const getMigrationStatus = async (
  db: SQLite.SQLiteDatabase,
): Promise<
  { version: number; name: string; status: 'applied' | 'pending' }[]
> => {
  try {
    const appliedMigrations = await db.getAllAsync<{ version: number }>(
      'SELECT version FROM schema_migrations ORDER BY version',
    );

    const appliedVersions = appliedMigrations.map(m => m.version);

    return migrations.map(migration => ({
      version: migration.version,
      name: migration.name,
      status: appliedVersions.includes(migration.version)
        ? ('applied' as const)
        : ('pending' as const),
    }));
  } catch (error) {
    console.error('❌ Failed to get migration status:', error);
    throw error;
  }
};
