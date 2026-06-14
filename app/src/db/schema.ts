import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const EXERCISE_CATEGORIES = [
  'warm_up',
  'potting',
  'safety',
  'break_building',
  'positional_play',
  'cueing_fundamentals',
  'match_practice',
] as const;
export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const SCORING_TYPES = [
  'score_out_of',
  'count_potted',
  'break_value',
  'pass_fail',
  'time_based',
  'notes_only',
] as const;
export type ScoringType = (typeof SCORING_TYPES)[number];

export const TIP_CATEGORIES = [
  'fundamentals',
  'cueing',
  'safety_mindset',
  'mental_game',
  'practice_habits',
] as const;
export type TipCategory = (typeof TIP_CATEGORIES)[number];

export const BREAK_CONTEXTS = ['practice', 'match', 'league'] as const;
export type BreakContext = (typeof BREAK_CONTEXTS)[number];

export const SYNC_STATUSES = ['pending', 'synced'] as const;
export type SyncStatus = (typeof SYNC_STATUSES)[number];

export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  category: text('category', { enum: EXERCISE_CATEGORIES }).notNull(),
  description: text('description').notNull(),
  bestPracticeTips: text('best_practice_tips').notNull(),
  difficulty: text('difficulty', { enum: DIFFICULTIES }).notNull(),
  suggestedDurationMins: integer('suggested_duration_mins'),
  scoringType: text('scoring_type', { enum: SCORING_TYPES }).notNull(),
  scoringTarget: integer('scoring_target'),
  scoringUnit: text('scoring_unit'),
  isBuiltIn: integer('is_built_in', { mode: 'boolean' }).notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  remoteId: text('remote_id'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const tips = sqliteTable('tips', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category', { enum: TIP_CATEGORIES }).notNull(),
  body: text('body').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  startedAt: text('started_at').notNull(),
  endedAt: text('ended_at'),
  durationMins: integer('duration_mins'),
  location: text('location'),
  overallNotes: text('overall_notes'),
  mood: integer('mood'),
  syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  remoteId: text('remote_id'),
  updatedAt: text('updated_at').notNull(),
});

export const sessionExercises = sqliteTable('session_exercises', {
  id: text('id').primaryKey(),
  sessionId: text('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id')
    .notNull()
    .references(() => exercises.id),
  orderIndex: integer('order_index').notNull().default(0),
  resultValue: real('result_value'),
  resultNotes: text('result_notes'),
  durationSecs: integer('duration_secs'),
  completedAt: text('completed_at').notNull(),
  syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  remoteId: text('remote_id'),
});

export const breakLogs = sqliteTable('break_logs', {
  id: text('id').primaryKey(),
  score: integer('score').notNull(),
  context: text('context', { enum: BREAK_CONTEXTS }).notNull().default('practice'),
  sessionId: text('session_id').references(() => sessions.id, { onDelete: 'set null' }),
  achievedAt: text('achieved_at').notNull(),
  notes: text('notes'),
  isPersonalBest: integer('is_personal_best', { mode: 'boolean' }).notNull().default(false),
  syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  remoteId: text('remote_id'),
  updatedAt: text('updated_at').notNull(),
});

export const appSettings = sqliteTable('app_settings', {
  id: integer('id').primaryKey(),
  playerName: text('player_name'),
  defaultSessionDurationMins: integer('default_session_duration_mins').notNull().default(30),
  quickLogDefaultContext: text('quick_log_default_context', { enum: BREAK_CONTEXTS })
    .notNull()
    .default('practice'),
  weeklySessionGoal: integer('weekly_session_goal').notNull().default(3),
  lastSyncAt: text('last_sync_at'),
});

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type Tip = typeof tips.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type SessionExercise = typeof sessionExercises.$inferSelect;
export type NewSessionExercise = typeof sessionExercises.$inferInsert;
export type BreakLog = typeof breakLogs.$inferSelect;
export type NewBreakLog = typeof breakLogs.$inferInsert;
export type AppSettings = typeof appSettings.$inferSelect;
