import type { ExerciseCategory } from '@/db/schema';
import { ROUTINES } from '@/lib/routines';
import { createEmptyCoverage } from '@/lib/stats/categories';
import { suggestRoutine } from '@/lib/stats/suggestions';

describe('suggestRoutine', () => {
  it('suggests the routine covering the most neglected categories', () => {
    const exerciseCategoryById = new Map<string, ExerciseCategory>([
      ['line-up-15-reds', 'potting'],
      ['long-pot-consistency-drill', 'potting'],
      ['cushion-first-drill', 'potting'],
      ['pendulum-straight-cue-drill', 'cueing_fundamentals'],
      ['pairs-colours-break-building', 'break_building'],
      ['century-break-practice', 'break_building'],
      ['the-spider-safety-routine', 'safety'],
      ['top-bottom-cushion-control', 'positional_play'],
      ['all-reds-safety-to-baulk', 'safety'],
    ]);

    const coverage = createEmptyCoverage();
    coverage.potting = 5;
    coverage.cueing_fundamentals = 5;
    coverage.break_building = 5;
    // safety and positional_play remain uncovered.

    const suggestion = suggestRoutine(coverage, exerciseCategoryById, ROUTINES);
    expect(suggestion.id).toBe('safety-position');
  });

  it('falls back to the first routine when coverage is identical', () => {
    const exerciseCategoryById = new Map<string, ExerciseCategory>();
    const coverage = createEmptyCoverage();

    const suggestion = suggestRoutine(coverage, exerciseCategoryById, ROUTINES);
    expect(suggestion.id).toBe(ROUTINES[0].id);
  });
});
