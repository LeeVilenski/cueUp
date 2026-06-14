import { eq } from 'drizzle-orm';

import type { Database } from '@/db/client';
import { exercises, tips, type Exercise, type NewExercise } from '@/db/schema';

import { EXERCISES_SEED } from './exercises';
import { TIPS_SEED } from './tips';

export async function seedDatabase(db: Database) {
  const existingExercises = await db.select().from(exercises);
  const existingExerciseBySlug = new Map(existingExercises.map((row) => [row.slug, row]));

  const missingExercises = EXERCISES_SEED.filter((seed) => !existingExerciseBySlug.has(seed.slug));
  if (missingExercises.length > 0) {
    await db.insert(exercises).values(missingExercises);
  }

  for (const seed of EXERCISES_SEED) {
    const existing = existingExerciseBySlug.get(seed.slug);
    if (existing && existing.isBuiltIn && exerciseContentChanged(existing, seed)) {
      await db
        .update(exercises)
        .set({
          name: seed.name,
          category: seed.category,
          description: seed.description,
          bestPracticeTips: seed.bestPracticeTips,
          difficulty: seed.difficulty,
          suggestedDurationMins: seed.suggestedDurationMins,
          scoringType: seed.scoringType,
          scoringTarget: seed.scoringTarget,
          scoringUnit: seed.scoringUnit,
          sortOrder: seed.sortOrder,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(exercises.id, existing.id));
    }
  }

  const existingTips = await db.select({ slug: tips.slug }).from(tips);
  const existingTipSlugs = new Set(existingTips.map((row) => row.slug));
  const missingTips = TIPS_SEED.filter((seed) => !existingTipSlugs.has(seed.slug));
  if (missingTips.length > 0) {
    await db.insert(tips).values(missingTips);
  }
}

/** Detects content drift between an existing built-in exercise and the latest seed, so app updates can correct it. */
function exerciseContentChanged(existing: Exercise, seed: NewExercise): boolean {
  return (
    existing.name !== seed.name ||
    existing.category !== seed.category ||
    existing.description !== seed.description ||
    existing.bestPracticeTips !== seed.bestPracticeTips ||
    existing.difficulty !== seed.difficulty ||
    existing.suggestedDurationMins !== seed.suggestedDurationMins ||
    existing.scoringType !== seed.scoringType ||
    existing.scoringTarget !== seed.scoringTarget ||
    existing.scoringUnit !== seed.scoringUnit ||
    existing.sortOrder !== seed.sortOrder
  );
}
