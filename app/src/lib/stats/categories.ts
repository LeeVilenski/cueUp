import { EXERCISE_CATEGORIES, type Exercise, type ExerciseCategory, type SessionExercise } from '@/db/schema';

export type CategoryCoverage = Record<ExerciseCategory, number>;

export type ExerciseResult = {
  sessionExercise: SessionExercise;
  exercise: Exercise;
};

export function createEmptyCoverage(): CategoryCoverage {
  return EXERCISE_CATEGORIES.reduce((acc, category) => {
    acc[category] = 0;
    return acc;
  }, {} as CategoryCoverage);
}

export function getCategoryCoverage(
  results: ExerciseResult[],
  sinceDays?: number,
  now: Date = new Date(),
): CategoryCoverage {
  const coverage = createEmptyCoverage();
  const cutoff = sinceDays != null ? now.getTime() - sinceDays * 24 * 60 * 60 * 1000 : null;

  for (const { sessionExercise, exercise } of results) {
    if (cutoff == null || new Date(sessionExercise.completedAt).getTime() >= cutoff) {
      coverage[exercise.category] += 1;
    }
  }

  return coverage;
}

export function getNeglectedCategories(coverage: CategoryCoverage): ExerciseCategory[] {
  return EXERCISE_CATEGORIES.filter((category) => coverage[category] === 0);
}
