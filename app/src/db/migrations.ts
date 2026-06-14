import type { SQLiteDatabase } from 'expo-sqlite';

/** Shared column definitions for `exercises`, used by both the initial create and the category-migration rebuild below. */
const EXERCISES_COLUMNS_SQL = `
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('warm_up','potting','safety','break_building','positional_play','cueing_fundamentals','match_practice')),
  description TEXT NOT NULL,
  best_practice_tips TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner','intermediate','advanced')),
  suggested_duration_mins INTEGER,
  scoring_type TEXT NOT NULL CHECK (scoring_type IN ('score_out_of','count_potted','break_value','pass_fail','time_based','notes_only')),
  scoring_target INTEGER,
  scoring_unit TEXT,
  is_built_in INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending','synced')),
  remote_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
`;

/**
 * Hand-written, idempotent DDL mirroring src/db/schema.ts. Run once on app start.
 * Avoids a drizzle-kit migration build step for this local-only database.
 */
const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS exercises (${EXERCISES_COLUMNS_SQL});

CREATE TABLE IF NOT EXISTS tips (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fundamentals','cueing','safety_mindset','mental_game','practice_habits')),
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  duration_mins INTEGER,
  location TEXT,
  overall_notes TEXT,
  mood INTEGER CHECK (mood BETWEEN 1 AND 5),
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending','synced')),
  remote_id TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS session_exercises (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES exercises(id),
  order_index INTEGER NOT NULL DEFAULT 0,
  result_value REAL,
  result_notes TEXT,
  duration_secs INTEGER,
  completed_at TEXT NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending','synced')),
  remote_id TEXT
);
CREATE INDEX IF NOT EXISTS idx_session_exercises_session ON session_exercises(session_id);

CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  opponent_name TEXT NOT NULL,
  is_league INTEGER NOT NULL DEFAULT 0,
  result TEXT NOT NULL CHECK (result IN ('win','loss','draw')),
  frames_won INTEGER,
  frames_lost INTEGER,
  played_at TEXT NOT NULL,
  notes TEXT,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending','synced')),
  remote_id TEXT,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_matches_played_at ON matches(played_at DESC);

CREATE TABLE IF NOT EXISTS match_frames (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  frame_number INTEGER NOT NULL,
  player_score INTEGER NOT NULL,
  opponent_score INTEGER NOT NULL,
  player_high_break INTEGER,
  opponent_high_break INTEGER,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending','synced')),
  remote_id TEXT
);
CREATE INDEX IF NOT EXISTS idx_match_frames_match ON match_frames(match_id);

CREATE TABLE IF NOT EXISTS break_logs (
  id TEXT PRIMARY KEY,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 147),
  context TEXT NOT NULL DEFAULT 'practice' CHECK (context IN ('practice','match','league')),
  session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
  match_id TEXT REFERENCES matches(id) ON DELETE CASCADE,
  achieved_at TEXT NOT NULL,
  notes TEXT,
  is_personal_best INTEGER NOT NULL DEFAULT 0,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending','synced')),
  remote_id TEXT,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_break_logs_score ON break_logs(score DESC);
CREATE INDEX IF NOT EXISTS idx_break_logs_achieved_at ON break_logs(achieved_at DESC);

CREATE TABLE IF NOT EXISTS app_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  player_name TEXT,
  default_session_duration_mins INTEGER NOT NULL DEFAULT 30,
  quick_log_default_context TEXT NOT NULL DEFAULT 'practice' CHECK (quick_log_default_context IN ('practice','match','league')),
  weekly_session_goal INTEGER NOT NULL DEFAULT 3,
  last_sync_at TEXT
);

INSERT OR IGNORE INTO app_settings (id) VALUES (1);
`;

export async function runMigrations(sqlite: SQLiteDatabase) {
  await sqlite.execAsync(SCHEMA_SQL);
  await migrateExerciseCategoryConstraint(sqlite);
  await migrateBreakLogsMatchId(sqlite);
}

/**
 * SQLite can't ALTER a CHECK constraint in place, so installs created before the
 * 'warm_up' category existed have an `exercises` table whose CHECK clause rejects it.
 * Rebuild the table with the current constraint, preserving existing rows and ids
 * (so session_exercises foreign keys stay valid).
 */
async function migrateExerciseCategoryConstraint(sqlite: SQLiteDatabase) {
  const table = await sqlite.getFirstAsync<{ sql: string }>(
    `SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'exercises'`,
  );
  if (!table || table.sql.includes('warm_up')) return;

  await sqlite.execAsync(`PRAGMA foreign_keys = OFF;`);
  await sqlite.execAsync(`
    CREATE TABLE exercises_new (${EXERCISES_COLUMNS_SQL});
    INSERT INTO exercises_new SELECT * FROM exercises;
    DROP TABLE exercises;
    ALTER TABLE exercises_new RENAME TO exercises;
  `);
  await sqlite.execAsync(`PRAGMA foreign_keys = ON;`);
}

/** Installs created before match logging existed are missing `break_logs.match_id`; add it so match breaks can link back. */
async function migrateBreakLogsMatchId(sqlite: SQLiteDatabase) {
  const columns = await sqlite.getAllAsync<{ name: string }>(`PRAGMA table_info(break_logs)`);
  if (columns.some((column) => column.name === 'match_id')) return;

  await sqlite.execAsync(`ALTER TABLE break_logs ADD COLUMN match_id TEXT REFERENCES matches(id) ON DELETE CASCADE;`);
}
