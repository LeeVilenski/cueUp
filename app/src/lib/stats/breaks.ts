import type { BreakContext, BreakLog } from '@/db/schema';

export type PersonalBests = {
  overall: number | null;
  byContext: Record<BreakContext, number | null>;
};

export function getPersonalBests(breakLogs: BreakLog[]): PersonalBests {
  const bests: PersonalBests = {
    overall: null,
    byContext: { practice: null, match: null, league: null },
  };

  for (const log of breakLogs) {
    if (bests.overall == null || log.score > bests.overall) {
      bests.overall = log.score;
    }
    const current = bests.byContext[log.context];
    if (current == null || log.score > current) {
      bests.byContext[log.context] = log.score;
    }
  }

  return bests;
}

export function getRollingAverage(breakLogs: BreakLog[], limit = 10): number | null {
  if (breakLogs.length === 0) return null;

  const recent = [...breakLogs].sort((a, b) => b.achievedAt.localeCompare(a.achievedAt)).slice(0, limit);
  const sum = recent.reduce((acc, log) => acc + log.score, 0);
  return sum / recent.length;
}

export type BreakTrendPoint = {
  achievedAt: string;
  score: number;
};

export function getBreakTrend(breakLogs: BreakLog[], limit = 20): BreakTrendPoint[] {
  return [...breakLogs]
    .sort((a, b) => a.achievedAt.localeCompare(b.achievedAt))
    .slice(-limit)
    .map((log) => ({ achievedAt: log.achievedAt, score: log.score }));
}
