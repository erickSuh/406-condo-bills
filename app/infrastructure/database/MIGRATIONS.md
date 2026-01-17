# SQLite Migration System

This directory contains the SQLite database configuration and migrations for the Shopping List app.

## Files

- **`db.ts`** - Database connection and initialization
- **`migrations.ts`** - Migration definitions
- **`migrationManager.ts`** - Migration execution engine
- **`index.ts`** - Public exports

## How Migrations Work

Migrations are versioned SQL changes that are applied in order. Each migration:

1. Has a unique version number
2. Can be rolled back (if `down` is implemented)
3. Is tracked in `schema_migrations` table
4. Runs only once

## Creating a New Migration

Add a new migration to `migrations.ts`:

```typescript
export const migration_003_add_new_column: Migration = {
  version: 3,
  name: 'add_new_column',
  up: async (db: SQLite.SQLiteDatabase) => {
    await db.execAsync(`
      ALTER TABLE lists ADD COLUMN new_field TEXT;
    `);
  },
  down: async (db: SQLite.SQLiteDatabase) => {
    // SQLite doesn't support DROP COLUMN easily, but you can recreate the table
  },
};
```

Then add it to the `migrations` array in the same file, in order:

```typescript
export const migrations: Migration[] = [
  migration_001_create_tables,
  migration_002_create_migrations_table,
  migration_003_add_new_column, // New migration
];
```

## Current Migrations

### Migration 1: Create Tables

- Creates `lists` table with columns: id, title, description, items_count, created_at, updated_at
- Creates `items` table with columns: id, title, description, list_id, is_checked, quantity, created_at, updated_at

**Note:** The `schema_migrations` table is created by the migration manager before any migrations run, so it doesn't need to be in a migration itself.

## Debug Commands

Check migration status programmatically:

```typescript
import { getMigrationStatus } from '@/infrastructure/database';

const status = await getMigrationStatus(db);
console.log(status); // [{version: 1, name: 'create_tables', status: 'applied'}, ...]
```

Rollback a migration (use with caution):

```typescript
import { rollbackMigration } from '@/infrastructure/database';

await rollbackMigration(db, 1); // Rolls back migration version 1
```

## Best Practices

✅ **DO:**

- Write both `up` and `down` migrations
- Test migrations locally before committing
- Keep migrations small and focused
- Use descriptive migration names

❌ **DON'T:**

- Modify existing migrations
- Skip versions
- Run multiple migrations at once manually
- Leave migrations incomplete

## Error Handling

All migration errors are caught and logged. If a migration fails:

1. Check the console logs for details
2. Fix the migration code
3. Clear the database or fix the schema manually if needed
4. Re-run the app

The app will automatically run pending migrations on startup.
