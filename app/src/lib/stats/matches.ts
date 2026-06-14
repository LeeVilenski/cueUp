import type { Match } from '@/db/schema';

export type MatchRecord = {
  played: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number | null;
};

export function getMatchRecord(matches: Match[]): MatchRecord {
  const record: MatchRecord = { played: matches.length, wins: 0, losses: 0, draws: 0, winRate: null };

  for (const match of matches) {
    if (match.result === 'win') record.wins += 1;
    else if (match.result === 'loss') record.losses += 1;
    else record.draws += 1;
  }

  record.winRate = record.played > 0 ? record.wins / record.played : null;

  return record;
}
