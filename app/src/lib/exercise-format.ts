import type { Difficulty, Exercise, ScoringType } from '@/db/schema';

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const SCORING_TYPE_LABELS: Record<ScoringType, string> = {
  score_out_of: 'Score out of',
  count_potted: 'Balls potted',
  break_value: 'Break value',
  pass_fail: 'Pass / fail',
  time_based: 'Time based',
  notes_only: 'Notes only',
};

export function formatScoring(exercise: Exercise): string {
  const label = SCORING_TYPE_LABELS[exercise.scoringType];

  switch (exercise.scoringType) {
    case 'score_out_of':
      return exercise.scoringTarget != null
        ? `${label} ${exercise.scoringTarget}${exercise.scoringUnit ? ` ${exercise.scoringUnit}` : ''}`
        : label;
    case 'count_potted':
      return exercise.scoringTarget != null
        ? `${label} (target ${exercise.scoringTarget}${exercise.scoringUnit ? ` ${exercise.scoringUnit}` : ''})`
        : label;
    case 'break_value':
      return exercise.scoringUnit ? `${label} (${exercise.scoringUnit})` : label;
    default:
      return label;
  }
}

export function parseBulletList(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim().replace(/^-\s*/, ''))
    .filter((line) => line.length > 0);
}
