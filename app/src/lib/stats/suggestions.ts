import type { ExerciseCategory } from '@/db/schema';
import { ROUTINES, type Routine } from '@/lib/routines';
import type { CategoryCoverage } from '@/lib/stats/categories';

export function suggestRoutine(
  coverage: CategoryCoverage,
  exerciseCategoryById: Map<string, ExerciseCategory>,
  routines: Routine[] = ROUTINES,
): Routine {
  let best = routines[0];
  let bestScore = Infinity;

  for (const routine of routines) {
    const score = routine.exerciseIds.reduce((sum, exerciseId) => {
      const category = exerciseCategoryById.get(exerciseId);
      return sum + (category ? coverage[category] : 0);
    }, 0);

    if (score < bestScore) {
      bestScore = score;
      best = routine;
    }
  }

  return best;
}
