import { getMatchRecord } from '@/lib/stats/matches';
import { makeMatch } from '@/lib/stats/test-fixtures';

describe('getMatchRecord', () => {
  it('returns zeroed record with no win rate when there are no matches', () => {
    expect(getMatchRecord([])).toEqual({ played: 0, wins: 0, losses: 0, draws: 0, winRate: null });
  });

  it('tallies wins, losses and draws and computes win rate', () => {
    const matches = [
      makeMatch({ id: 'm1', result: 'win' }),
      makeMatch({ id: 'm2', result: 'win' }),
      makeMatch({ id: 'm3', result: 'loss' }),
      makeMatch({ id: 'm4', result: 'draw' }),
    ];

    expect(getMatchRecord(matches)).toEqual({ played: 4, wins: 2, losses: 1, draws: 1, winRate: 0.5 });
  });
});
