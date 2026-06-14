import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import * as schema from './schema';

export type Database = ReturnType<typeof drizzle<typeof schema>>;

let sqliteInstance: SQLiteDatabase | null = null;
let dbInstance: Database | null = null;

// expo-sqlite's web build initializes its SQLite engine (wasm + OPFS) in a
// worker. Opening synchronously blocks on that worker via Atomics and times
// out before the one-time setup finishes, so the connection must be opened
// asynchronously. Subsequent (sync) queries reuse the now-initialized worker.
export async function openDatabaseConnection() {
  if (!dbInstance || !sqliteInstance) {
    sqliteInstance = await openDatabaseAsync('snooker.db');
    dbInstance = drizzle(sqliteInstance, { schema });
  }
  return { db: dbInstance, sqlite: sqliteInstance };
}

export function getDatabase(): Database {
  if (!dbInstance) throw new Error('Database accessed before initialization');
  return dbInstance;
}

export function getSqlite(): SQLiteDatabase {
  if (!sqliteInstance) throw new Error('Database accessed before initialization');
  return sqliteInstance;
}
