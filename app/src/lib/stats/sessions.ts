import type { Session } from '@/db/schema';

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function addDaysToDayKey(key: string, days: number): string {
  const date = new Date(`${key}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return dayKey(date.toISOString());
}

export type SessionStreaks = {
  current: number;
  longest: number;
};

export function getSessionStreaks(sessions: Session[], now: Date = new Date()): SessionStreaks {
  const days = new Set(sessions.map((session) => dayKey(session.startedAt)));
  if (days.size === 0) return { current: 0, longest: 0 };

  const sortedDays = [...days].sort();

  let longest = 1;
  let run = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    run = sortedDays[i] === addDaysToDayKey(sortedDays[i - 1], 1) ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const todayKey = dayKey(now.toISOString());
  const yesterdayKey = addDaysToDayKey(todayKey, -1);

  let current = 0;
  let cursor = days.has(todayKey) ? todayKey : days.has(yesterdayKey) ? yesterdayKey : null;
  while (cursor != null && days.has(cursor)) {
    current += 1;
    cursor = addDaysToDayKey(cursor, -1);
  }

  return { current, longest };
}

export function getWeeklySessionCount(sessions: Session[], now: Date = new Date()): number {
  const dayOfWeek = now.getUTCDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const weekStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceMonday);

  return sessions.filter((session) => new Date(session.startedAt).getTime() >= weekStart).length;
}

export function getTotalPracticeMinutes(sessions: Session[]): number {
  return sessions.reduce((sum, session) => sum + (session.durationMins ?? 0), 0);
}
