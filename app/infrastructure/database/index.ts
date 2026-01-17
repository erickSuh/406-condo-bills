import { initDatabase } from './db';

export const initializeDatabase = async () => {
  try {
    await initDatabase();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
};

export { getMigrationStatus, rollbackMigration } from './migrationManager';
