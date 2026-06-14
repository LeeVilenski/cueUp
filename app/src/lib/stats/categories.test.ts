import { createEmptyCoverage, getCategoryCoverage, getNeglectedCategories } from '@/lib/stats/categories';
import { makeExercise, makeSessionExercise } from '@/lib/stats/test-fixtures';

describe('getCategoryCoverage', () => {
  it('counts results per category within the lookback window', () => {
    const now = new Date('2024-01-20T00:00:00.000Z');
    const potting = makeExercise({ id: 'potting-1', category: 'potting' });
    const safety = makeExercise({ id: 'safety-1', category: 'safety' });

    const results = [
      {
        sessionExercise: makeSessionExercise({ exerciseId: 'potting-1', completedAt: '2024-01-18T00:00:00.000Z' }),
        exercise: potting,
      },
      {
        sessionExercise: makeSessionExercise({ exerciseId: 'potting-1', completedAt: '2024-01-19T00:00:00.000Z' }),
        exercise: potting,
      },
      {
        sessionExercise: makeSessionExercise({ exerciseId: 'safety-1', completedAt: '2023-12-01T00:00:00.000Z' }),
        exercise: safety,
      },
    ];

    const coverage = getCategoryCoverage(results, 30, now);
    expect(coverage.potting).toBe(2);
    expect(coverage.safety).toBe(0);
    expect(coverage.break_building).toBe(0);
  });
});

describe('getNeglectedCategories', () => {
  it('returns categories with zero coverage', () => {
    const coverage = createEmptyCoverage();
    coverage.potting = 2;
    coverage.safety = 1;

    const neglected = getNeglectedCategories(coverage);
    expect(neglected).toEqual(
      expect.arrayContaining(['break_building', 'positional_play', 'cueing_fundamentals', 'match_practice']),
    );
    expect(neglected).not.toContain('potting');
    expect(neglected).not.toContain('safety');
  });
});
