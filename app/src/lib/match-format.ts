import type { MatchResult } from '@/db/schema';

export const MATCH_RESULT_LABELS: Record<MatchResult, string> = {
  win: 'Win',
  loss: 'Loss',
  draw: 'Draw',
};

export const MAX_FRAME_SCORE = 147;

export function sanitizeIntegerInput(text: string, max: number): string {
  const cleaned = text.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '');
  if (cleaned === '') return '';
  return Number(cleaned) > max ? `${max}` : cleaned;
}
