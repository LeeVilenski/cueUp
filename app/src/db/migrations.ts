import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Hand-written, idempotent DDL mirroring src/db/schema.ts. Run once on app start.
 * Avoids a drizzle-kit migration build step for this local-only database.
 */
const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('potting','safety','break_building','positional_play','cueing_fundamentals','match_practice')),
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
);

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

CREATE TABLE IF NOT EXISTS break_logs (
  id TEXT PRIMARY KEY,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 147),
  context TEXT NOT NULL DEFAULT 'practice' CHECK (context IN ('practice','match','league')),
  session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
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
}
