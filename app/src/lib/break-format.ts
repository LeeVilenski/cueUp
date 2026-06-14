import type { BreakContext } from '@/db/schema';

export const BREAK_CONTEXT_LABELS: Record<BreakContext, string> = {
  practice: 'Practice',
  match: 'Match',
  league: 'League',
};

export const MAX_BREAK_SCORE = 147;
