import type { Exercise } from '@/db/schema';
import type { ExerciseResult } from '@/lib/stats/categories';

export const WEAK_AREA_THRESHOLD = 0.6;

export type WeakArea = {
  exercise: Exercise;
  averageRatio: number;
  attempts: number;
};

export function getWeakAreas(results: ExerciseResult[], limitPerExercise = 5): WeakArea[] {
  const byExercise = new Map<string, ExerciseResult[]>();

  for (const result of results) {
    const { exercise, sessionExercise } = result;
    const scoresAgainstTarget = exercise.scoringType === 'score_out_of' || exercise.scoringType === 'count_potted';
    if (!scoresAgainstTarget || exercise.scoringTarget == null || sessionExercise.resultValue == null) {
      continue;
    }

    const existing = byExercise.get(exercise.id);
    if (existing) {
      existing.push(result);
    } else {
      byExercise.set(exercise.id, [result]);
    }
  }

  const weakAreas: WeakArea[] = [];

  for (const entries of byExercise.values()) {
    const recent = [...entries]
      .sort((a, b) => b.sessionExercise.completedAt.localeCompare(a.sessionExercise.completedAt))
      .slice(0, limitPerExercise);

    const target = recent[0].exercise.scoringTarget as number;
    const sum = recent.reduce((acc, { sessionExercise }) => acc + (sessionExercise.resultValue ?? 0), 0);
    const averageRatio = sum / recent.length / target;

    if (averageRatio < WEAK_AREA_THRESHOLD) {
      weakAreas.push({ exercise: recent[0].exercise, averageRatio, attempts: recent.length });
    }
  }

  return weakAreas.sort((a, b) => a.averageRatio - b.averageRatio);
}
