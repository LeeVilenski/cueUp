import type { Database } from '@/db/client';
import { exercises, tips } from '@/db/schema';

import { EXERCISES_SEED } from './exercises';
import { TIPS_SEED } from './tips';

export async function seedDatabase(db: Database) {
  const existingExercises = await db.select({ id: exercises.id }).from(exercises).limit(1);
  if (existingExercises.length === 0) {
    await db.insert(exercises).values(EXERCISES_SEED);
  }

  const existingTips = await db.select({ id: tips.id }).from(tips).limit(1);
  if (existingTips.length === 0) {
    await db.insert(tips).values(TIPS_SEED);
  }
}
