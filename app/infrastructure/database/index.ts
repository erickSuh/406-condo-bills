import { initDatabase } from './db';

export const initializeDatabase = async () => {
  try {
    return await initDatabase();
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
};

export { getMigrationStatus, rollbackMigration } from './migrationManager';
