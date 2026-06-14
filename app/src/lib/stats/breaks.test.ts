import { getBreakTrend, getPersonalBests, getRollingAverage } from '@/lib/stats/breaks';
import { makeBreakLog } from '@/lib/stats/test-fixtures';

describe('getPersonalBests', () => {
  it('returns nulls when there are no break logs', () => {
    expect(getPersonalBests([])).toEqual({
      overall: null,
      byContext: { practice: null, match: null, league: null },
    });
  });

  it('finds the overall and per-context maximum scores', () => {
    const logs = [
      makeBreakLog({ score: 40, context: 'practice' }),
      makeBreakLog({ score: 75, context: 'match' }),
      makeBreakLog({ score: 30, context: 'practice' }),
      makeBreakLog({ score: 50, context: 'league' }),
    ];

    expect(getPersonalBests(logs)).toEqual({
      overall: 75,
      byContext: { practice: 40, match: 75, league: 50 },
    });
  });
});

describe('getRollingAverage', () => {
  it('returns null when there are no break logs', () => {
    expect(getRollingAverage([])).toBeNull();
  });

  it('averages the most recent N logs by achievedAt', () => {
    const logs = [
      makeBreakLog({ score: 10, achievedAt: '2024-01-01T00:00:00.000Z' }),
      makeBreakLog({ score: 20, achievedAt: '2024-01-02T00:00:00.000Z' }),
      makeBreakLog({ score: 30, achievedAt: '2024-01-03T00:00:00.000Z' }),
      makeBreakLog({ score: 40, achievedAt: '2024-01-04T00:00:00.000Z' }),
    ];

    expect(getRollingAverage(logs, 2)).toBe(35);
    expect(getRollingAverage(logs, 10)).toBe(25);
  });
});

describe('getBreakTrend', () => {
  it('returns logs in chronological order, limited to the most recent N', () => {
    const logs = [
      makeBreakLog({ score: 10, achievedAt: '2024-01-01T00:00:00.000Z' }),
      makeBreakLog({ score: 20, achievedAt: '2024-01-02T00:00:00.000Z' }),
      makeBreakLog({ score: 30, achievedAt: '2024-01-03T00:00:00.000Z' }),
    ];

    expect(getBreakTrend(logs, 2)).toEqual([
      { achievedAt: '2024-01-02T00:00:00.000Z', score: 20 },
      { achievedAt: '2024-01-03T00:00:00.000Z', score: 30 },
    ]);
  });
});
