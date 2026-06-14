import { openDatabaseConnection } from './client';
import { runMigrations } from './migrations';
import { seedDatabase } from './seed';

export async function initDatabase() {
  const { db, sqlite } = await openDatabaseConnection();
  await runMigrations(sqlite);
  await seedDatabase(db);
}
