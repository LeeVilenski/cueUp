import { getWeakAreas } from '@/lib/stats/weak-areas';
import { makeExercise, makeSessionExercise } from '@/lib/stats/test-fixtures';

describe('getWeakAreas', () => {
  it('flags exercises whose recent average is below the threshold', () => {
    const exercise = makeExercise({ id: 'ex-1', scoringType: 'score_out_of', scoringTarget: 10 });
    const results = [
      {
        sessionExercise: makeSessionExercise({ exerciseId: 'ex-1', resultValue: 3, completedAt: '2024-01-01T00:00:00.000Z' }),
        exercise,
      },
      {
        sessionExercise: makeSessionExercise({ exerciseId: 'ex-1', resultValue: 4, completedAt: '2024-01-02T00:00:00.000Z' }),
        exercise,
      },
    ];

    const weakAreas = getWeakAreas(results);
    expect(weakAreas).toHaveLength(1);
    expect(weakAreas[0].exercise.id).toBe('ex-1');
    expect(weakAreas[0].averageRatio).toBeCloseTo(0.35);
    expect(weakAreas[0].attempts).toBe(2);
  });

  it('ignores exercises at or above the threshold', () => {
    const exercise = makeExercise({ id: 'ex-1', scoringType: 'score_out_of', scoringTarget: 10 });
    const results = [
      {
        sessionExercise: makeSessionExercise({ exerciseId: 'ex-1', resultValue: 9, completedAt: '2024-01-01T00:00:00.000Z' }),
        exercise,
      },
    ];

    expect(getWeakAreas(results)).toEqual([]);
  });

  it('ignores exercises without a numeric target', () => {
    const exercise = makeExercise({ id: 'ex-1', scoringType: 'break_value', scoringTarget: null });
    const results = [
      {
        sessionExercise: makeSessionExercise({ exerciseId: 'ex-1', resultValue: 5, completedAt: '2024-01-01T00:00:00.000Z' }),
        exercise,
      },
    ];

    expect(getWeakAreas(results)).toEqual([]);
  });

  it('only considers the most recent N attempts per exercise', () => {
    const exercise = makeExercise({ id: 'ex-1', scoringType: 'count_potted', scoringTarget: 10 });
    const results = [
      {
        sessionExercise: makeSessionExercise({ exerciseId: 'ex-1', resultValue: 9, completedAt: '2024-01-01T00:00:00.000Z' }),
        exercise,
      },
      {
        sessionExercise: makeSessionExercise({ exerciseId: 'ex-1', resultValue: 1, completedAt: '2024-01-02T00:00:00.000Z' }),
        exercise,
      },
      {
        sessionExercise: makeSessionExercise({ exerciseId: 'ex-1', resultValue: 1, completedAt: '2024-01-03T00:00:00.000Z' }),
        exercise,
      },
    ];

    const weakAreas = getWeakAreas(results, 2);
    expect(weakAreas).toHaveLength(1);
    expect(weakAreas[0].averageRatio).toBeCloseTo(0.1);
    expect(weakAreas[0].attempts).toBe(2);
  });

  it('sorts weak areas ascending by ratio', () => {
    const exerciseA = makeExercise({ id: 'ex-a', name: 'A', scoringType: 'score_out_of', scoringTarget: 10 });
    const exerciseB = makeExercise({ id: 'ex-b', name: 'B', scoringType: 'score_out_of', scoringTarget: 10 });

    const results = [
      {
        sessionExercise: makeSessionExercise({ exerciseId: 'ex-a', resultValue: 5, completedAt: '2024-01-01T00:00:00.000Z' }),
        exercise: exerciseA,
      },
      {
        sessionExercise: makeSessionExercise({ exerciseId: 'ex-b', resultValue: 1, completedAt: '2024-01-01T00:00:00.000Z' }),
        exercise: exerciseB,
      },
    ];

    const weakAreas = getWeakAreas(results);
    expect(weakAreas.map((w) => w.exercise.id)).toEqual(['ex-b', 'ex-a']);
  });
});
