import type { Database } from '@/db/client';
import { exercises, tips } from '@/db/schema';

import { EXERCISES_SEED } from './exercises';
import { TIPS_SEED } from './tips';

export async function seedDatabase(db: Database) {
  const existingExercises = await db.select({ slug: exercises.slug }).from(exercises);
  const existingExerciseSlugs = new Set(existingExercises.map((row) => row.slug));
  const missingExercises = EXERCISES_SEED.filter((seed) => !existingExerciseSlugs.has(seed.slug));
  if (missingExercises.length > 0) {
    await db.insert(exercises).values(missingExercises);
  }

  const existingTips = await db.select({ slug: tips.slug }).from(tips);
  const existingTipSlugs = new Set(existingTips.map((row) => row.slug));
  const missingTips = TIPS_SEED.filter((seed) => !existingTipSlugs.has(seed.slug));
  if (missingTips.length > 0) {
    await db.insert(tips).values(missingTips);
  }
}
